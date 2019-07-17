// @flow
import type { Dispatch, GetState } from '../types/ReduxTypes'
export const selectWallet = () => async (dispatch: Dispatch, getState: GetState) => {
  const currencyCode = await window.edgeProvider.chooseCurrencyWallet(['ETH','BTC','DIA'])
  if (currencyCode) {
    const wallet = await window.edgeProvider.getCurrentWalletInfo()
    dispatch({type: 'WALLET_LOADED', data: wallet})
  }
}
export const confirmQuote = (history: Object) => async (dispatch: Dispatch, getState: GetState) => {
  const state = getState()
  const wallet = state.Wallet.wallet
  const btcAddress = state.Wyre.btcAddress
  const ethAddress = state.Wyre.ethAddress
  const quote = state.Wyre.quote
  if (!quote) return
  if (!wallet) return
  const { currencyCode } = wallet
  if (!currencyCode) return
  const destAddress = currencyCode === 'BTC' ? btcAddress : ethAddress
  const sourceAmount = currencyCode === 'BTC' ? (quote.sourceAmount + quote.totalFees) * 100000000 : (quote.sourceAmount + quote.totalFees) * 1000000000000000000
  if (!destAddress && !sourceAmount) return
  const info = {
    currencyCode: currencyCode === 'BTC' ? 'BTC' : 'ETH',
    publicAddress: destAddress,
    nativeAmount: sourceAmount.toString()
  }
  window.edgeProvider.consoleLog('Confirm Quote')
  window.edgeProvider.consoleLog(info)
  const edgeTransaction = await window.edgeProvider.requestSpend([info])
  window.edgeProvider.consoleLog('edgeTransaction')
  window.edgeProvider.consoleLog(edgeTransaction)
  if (edgeTransaction) {
    history.go(-2)
  }
}

