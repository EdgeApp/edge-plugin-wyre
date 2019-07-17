// @flow
import type { Dispatch, GetState } from '../types/ReduxTypes'
import { addBlockChainToAccount, getAccount, getExchangeRates, getSellQuoteAPI } from '../api/api.js'

export const getExchangeRate = () => async (dispatch: Dispatch, getState: GetState) => {
  const state = getState()
  const token = state.Wyre.secretKey
  if (!token) return
  const rates = await getExchangeRates(token)
  dispatch({type: 'ON_EXCHANGE_RATE', data: rates})
}

export const getSellQuote = (crypto: string, fiat: string) => async (dispatch: Dispatch, getState: GetState) => {
  dispatch({ type: 'RESET_QUOTE' })
  const state = getState()
  const wallet = state.Wallet.wallet
  const token = state.Wyre.secretKey
  const paymentId = state.Wyre.paymentMethodId
  const bankAccount = state.Wyre.accountName
  const accountId = state.Wyre.accountId
  if(!wallet || !token || !paymentId || !bankAccount || !accountId) return
  const destAddress = wallet.currencyCode === 'BTC' ? state.Wyre.btcAddress : state.Wyre.ethAddress
  let addressResult = {}
  if(!destAddress) {
    const result = await addBlockChainToAccount(token, paymentId)
    addressResult = result.blockchains
    dispatch({ type: 'ON_CHAINS_ADDED', data: result.blockchains })
    await window.edgeProvider.writeData({wyreBTC: addressResult.BTC})
    await window.edgeProvider.writeData({wyreETH: addressResult.ETH})
  }
  const address = destAddress || addressResult[wallet.currencyCode]
  const account = await getAccount(accountId, token)
  window.edgeProvider.consoleLog('account')
  window.edgeProvider.consoleLog(account)
  try {
    const quote = await getSellQuoteAPI(token, fiat, wallet.currencyCode, address, account.cellphone)
    window.edgeProvider.consoleLog('Got Quote')
    window.edgeProvider.consoleLog(quote)
    dispatch({ type: 'ON_QUOTE', data: quote})
    if(quote.errorCode) {
      // throw alert.
      // quote.message
      window.edgeProvider.consoleLog('Got Quote ERROR in RESULT')
    }
  } catch (e) {
    window.edgeProvider.consoleLog('Got Quote ERROR')
    window.edgeProvider.consoleLog(e)
  }

}
