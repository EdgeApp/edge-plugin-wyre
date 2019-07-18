// @flow
import type { Dispatch, GetState } from '../types/ReduxTypes'

import { getExchangeRates } from '../api/api.js'

export const buyCurrency = () => async (dispatch: Dispatch, getState: GetState) => {
  const state = getState
  const wallet = state.Wallet.wallet
  const wyreAccount = state.Wyre.secretKey
  if (!wallet && !wyreAccount) return
  const { currencyCode } =  wallet
  const addressPrefix = currencyCode === 'BTC' ? 'bitcoin:' : 'ethereum:'
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
        dest: `${addressPrefix}${wallet.receiveAddress.publicAddress}`
      }
    })
    widget.open()
  } catch (e) {
    window.edgeProvider.consoleLog('Error on Widget thingy')
  }
}
export const getExchangeRate = () => async (dispatch: Dispatch, getState: GetState) => {
  const state = getState()
  const token = state.Wyre.secretKey
  if (!token) return
  const rates = await getExchangeRates(token)
  dispatch({type: 'ON_EXCHANGE_RATE', data: rates})
}
