import WebSocket from 'isomorphic-ws';
import WebSocketAsPromised from 'websocket-as-promised';
import { SubscriptionEventName } from '../constants';
import { Callback, SubscriptionType } from '../events';
import { SDKConfiguration } from '../state';
import { BaseConnector } from './base-connector';

export class WebsocketConnector extends BaseConnector {
  private socket: WebSocketAsPromised;

  constructor() {
    super();
  }

  async connect(config: SDKConfiguration, account?: string): Promise<void> {
    this.socket = new WebSocketAsPromised(config.sdk.ws, {
      packMessage: (data: any) => JSON.stringify(data),
      unpackMessage: (message: string) => JSON.parse(message),
      attachRequestId: (data: any, requestId: number) =>
        Object.assign({ id: requestId }, data),
      extractRequestId: (data: any) => data && data.id,
      createWebSocket: (url: string) => new WebSocket(url),
    } as any);

    this.socket.onMessage.addListener((message: string) => {
      try {
        const response = JSON.parse(message);
        this.messageReceived(response.result);
      } catch (error) {
        console.error('Bad JSON RPC response: ' + message);
      }
    });

    this.socket.onClose.addListener((message: string) => {
      console.log('Websocket closed');
      console.log(message);
    });

    this.socket.open();
  }

  messageReceived(message: any) {
    if (message.result) {
      if (this.subscriptions[message.eventName]) {
        this.subscriptions[message.eventName].callback(message.result);
      }
    }
  }

  async disconnect(): Promise<any> {
    return this.socket.close();
  }

  bindTo<R, P>(
    f: (db: any, augur: any, params: P) => Promise<R>
  ): (params: P) => Promise<R> {
    return async (params: P): Promise<R> => {
      return this.socket.sendRequest({
        method: f.name,
        params,
        jsonrpc: '2.0',
      });
    };
  }

  async on<T extends SubscriptionType>(
    eventName: SubscriptionEventName | string,
    callback: Callback
  ): Promise<void> {
    const response: any = await this.socket.sendRequest({
      method: 'subscribe',
      eventName,
      jsonrpc: '2.0',
      params: [eventName],
    });
    this.subscriptions[eventName] = {
      id: response.result.subscription,
      callback: super.callbackWrapper(eventName, callback),
    };
  }

  async off(eventName: SubscriptionEventName | string): Promise<void> {
    const subscription = this.subscriptions[eventName];
    if (subscription) {
      await this.socket.sendRequest({
        method: 'unsubscribe',
        subscription: subscription.id,
        jsonrpc: '2.0',
        params: [subscription.id],
      });
      delete this.subscriptions[eventName];
    }
  }
}
