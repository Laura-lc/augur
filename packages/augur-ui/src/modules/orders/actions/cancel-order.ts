import {
  cancelZeroXOpenOrder,
  cancelZeroXOpenBatchOrders,
} from 'modules/contracts/actions/contractCalls';
import { ThunkDispatch } from 'redux-thunk';
import { CANCELORDER } from 'modules/common/constants';
import { addAlert } from 'modules/alerts/actions/alerts';
import { Action } from 'redux';
import { removeCanceledOrder } from 'modules/orders/actions/update-order-status';

const BATCH_CANCEL_MAX = 4;

export const cancelAllOpenOrders = orders => async (
  dispatch: ThunkDispatch<void, any, Action>
) => {
  let orderHashes = orders.map(order => order.id);

  try {
    orders.forEach(order => {
      sendCancelAlert(order, dispatch);
    });
    if (orderHashes.length > BATCH_CANCEL_MAX) {
      var i = 0;
      while(i < orderHashes.length) {
        var orderHashesToCancel = orderHashes.slice(i, Math.min(i + BATCH_CANCEL_MAX, orderHashes.length));
        await cancelZeroXOpenBatchOrders(orderHashesToCancel);  
        i += BATCH_CANCEL_MAX;
      }
    }
    else {
      await cancelZeroXOpenBatchOrders(orderHashes);  
    }
    
  } catch (error) {
    orders.forEach(order => {
      dispatch(removeCanceledOrder(order.id));
    });
    console.error('Error canceling batch orders', error);
    throw error;
  }
};

export const cancelOrder = order => async (
  dispatch: ThunkDispatch<void, any, Action>
) => {
  try {
    const { id } = order;
    sendCancelAlert(order, dispatch);
    await cancelZeroXOpenOrder(id);
  } catch (error) {
    console.error('Error canceling order', error);
    throw error;
  }
};

const sendCancelAlert = (order, dispatch) => {
  const { id } = order;

  dispatch(
    addAlert({
      id,
      uniqueId: id,
      name: CANCELORDER,
      status: '',
      params: {
        ...order,
      },
    })
  );
};
