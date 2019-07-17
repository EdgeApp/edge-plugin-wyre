// @flow

export type LocalStorage = {
  'wyreAccountId': string | null,
  'wyreAccountStatus': string | null,
  'wyreAccountId_id': string | null,
  'wyrePaymentMethodId': string | null,
  'wyreNetworkTxId': string | null,
  'wyreAccountName': string | null,
  'wyreBTC': string | null,
  'wyreETH': string | null
}

export type WalletDetails = {
  name: string,
  receiveAddress: {
    publicAddress: string
  },
  currencyCode: string,
  fiatCurrencyCode: string,
  currencyIcon: string,
  currencyIconDark: string
}

export type SellQuoteData = {
  blockchainTx: string | null,
  cancelledAt: string | null,
  completedAt: string | null,
  createdAt: number,
  customId: string | null,
  dest : string,
  destAmount: number,
  destCurrency: string,
  exchangeRate: number,
  expiresAt: number,
  failureReason: string | null,
  fees : {
    BTC?: number,
    ETH?: number,
    USD: number
  },
  BTC?: number,
  ETH?: number,
  USD: number,
  id: string,
  message : string | null,
  owner : string,
  pendingSubStatus: string | null,
  reversalReason: string | null,
  reversingSubStatus : string | null,
  source :string,
  sourceAmount: number,
  sourceCurrency: string,
  status : string,
  statusHistories:Array<any>,
  totalFees :0.8,
  updatedAt :null
}

