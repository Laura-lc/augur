import { ORDER_TYPES } from '@augurproject/sdk/build';
import { createSeed } from '@augurproject/tools/build';
import { writeSeedFile } from '@augurproject/tools/build/libs/ganache';
import { BigNumber } from 'bignumber.js';

import { makeProvider, makeProviderWithDB } from '../../libs';
import {
  ContractAPI,
  loadSeedFile,
  ACCOUNTS,
  defaultSeedPath,
} from '@augurproject/tools';
import { stringTo32ByteHex } from '../../libs/Utils';

const outcome0 = new BigNumber(0);
const outcome1 = new BigNumber(1);

(async () => {
  const seed = await loadSeedFile(defaultSeedPath);
  const [db, provider] = await makeProviderWithDB(seed, ACCOUNTS);

  const john = await ContractAPI.userWrapper(
    ACCOUNTS[0],
    provider,
    seed.addresses
  );
  const mary = await ContractAPI.userWrapper(
    ACCOUNTS[1],
    provider,
    seed.addresses
  );

  await john.approveCentralAuthority();
  await mary.approveCentralAuthority();

  await john.createReasonableYesNoMarket();
  await john.createReasonableYesNoMarket();

  const yesNoMarket = await john.createReasonableYesNoMarket();
  const categoricalMarket = await john.createReasonableMarket(
    [stringTo32ByteHex('A'), stringTo32ByteHex('B'), stringTo32ByteHex('C')]
  );

  // Place orders
  const numShares = new BigNumber(10000000000000);
  const price = new BigNumber(22);
  await john.placeOrder(
    yesNoMarket.address,
    ORDER_TYPES.BID,
    numShares,
    price,
    outcome0,
    stringTo32ByteHex(''),
    stringTo32ByteHex(''),
    stringTo32ByteHex('42')
  );
  await john.placeOrder(
    yesNoMarket.address,
    ORDER_TYPES.BID,
    numShares,
    price,
    outcome1,
    stringTo32ByteHex(''),
    stringTo32ByteHex(''),
    stringTo32ByteHex('42')
  );
  await john.placeOrder(
    categoricalMarket.address,
    ORDER_TYPES.BID,
    numShares,
    price,
    outcome0,
    stringTo32ByteHex(''),
    stringTo32ByteHex(''),
    stringTo32ByteHex('42')
  );
  await john.placeOrder(
    categoricalMarket.address,
    ORDER_TYPES.BID,
    numShares,
    price,
    outcome1,
    stringTo32ByteHex(''),
    stringTo32ByteHex(''),
    stringTo32ByteHex('42')
  );

  // Fill orders
  await john.faucet(new BigNumber(1e18)); // faucet enough cash for the various fill orders
  await mary.faucet(new BigNumber(1e18)); // faucet enough cash for the various fill orders
  let yesNoOrderId0 = await john.getBestOrderId(
    ORDER_TYPES.BID,
    yesNoMarket.address,
    outcome0
  );
  let yesNoOrderId1 = await john.getBestOrderId(
    ORDER_TYPES.BID,
    yesNoMarket.address,
    outcome1
  );
  let categoricalOrderId0 = await john.getBestOrderId(
    ORDER_TYPES.BID,
    categoricalMarket.address,
    outcome0
  );
  let categoricalOrderId1 = await john.getBestOrderId(
    ORDER_TYPES.BID,
    categoricalMarket.address,
    outcome1
  );
  await john.fillOrder(
    yesNoOrderId0,
    numShares.div(10).multipliedBy(2),
    '42'
  );
  await mary.fillOrder(
    yesNoOrderId1,
    numShares.div(10).multipliedBy(3),
    '43'
  );
  await mary.fillOrder(
    categoricalOrderId0,
    numShares.div(10).multipliedBy(2),
    '43'
  );
  await mary.fillOrder(
    categoricalOrderId1,
    numShares.div(10).multipliedBy(4),
    '43'
  );


  const newSeed = await createSeed(provider, db, seed.addresses);
  await writeSeedFile(newSeed, '/tmp/newSeed.json');
})().catch(e => console.error(e));
