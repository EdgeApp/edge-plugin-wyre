// @flow
import { SUPPORTED_DIGITAL_CURRENCIES } from '../constants/index.js'
import type { Dispatch, GetState } from '../types/ReduxTypes'

export const selectWallet = () => async (dispatch: Dispatch, getState: GetState) => {
  const currencyCode = await window.edgeProvider.chooseCurrencyWallet(Object.keys(SUPPORTED_DIGITAL_CURRENCIES))
  if (currencyCode) {
    const wallet = await window.edgeProvider.getCurrentWalletInfo()
    dispatch({ type: 'WALLET_LOADED', data: wallet })
  }
}
export const confirmQuote = (crypto: string, fiat: string, history: Object) => async (dispatch: Dispatch, getState: GetState) => {
  const state = getState()
  const walletDetails = state.Wallet.walletDetails
  const token = state.Wyre.secretKey
  const paymentId = state.Wyre.paymentMethodId
  if (!walletDetails) {
    window.edgeProvider.displayError('Missing wallet object')
    return
  }
  if (!token) {
    window.edgeProvider.displayError('Missing Wyre secret key')
    return
  }
  if (!paymentId) {
    window.edgeProvider.displayError('Missing Wyre payment method id')
    return
  }
  const destAddress = state.Wyre.sellAddresses[walletDetails.currencyCode] ? state.Wyre.sellAddresses[walletDetails.currencyCode] : state.Wyre.sellAddresses.ETH
  const { currencyCode } = walletDetails
  if (!currencyCode) {
    window.edgeProvider.displayError('Missing currencyCode')
    return
  }

  const info = {
    currencyCode,
    publicAddress: destAddress,
    exchangeAmount: crypto
  }
  const metadata = {
    name: 'Wyre',
    category: 'Exchange:Sell ' + currencyCode,
    notes:
      'Sell ' +
      currencyCode +
      ' from ' +
      walletDetails.name +
      ' to Wyre at address: ' +
      destAddress +
      '. Sell amount ' +
      fiat +
      '. For assistance, please contact support@sendwyre.com.'
  }
  const edgeTransaction = await window.edgeProvider.requestSpend([info], { currencyCode, metadata })
  // const edgeTransaction = await window.edgeProvider.requestSpend([info])
  if (edgeTransaction) {
    history.push('/ConfirmationScene')
  }
}
