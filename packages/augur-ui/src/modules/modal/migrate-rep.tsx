import React, { useState, useEffect } from 'react';

import { ButtonsRow, Title } from 'modules/modal/common';
import { formatRep, formatGasCostToEther } from 'utils/format-number';
import Styles from 'modules/modal/modal.styles.less';
import { createBigNumber, BigNumber } from 'utils/create-big-number';
import { LoginAccount } from 'modules/types';
import { ExternalLinkButton } from 'modules/common/buttons';
import { LinearPropertyLabel } from 'modules/common/labels';
import { InfoIcon } from 'modules/common/icons';
import { displayGasInDai } from 'modules/app/actions/get-ethToDai-rate';
import { V1_REP_MIGRATE_ESTIMATE, MIGRATE_V1_V2 } from 'modules/common/constants';
import { TXEventName } from '@augurproject/sdk/src';

interface MigrateRepForm {
  closeAction: Function;
  loginAccount: LoginAccount;
  convertV1ToV2: Function;
  Gnosis_ENABLED: boolean;
  ethToDaiRate: BigNumber;
  convertV1ToV2Estimate: Function;
  gasPrice: number;
  addPendingData: Function;
}

export const MigrateRep = (props: MigrateRepForm) => {
  const {
    closeAction,
    convertV1ToV2,
    loginAccount,
    Gnosis_ENABLED,
    convertV1ToV2Estimate,
    ethToDaiRate,
    gasPrice,
    addPendingData
  } = props;

  const [gasLimit, setGasLimit] = useState(V1_REP_MIGRATE_ESTIMATE);

  useEffect(() => {
    if (Gnosis_ENABLED) {
      convertV1ToV2Estimate().then(gasLimit => {
        setGasLimit(gasLimit);
      });
    }
  }, []);

  const gasEstimate = formatGasCostToEther(
    gasLimit,
    { decimalsRounded: 4 },
    gasPrice,
  );

  return (
    <div className={Styles.MigrateRep}>
      <Title title={'Migrate Rep'} closeAction={closeAction} />

      <main>
        <h1>You have V1 REP in your wallet</h1>
        <h2>
          Migrate your V1 REP to V2 REP to use it in Augur V2. The quantity of V1 REP shown below will migrate to an equal amount of V2 REP. For example 100 V1 REP will migrate to 100 V2 REP.
          <ExternalLinkButton label='Learn more' URL='http://docs.augur.net/' />
        </h2>
        <div>
          <span>V1 REP to migrate</span>
          <span>
            {formatRep(loginAccount.balances.legacyRep).formattedValue}
          </span>
        </div>
        <div>
          <LinearPropertyLabel
            key='cost'
            label={Gnosis_ENABLED ? 'Transaction Fee' : 'Gas Cost'}
            value={
              Gnosis_ENABLED
                ? displayGasInDai(gasEstimate, ethToDaiRate)
                : gasEstimate
            }
          />
        </div>

        <div>
          {InfoIcon} Your wallet will need to sign <span>2</span> transactions
        </div>
      </main>
      <ButtonsRow
        buttons={[
          {
            text: 'Migrate',
            action: () => {
              closeAction();
              addPendingData(MIGRATE_V1_V2, MIGRATE_V1_V2, TXEventName.Pending, MIGRATE_V1_V2);
              convertV1ToV2();
            },
            disabled:
              formatRep(loginAccount.balances.legacyRep).fullPrecision < 0,
          },
          {
            text: 'Cancel',
            action: closeAction,
          },
        ]}
      />
    </div>
  );
};
