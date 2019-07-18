// @flow

import type { Dispatch, State } from '../types/ReduxTypes'
import { confirmQuote, getExchangeRate, initInfo } from '../actions/indexActions'

import SellQuoteRequestScene from '../scenes/SellQuoteRequestScene'
import { connect } from 'react-redux'

type SROwnsProps = {
  history: Object
}
const mapStateToProps = (state: State, ownProps: SROwnsProps) => {
  window.edgeProvider.consoleLog('WE are mapping to prop')
  window.edgeProvider.consoleLog(state.Wyre.exchangeRates)
  const wallet = state.Wallet.wallet
  const pairFrom = wallet && wallet.currencyCode ? wallet.currencyCode+'USD' : 0
  const pairTo = wallet && wallet.currencyCode ? 'USD'+wallet.currencyCode : 0
  return {
    wallet:  state.Wallet.wallet,
    bankName: state.Wyre.accountName,
    history: ownProps.history,
    exchangeRatesFrom: state.Wyre.exchangeRates[pairFrom],
    exchangeRatesTo: state.Wyre.exchangeRates[pairTo]
  }
}
const mapDispatchToProps = (dispatch: Dispatch) => ({
  initInfo: () => dispatch(initInfo()),
  getExchangeRate: () => dispatch(getExchangeRate()),
  confirmQuote: (crypto: string, fiat: string, history: Object) => dispatch(confirmQuote(crypto,fiat, history))
})
export const SellQuoteRequestSceneConnector = connect(
  mapStateToProps,
  mapDispatchToProps
)(SellQuoteRequestScene)
