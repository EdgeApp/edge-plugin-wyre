// @flow
import { getExchangeRates, getTransferHistory } from '../api/api.js'
import { SUPPORTED_DIGITAL_CURRENCIES } from '../constants/index.js'
import type { Dispatch, GetState } from '../types/ReduxTypes'

export const changeCrypto = (arg: string, exchangeRate: number) => async (dispatch: Dispatch, getState: GetState) => {
  const fiat = Number(arg) * exchangeRate
  const fiatRound = Math.round(fiat * 100) / 100
  dispatch({
    type: 'SET_AMOUNTS',
    data: {
      cryptoAmount: arg,
      fiatAmount: fiatRound.toString()
    }
  })
}

export const changeFiat = (arg: string, exchangeRate: number) => async (dispatch: Dispatch, getState: GetState) => {
  const state = getState()
  const walletDetails = state.Wallet.walletDetails
  const crypto =
    walletDetails && walletDetails.currencyCode === 'BTC' ? Math.round((Number(arg) / exchangeRate) * 1000000) / 1000000 : Number(arg) / exchangeRate
  dispatch({
    type: 'SET_AMOUNTS',
    data: {
      cryptoAmount: crypto.toString(),
      fiatAmount: arg
    }
  })
}

export const finishTransaction = (history: Object) => async (dispatch: Dispatch, getState: GetState) => {
  history.go(-2)
  dispatch(getTransactions())
}
export const getTransactions = () => async (dispatch: Dispatch, getState: GetState) => {
  const state = getState()
  const token = state.Wyre.secretKey
  if (!token) return
  let history
  try {
    history = await getTransferHistory(token)
  } catch (e) {
    return
  }
  dispatch({ type: 'ON_TRANSACTION_HISTORY', data: history.data })
}

export const buyCurrency = () => async (dispatch: Dispatch, getState: GetState) => {
  const state = getState()
  const walletDetails = state.Wallet.walletDetails
  const wyreAccount = state.Wyre.secretKey
  if (!walletDetails && !wyreAccount) {
    return
  }
  if (walletDetails) {
    const { currencyCode } = walletDetails
    const addressPrefix = SUPPORTED_DIGITAL_CURRENCIES[currencyCode]
    try {
      const widget = new window.Wyre.Widget({
        env: 'production',
        accountId: 'AC-FJN8L976EW4',
        auth: {
          type: 'secretKey',
          secretKey: wyreAccount
        },
        operation: {
          type: 'onramp',
          destCurrency: currencyCode,
          dest: `${addressPrefix}${walletDetails.receiveAddress.publicAddress}`
        }
      })
      widget.open('complete', async function (e) {
        await window.edgeProvider.trackConversion()
      })
    } catch (e) {
      await window.edgeProvider.displayError('Wyre unavailable. Please try again later.')
      await window.edgeProvider.exitPlugin()
    }
  }
}
export const getExchangeRate = () => async (dispatch: Dispatch, getState: GetState) => {
  const state = getState()
  const token = state.Wyre.secretKey
  if (!token) return
  const rates = await getExchangeRates(token)
  dispatch({ type: 'ON_EXCHANGE_RATE', data: rates })
}
