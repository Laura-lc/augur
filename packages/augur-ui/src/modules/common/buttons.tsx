import React from 'react';
import { connect } from 'react-redux';
import { ASCENDING, DESCENDING, BUY } from 'modules/common/constants';
import {
  StarIcon,
  SortIcon,
  PercentIcon,
  QRCodeIcon,
  PaperAirplaneIcon,
  DoubleArrowIcon,
  RepLogoIcon,
  DaiLogoIcon,
  ViewIcon,
  DownloadIcon,
  RotatableChevron,
  Filter,
  TwoArrowsOutline,
  XIcon,
  BackIcon,
  AlternateDaiLogoIcon,
} from 'modules/common/icons';
import classNames from 'classnames';
import { getNetworkId } from 'modules/contracts/actions/contractCalls';
import Styles from 'modules/common/buttons.styles.less';
import { AppState } from 'appStore';
import { MARKET_TEMPLATES } from 'modules/create-market/constants';
import { Getters, TXEventName } from '@augurproject/sdk/src';
import { addCategoryStats } from 'modules/create-market/get-template';
import ChevronFlip from 'modules/common/chevron-flip';
import { Link } from 'react-router-dom';

export interface DefaultButtonProps {
  id?: string;
  text?: string;
  action: Function;
  disabled?: boolean;
  title?: string;
  icon?: any;
  small?: boolean;
  noIcon?: boolean;
  subText?: string;
  pointDown?: boolean;
  reportingStatus?: string;
  URL?: string;
}

export interface SortButtonProps {
  text: string;
  action: Function;
  disabled?: boolean;
  sortOption: NEUTRAL | ASCENDING | DESCENDING;
}

export interface DirectionButtonProps {
  action: Function;
  disabled?: boolean;
  title?: string;
  left?: boolean;
}

export interface DefaultActionButtonProps {
  action: Function;
  disabled?: boolean;
  title?: string;
}

export interface DaiPercentProps {
  action: Function;
  disabled?: boolean;
  title?: string;
  showDai: boolean;
}

export interface OrderButtonProps extends DefaultButtonProps {
  type: BUY | SELL;
  initialLiquidity: Boolean;
}

export interface FavoritesButtonProps {
  isFavorite: boolean;
  hideText?: boolean;
  isSmall?: boolean;
  text?: string;
  action: Function;
  disabled?: boolean;
  title?: string;
}

export interface ViewTransactionDetailsButtonProps {
  transactionHash: string;
  label?: string;
  light?: boolean;
}

export interface ExternalLinkButtonProps {
  label: string;
  showNonLink?: boolean;
  action?: Function;
  URL?: string;
  light?: boolean;
  customLink?: any;
  callback?: Function;
}

export interface ExternalLinkTextProps {
  title?: string;
  label: string;
  URL: string;
}

export const PrimaryButton = (props: DefaultButtonProps) => (
  <>
    {props.URL && (
      <a href={props.URL} target="blank">
        <button
          onClick={e => props.action(e)}
          className={Styles.PrimaryButton}
          disabled={props.disabled}
          title={props.title || props.text}
        >
          {props.text}
        </button>
      </a>
    )}
    {!props.URL && (
      <button
        onClick={e => props.action(e)}
        className={Styles.PrimaryButton}
        disabled={props.disabled}
        title={props.title || props.text}
      >
        {props.text}
      </button>
    )}
  </>
);

export const SecondaryButton = (props: DefaultButtonProps) => (
  <button
    onClick={e => props.action(e)}
    className={classNames(Styles.SecondaryButton, {
      [Styles.Small]: props.small,
    })}
    disabled={props.disabled}
    title={props.title || props.text}
  >
    {!!props.icon && props.icon}
    {props.text}
  </button>
);

export const ProcessingButton = (props: DefaultButtonProps) => {
  let buttonText = 'Report';
  if (props.reportingStatus === TXEventName.Pending) {
    buttonText = 'Processing...';
  } else if (props.reportingStatus === TXEventName.Success) {
    buttonText = 'Confirmed!';
  }
  return (
    <PrimaryButton
      text={buttonText}
      action={e => props.action(e)}
      disabled={props.disabled || props.reportingStatus}
    />
  );
};

export const PrimarySignInButton = (props: DefaultButtonProps) => (
  <button
    onClick={e => props.action(e)}
    className={Styles.PrimarySignInButton}
    disabled={props.disabled}
    title={props.title || props.text}
  >
    <div>
      <div>{props.icon}</div>
      <div>
        <div>{props.text}</div>
        <div>{props.subText}</div>
      </div>
    </div>
  </button>
);

export const CloseButton = (props: DefaultButtonProps) => (
  <button
    className={Styles.CloseButton}
    onClick={e => props.action(e)}
    disabled={props.disabled}
  >
    {XIcon}
  </button>
);

export const BackButton = (props: DefaultButtonProps) => (
  <button
    className={Styles.BackButton}
    onClick={e => props.action(e)}
    disabled={props.disabled}
  >
    {BackIcon} back
  </button>
);

export const SecondarySignInButton = (props: DefaultButtonProps) => (
  <button
    onClick={e => props.action(e)}
    className={classNames(Styles.SecondarySignInButton, {
      [Styles.Small]: props.small,
    })}
    disabled={props.disabled}
    title={props.title || props.text}
  >
    <div>
      <div>{props.icon}</div>
      <div>
        <div>{props.text}</div>
        <div>{props.subText}</div>
      </div>
    </div>
  </button>
);

export const OrderButton = (props: OrderButtonProps) => (
  <button
    onClick={e => props.action(e)}
    className={
      props.type === BUY ? Styles.BuyOrderButton : Styles.SellOrderButton
    }
    disabled={props.disabled}
    title={props.title}
  >
    {props.initialLiquidity && 'Add Order'}
    {!props.initialLiquidity &&
      (props.type === BUY ? 'Place Buy Order' : 'Place Sell Order')}
  </button>
);

export const FavoritesButton = ({
  isFavorite,
  isSmall,
  action,
  disabled,
  title,
  hideText,
}: FavoritesButtonProps) => (
  <button
    onClick={e => action(e)}
    className={classNames(Styles.FavoriteButton, {
      [Styles.FavoriteButton_Favorite]: isFavorite,
      [Styles.FavoriteButton_small]: isSmall,
    })}
    disabled={disabled}
    title={title}
  >
    {StarIcon}
    {!hideText && `${isFavorite ? ' Remove from' : ' Add to'} watchlist`}
  </button>
);

export const CompactButton = (props: DefaultButtonProps) => (
  <button
    onClick={e => props.action(e)}
    className={Styles.CompactButton}
    disabled={props.disabled}
    title={props.title}
  >
    {props.text}
  </button>
);

export const DaiPercentButton = (props: DaiPercentProps) => (
  <button
    onClick={e => props.action(e)}
    className={classNames(Styles.CompactButton, Styles.DaiPercentButton)}
    disabled={props.disabled}
    title={props.title}
  >
    {!props.showDai ? AlternateDaiLogoIcon : PercentIcon}
  </button>
);

interface ToggleExtendButtonProps {
  toggle: Function;
  hide?: boolean;
  extended?: boolean;
  disabled?: boolean;
}

export const ToggleExtendButton = (props: ToggleExtendButtonProps) => (
  <button
    onClick={e => props.toggle(e)}
    className={Styles.ToggleExtendButton}
    disabled={props.disabled}
  >
    {TwoArrowsOutline}
  </button>
);

export const CancelTextButton = ({
  text,
  action,
  title,
  disabled,
}: DefaultButtonProps) => (
  <button
    onClick={e => action(e)}
    className={classNames(Styles.CancelTextButton, {
      [Styles.IconButton]: !text,
    })}
    disabled={disabled}
    title={title}
  >
    {text || XIcon}
  </button>
);

// Only used in ADVANCED button in trade-form
export const TextButtonFlip = (props: DefaultButtonProps) => (
  <button
    onClick={e => props.action(e)}
    className={Styles.CancelTextButton}
    disabled={props.disabled}
    title={props.title}
  >
    {props.text}
    <ChevronFlip
      pointDown={props.pointDown}
      stroke="#BFB8CE"
      filledInIcon
      instant
    />
  </button>
);

export const SubmitTextButton = (props: DefaultButtonProps) => (
  <button
    onClick={e => props.action(e)}
    className={Styles.SubmitTextButton}
    disabled={props.disabled}
    title={props.title}
  >
    {props.text}
  </button>
);

export const DepositButton = (props: DefaultActionButtonProps) => (
  <button
    onClick={e => props.action(e)}
    className={Styles.PrimaryButton}
    disabled={props.disabled}
    title={props.title || 'Deposit'}
  >
    Add funds
  </button>
);

export const WithdrawButton = (props: DefaultActionButtonProps) => (
  <button
    onClick={e => props.action(e)}
    className={Styles.CurrenyActionButton}
    disabled={props.disabled}
    title={props.title || 'Withdraw'}
  >
    Withdraw funds
  </button>
);

export const ViewTransactionsButton = (props: DefaultActionButtonProps) => (
  <button
    onClick={e => props.action(e)}
    className={Styles.ViewTransactionsButton}
    disabled={props.disabled}
    title={props.title || 'View Transactions'}
  >
    View Transactions
    {DoubleArrowIcon}
  </button>
);

export const REPFaucetButton = (props: DefaultActionButtonProps) => (
  <button
    onClick={e => props.action(e)}
    className={Styles.REPFaucetButton}
    disabled={props.disabled}
    title={props.title || 'REP Faucet'}
  >
    <span>{props.title ? props.title : 'REP Faucet'}</span>
    {RepLogoIcon}
  </button>
);

export const DAIFaucetButton = (props: DefaultActionButtonProps) => (
  <button
    onClick={e => props.action(e)}
    className={Styles.DAIFaucetButton}
    disabled={props.disabled}
    title={props.title || 'DAI Faucet'}
  >
    <span>DAI Faucet</span>
    {DaiLogoIcon}
  </button>
);

export const ApprovalButton = (props: DefaultActionButtonProps) => (
  <button
    onClick={e => props.action(e)}
    className={Styles.DAIFaucetButton}
    disabled={props.disabled}
    title={props.title || 'Approval'}
  >
    <span>Approval</span>
  </button>
);

export const ExportButton = (props: DefaultActionButtonProps) => (
  <button
    onClick={e => props.action(e)}
    className={Styles.ExportButton}
    disabled={props.disabled}
    title={props.title || 'Export Complete History'}
  >
    Export Complete History
    {DownloadIcon}
  </button>
);

export const DirectionButton = (props: DirectionButtonProps) => (
  <button
    onClick={e => props.action(e)}
    className={classNames(Styles.DirectionButton, {
      [Styles.left]: props.left,
    })}
    disabled={props.disabled}
    title={props.title}
  >
    {RotatableChevron}
  </button>
);

export const ViewTransactionDetailsButton = (
  props: ViewTransactionDetailsButtonProps
) => (
  <div
    className={classNames(Styles.ViewTransactionDetailsButton, {
      [Styles.Light]: props.light,
    })}
  >
    <EtherscanLink
      showNonLink
      txhash={props.transactionHash}
      label={props.label ? props.label : 'View'}
    />
    {ViewIcon}
  </div>
);

export const ExternalLinkText = (props: ExternalLinkTextProps) => (
  <button className={Styles.ExternalLinkText}>
    {props.URL && (
      <a href={props.URL} target="blank">
        {props.title ? (
          <>
            <strong>{props.title}</strong>
            {props.label}
          </>
        ) : (
          props.label
        )}
      </a>
    )}

    {ViewIcon}
  </button>
);

export const ExternalLinkButton = (props: ExternalLinkButtonProps) => (
  <button
    className={classNames(Styles.ExternalLinkButton, {
      [Styles.LightAlternate]: props.light,
    })}
    onClick={e => {
      props.action && props.action(e);
      props.callback && props.callback();
    }}
  >
    {props.customLink ? (
      <Link to={props.customLink}>{props.label}</Link>
    ) : (
      <>
        {props.URL && (
          <a href={props.URL} target="blank">
            {props.label}
          </a>
        )}
        {!props.URL && <span>{props.label}</span>}
      </>
    )}

    {!props.showNonLink && ViewIcon}
  </button>
);

export const SortButton = (props: SortButtonProps) => (
  <button
    onClick={e => props.action(e)}
    className={classNames(Styles.SortButton, {
      [Styles.Ascending]: props.sortOption === ASCENDING,
      [Styles.Descending]: props.sortOption === DESCENDING,
    })}
    disabled={props.disabled}
  >
    {SortIcon}
    {props.text}
  </button>
);

export interface CategoryButtonsProps {
  action: Function;
  categoryStats: Getters.Markets.CategoryStats;
}

export const CategoryButtons = ({
  action,
  categoryStats = {},
}: CategoryButtonsProps) => (
  <div className={Styles.CategoryButtons}>
    {MARKET_TEMPLATES.map((item, idx) => {
      const hasData = Object.keys(categoryStats).length > 0;
      const card = addCategoryStats(null, item, categoryStats);
      return (
        <div key={idx} onClick={() => action(card.value.toLowerCase())}>
          <div>{item.icon}</div>
          <div>{item.header}</div>
          <div className={!hasData ? Styles.loading : ''}>
            {hasData ? card.description : ''}
          </div>
        </div>
      );
    })}
  </div>
);

export const FilterButton = (props: DefaultActionButtonProps) => (
  <button
    onClick={e => props.action(e)}
    className={Styles.FilterButton}
    disabled={props.disabled}
  >
    Categories & Filters
    {Filter}
  </button>
);

interface EtherscanLinkTSXProps {
  baseUrl?: string | null;
  txhash: string;
  label: string;
  showNonLink?: boolean;
}

const EtherscanLinkTSX = ({
  baseUrl,
  txhash,
  label,
  showNonLink,
}: EtherscanLinkTSXProps) => (
  <span>
    {baseUrl && (
      <a href={baseUrl + txhash} target="blank">
        {label}
      </a>
    )}
    {!baseUrl && showNonLink && <span>{label}</span>}
  </span>
);

EtherscanLinkTSX.defaultProps = {
  baseUrl: null,
  showNonLink: false,
};

const mapStateToPropsEtherScanLink = (state: AppState) => {
  const networkId = getNetworkId();

  if (!networkId) {
    return null;
  }

  const networkLink = {
    1: 'https://etherscan.io/tx/',
    3: 'https://ropsten.etherscan.io/tx/',
    4: 'https://rinkeby.etherscan.io/tx/',
    19: 'http://scan.thundercore.com/tx/',
    42: 'https://kovan.etherscan.io/tx/',
  };

  return {
    baseUrl: networkLink[networkId],
  };
};

export const EtherscanLink = connect(mapStateToPropsEtherScanLink)(
  EtherscanLinkTSX
);
