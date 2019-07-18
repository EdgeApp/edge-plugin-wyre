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
