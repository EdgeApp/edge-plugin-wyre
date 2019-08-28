// @flow
import type { Dispatch, GetState } from '../types/ReduxTypes'
import { getExchangeRates, getTransferHistory } from '../api/api.js'

export const changeCrypto = (arg: string, exchangeRate: number) => async (dispatch: Dispatch, getState: GetState) => {
  const fiat = Number(arg) * exchangeRate
  const fiatRound = Math.round(fiat * 100) / 100
  dispatch({type: 'SET_AMOUNTS', data: {
    cryptoAmount: arg,
    fiatAmount: fiatRound.toString()
  }})
}

export const changeFiat = (arg: string, exchangeRate: number) => async (dispatch: Dispatch, getState: GetState) => {
  const state = getState()
  const wallet = state.Wallet.wallet
  const crypto = wallet && wallet.currencyCode === 'BTC'
    ? Math.round((Number(arg) / exchangeRate) * 1000000) / 1000000
    : Number(arg) / exchangeRate
  dispatch({type: 'SET_AMOUNTS', data: {
    cryptoAmount: crypto.toString(),
    fiatAmount: arg
  }})
}


export const finishTransaction = (history: Object) => async (dispatch: Dispatch, getState: GetState) => {
  history.go(-2)
  dispatch(getTransactions())
}
export const getTransactions = () => async (dispatch: Dispatch, getState: GetState) => {
  window.edgeProvider.consoleLog('#### gettingTransferHistory')
  const state = getState()
  const token = state.Wyre.secretKey
  if (!token) return
  const history = await getTransferHistory(token)
  window.edgeProvider.consoleLog(history.data)
  dispatch({type: 'ON_TRANSACTION_HISTORY', data: history.data})
}
//
export const buyCurrency = () => async (dispatch: Dispatch, getState: GetState) => {
  window.edgeProvider.consoleLog('Buy Currency Action')
  const state = getState()
  const wallet = state.Wallet.wallet
  window.edgeProvider.consoleLog('Wallet')
  const wyreAccount = state.Wyre.secretKey
  window.edgeProvider.consoleLog('Secret Key')
  if (!wallet && !wyreAccount) {
    window.edgeProvider.consoleLog('Woops')
    window.edgeProvider.consoleLog(wallet)
    window.edgeProvider.consoleLog(wyreAccount)
    return
  }
  if (wallet) {
    const { currencyCode } =  wallet
    const addressPrefix = currencyCode === 'BTC' ? 'bitcoin:' : 'ethereum:'
    try {
      const widget = new window.Wyre.Widget({
        env: 'test',
        accountId: 'AC-FJN8L976EW4',
        auth: {
          type: 'secretKey',
          secretKey: wyreAccount
        },
        operation: {
          type: 'onramp',
          destCurrency: currencyCode,
          dest: `${addressPrefix}${wallet.receiveAddress.publicAddress}`
        }
      })
      widget.open('complete', async function(e) {
        await window.edgeProvider.trackConversion()
       });
    } catch (e) {
      window.edgeProvider.consoleLog('Error on Widget')
    }
  }

}
export const getExchangeRate = () => async (dispatch: Dispatch, getState: GetState) => {
  const state = getState()
  const token = state.Wyre.secretKey
  if (!token) return
  const rates = await getExchangeRates(token)
  dispatch({type: 'ON_EXCHANGE_RATE', data: rates})
}
