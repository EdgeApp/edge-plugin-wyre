// @flow

export type WyreAccountDetails = {
  wyreSecret: string,
  wyreAccountStatus: string,
  wyreAccountName: string,
  wyrePaymentMethodId: string,
  wyrePaymentMethodName: string,
  sellAddresses: SellAddresses,
  wyreAccountId: string | null // this is the secret key needed for other tasks
}

export type SellAddresses = {
  [key: string]: string
}

export type WalletDetails = {
  name: string,
  receiveAddress: {
    publicAddress: string
  },
  currencyCode: string,
  pluginId: string,
  fiatCurrencyCode: string,
  currencyIcon: string,
  currencyIconDark: string
}

export type WyreTransaction = {
  closedAt: number,
  createdAt: number,
  id: string,
  customId: string | null,
  source: string,
  dest: string,
  sourceCurrency: string,
  destCurrency: string,
  sourceAmount: number,
  destAmount: number,
  fees: {
      USD: number
  },
  sourceName: string,
  destName: string,
  status: string,
  message: string | null,
  exchangeRate: number,
  blockchainTxId: string | null,
  destNickname: string | null
}
export type CryptoFiatAmounts = {
  cryptoAmount: string,
   fiatAmount: string
}
