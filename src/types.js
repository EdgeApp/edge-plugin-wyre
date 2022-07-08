// @flow
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
