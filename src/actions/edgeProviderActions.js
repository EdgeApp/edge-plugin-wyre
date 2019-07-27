// @flow
import type { Dispatch, GetState } from '../types/ReduxTypes'

import { addBlockChainToAccount } from '../api/api'

export const selectWallet = () => async (dispatch: Dispatch, getState: GetState) => {
  const currencyCode = await window.edgeProvider.chooseCurrencyWallet(['ETH','BTC','DIA'])
  if (currencyCode) {
    const wallet = await window.edgeProvider.getCurrentWalletInfo()
    dispatch({type: 'WALLET_LOADED', data: wallet})
  }
}
export const confirmQuote = (crypto: string, fiat: string, history: Object) => async (dispatch: Dispatch, getState: GetState) => {
  const state = getState()
  const wallet = state.Wallet.wallet
  const token = state.Wyre.secretKey
  const paymentId = state.Wyre.paymentMethodId
  window.edgeProvider.consoleLog('confirmQuote')
  if(!wallet || !token || !paymentId) return
  window.edgeProvider.consoleLog('confirmQuote a')
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
  window.edgeProvider.consoleLog('confirmQuote 2')
  const { currencyCode } = wallet
  if (!currencyCode) return
  const sourceAmount = currencyCode === 'BTC' ? (Number(crypto)) * 100000000 : (Number(crypto)) * 1000000000000000000

  const info = {
    currencyCode: currencyCode === 'BTC' ? 'BTC' : 'ETH',
    publicAddress: address,
    nativeAmount: sourceAmount.toString()
  }
  window.edgeProvider.consoleLog('confirmQuote 3')
  const metadata = {
    name: 'Wyre',
    category: 'Exchange:Sell ' + currencyCode,
    notes: 'Sell '+ currencyCode + 'from ' + wallet.name +' to Wyre at address: ' + address +'. Sell amount ' + fiat +'. For assistance, please contact support@sendwyre.com.'
  }
  const edgeTransaction = await window.edgeProvider.requestSpend([info], { metadata })
  // const edgeTransaction = await window.edgeProvider.requestSpend([info])
  window.edgeProvider.consoleLog('edgeTransaction')
  window.edgeProvider.consoleLog(edgeTransaction)
  if (edgeTransaction) {
    history.push('/ConfirmationScene')
  }
}
/* export const getSellQuote = (crypto: string, fiat: string) => async (dispatch: Dispatch, getState: GetState) => {
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

} */

