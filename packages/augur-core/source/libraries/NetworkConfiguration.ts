import { ethers } from 'ethers';
import { NetworkId } from '@augurproject/artifacts';

interface NetworkOptions {
    isProduction: boolean;
    http: string;
    ws?: string;
    ipc?: string;
    privateKey?: string;
    gasPrice: ethers.utils.BigNumber;
    gasLimit: ethers.utils.BigNumber;
    gnosisRelayerAddress?: string; // fauceting during deploy only happens if specified
    zeroxEndpoint?: string,
    gnosisRelayerUrl?: string
}

export const NETWORKS = [
    'aura',
    'clique',
    'environment',
    'rinkeby',
    'ropsten',
    'kovan',
    'thunder',
    'testrpc',
    'mainnet'
] as const;

export type NETWORKS = typeof NETWORKS[number];

export function isNetwork(x: any): x is NETWORKS {
    return NETWORKS.includes(x);
}

export type NetworkIdToNetwork = {
    [P in NetworkId]?: NETWORKS;
};

export const NETID_TO_NETWORK: NetworkIdToNetwork = {
    1: 'mainnet',
    3: 'ropsten',
    4: 'rinkeby',
    42: 'kovan'
};

type NetworksToOptions = {
    [P in NETWORKS]?: NetworkOptions;
};

const networks: NetworksToOptions = {
    ropsten: {
        isProduction: false,
        http:
            'https://eth-ropsten.alchemyapi.io/jsonrpc/Kd37_uEmJGwU6pYq6jrXaJXXi8u9IoOM',
        privateKey: process.env.ETHEREUM_PRIVATE_KEY,
        gasPrice: new ethers.utils.BigNumber(20 * 1000000000),
        gasLimit:
            typeof process.env.ETHEREUM_GAS_LIMIT === 'undefined'
                ? new ethers.utils.BigNumber(7500000)
                : new ethers.utils.BigNumber(process.env.ETHEREUM_GAS_LIMIT)
    },
    kovan: {
        isProduction: false,
        http:
            'https://eth-kovan.alchemyapi.io/jsonrpc/1FomA6seLdWDvpIRvL9J5NhwPHLIGbWA',
        privateKey: process.env.ETHEREUM_PRIVATE_KEY,
        gasPrice: (typeof process.env.ETHEREUM_GAS_PRICE_IN_NANOETH === 'undefined'
                ? new ethers.utils.BigNumber(20)
                : new ethers.utils.BigNumber(process.env.ETHEREUM_GAS_PRICE_IN_NANOETH!)
        ).mul(new ethers.utils.BigNumber(1e9)),
        gasLimit:
            typeof process.env.ETHEREUM_GAS_LIMIT === 'undefined'
                ? new ethers.utils.BigNumber(7500000)
                : new ethers.utils.BigNumber(process.env.ETHEREUM_GAS_LIMIT),
        gnosisRelayerAddress: '0x01d640bff4b3a5e5cc720f0be37847f88edf626e',
        zeroxEndpoint: 'wss://v2.augur.net/0x-ws',
        gnosisRelayerUrl: 'https://gnosis.kovan.augur.net/api/'
    },
    rinkeby: {
        isProduction: false,
        http:
            'https://eth-rinkeby.alchemyapi.io/jsonrpc/Kd37_uEmJGwU6pYq6jrXaJXXi8u9IoOM',
        ws: 'wss://rinkeby.augur.net/ethereum-ws',
        privateKey: process.env.ETHEREUM_PRIVATE_KEY,
        gasPrice: (typeof process.env.ETHEREUM_GAS_PRICE_IN_NANOETH === 'undefined'
                ? new ethers.utils.BigNumber(20)
                : new ethers.utils.BigNumber(process.env.ETHEREUM_GAS_PRICE_IN_NANOETH!)
        ).mul(new ethers.utils.BigNumber(1e9)),
        gasLimit:
            typeof process.env.ETHEREUM_GAS_LIMIT === 'undefined'
                ? new ethers.utils.BigNumber(6900000)
                : new ethers.utils.BigNumber(process.env.ETHEREUM_GAS_LIMIT)
    },
    clique: {
        isProduction: false,
        http: 'http://clique.ethereum.nodes.augur.net',
        privateKey:
            process.env.ETHEREUM_PRIVATE_KEY ||
            'fae42052f82bed612a724fec3632f325f377120592c75bb78adfcceae6470c5a',
        gasPrice: new ethers.utils.BigNumber(1),
        gasLimit:
            typeof process.env.ETHEREUM_GAS_LIMIT === 'undefined'
                ? new ethers.utils.BigNumber(7500000)
                : new ethers.utils.BigNumber(process.env.ETHEREUM_GAS_LIMIT)
    },
    environment: {
        isProduction: process.env.PRODUCTION === 'true' || false,
        http: 'http://localhost:8545',
        ws: 'ws://localhost:8546',
        privateKey:
            process.env.ETHEREUM_PRIVATE_KEY ||
            'fae42052f82bed612a724fec3632f325f377120592c75bb78adfcceae6470c5a',
        gasPrice: (typeof process.env.ETHEREUM_GAS_PRICE_IN_NANOETH === 'undefined'
                ? new ethers.utils.BigNumber(20)
                : new ethers.utils.BigNumber(process.env.ETHEREUM_GAS_PRICE_IN_NANOETH!)
        ).mul(new ethers.utils.BigNumber(1000000000)),
        gasLimit:
            typeof process.env.ETHEREUM_GAS_LIMIT === 'undefined'
                ? new ethers.utils.BigNumber(7500000)
                : new ethers.utils.BigNumber(process.env.ETHEREUM_GAS_LIMIT),
        gnosisRelayerAddress: '0x9d4c6d4b84cd046381923c9bc136d6ff1fe292d9',
        zeroxEndpoint: 'ws://localhost:60557',
        gnosisRelayerUrl: 'http://localhost:8888/api/'
    },
    mainnet: {
        isProduction: true,
        http:
            'https://eth-mainnet.alchemyapi.io/jsonrpc/Kd37_uEmJGwU6pYq6jrXaJXXi8u9IoOM',
        privateKey:
            process.env.ETHEREUM_PRIVATE_KEY ||
            'fae42052f82bed612a724fec3632f325f377120592c75bb78adfcceae6470c5a',
        gasPrice: (typeof process.env.ETHEREUM_GAS_PRICE_IN_NANOETH === 'undefined'
                ? new ethers.utils.BigNumber(20)
                : new ethers.utils.BigNumber(process.env.ETHEREUM_GAS_PRICE_IN_NANOETH!)
        ).mul(new ethers.utils.BigNumber(1e9)),
        gasLimit:
            typeof process.env.ETHEREUM_GAS_LIMIT === 'undefined'
                ? new ethers.utils.BigNumber(7500000)
                : new ethers.utils.BigNumber(process.env.ETHEREUM_GAS_LIMIT)
    }
};

export class NetworkConfiguration {
    constructor(
        readonly networkName: NETWORKS,
        readonly isProduction: boolean,
        readonly gasPrice: ethers.utils.BigNumber,
        readonly gasLimit: ethers.utils.BigNumber,
        readonly http: string,
        readonly ws?: string,
        readonly ipc?: string,
        readonly privateKey?: string,
        readonly gnosisRelayerAddress?: string, // fauceting during deploy only happens if specified
        readonly zeroxEndpoint?: string,
        readonly gnosisRelayerUrl?: string
    ) {
    }

    static create(
        networkName: NETWORKS = typeof process.env.TESTRPC === 'undefined'
            ? 'environment'
            : 'testrpc',
        validatePrivateKey = true,
        privateKey?: string,
    ): NetworkConfiguration {
        const network = networks[networkName];

        if (privateKey) {
            network.privateKey = privateKey;
        }

        if (
            networkName === 'environment' &&
            (process.env.ETHEREUM_HTTP ||
                process.env.ETHEREUM_WS ||
                process.env.ETHEREUM_IPC)
        ) {
            Object.assign(network, {
                http: process.env.ETHEREUM_HTTP,
                ws: process.env.ETHEREUM_WS,
                ipc: process.env.ETHEREUM_IPC
            });
        }
        if (network === undefined || network === null) {
            throw new Error(`Network configuration ${networkName} not found`);
        }
        if (
            validatePrivateKey &&
            (network.privateKey === undefined || network.privateKey === null)
        ) {
            throw new Error(
                `Network configuration for ${networkName} has no private key available. Check that this key is in the environment ETHEREUM_PRIVATE_KEY`
            );
        }

        return new NetworkConfiguration(
            networkName,
            network.isProduction,
            network.gasPrice,
            network.gasLimit,
            network.http,
            network.ws,
            network.ipc,
            network.privateKey,
            network.gnosisRelayerAddress,
            network.zeroxEndpoint,
            network.gnosisRelayerUrl
        );
    }
}
