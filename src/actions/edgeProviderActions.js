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
  history.go(-2)
}

