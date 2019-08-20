// @flow
import type { Dispatch, State } from '../types/ReduxTypes'
import { changeCrypto, changeFiat, confirmQuote, getExchangeRate, initInfo } from '../actions/indexActions'

import { SellQuoteRequestScene } from '../scenes/SellQuoteRequestScene'
// import { TransactionAmountScreen } from 'edge-plugin-screens-and-components'
import { connect } from 'react-redux'

type SROwnsProps = {
  history: Object
}
/*
bankName: state.Wyre.accountName,
history: ownProps.history,
exchangeRatesFrom: state.Wyre.exchangeRates[pairFrom],
exchangeRatesTo: state.Wyre.exchangeRates[pairTo
  */
const mapStateToProps = (state: State, ownProps: SROwnsProps) => {
  const wallet = state.Wallet.wallet
  const pairFrom = wallet && wallet.currencyCode ? wallet.currencyCode+'USD' : 0
  const pairTo = wallet && wallet.currencyCode ? 'USD'+wallet.currencyCode : 0
  return {
    wallet:  state.Wallet.wallet,
    exchangeRatesFrom: state.Wyre.exchangeRates[pairFrom],
    exchangeRatesTo: state.Wyre.exchangeRates[pairTo],
    buyOrSell: 'sell',
    history: ownProps.history,
    cryptoAmount: state.Wyre.cryptoAmount,
    fiatAmount: state.Wyre.cryptoAmount,
    bankName: state.Wyre.accountName
  }
}
const mapDispatchToProps = (dispatch: Dispatch) => ({
  changeCrypto: (arg: string, exchangeRate: number) => {
    dispatch(changeCrypto(arg, exchangeRate))
  },
  changeFiat: (arg: string, exchangeRate: number) => {
    dispatch(changeFiat(arg, exchangeRate))
  },
  initInfo: () => dispatch(initInfo()),
  getExchangeRate: () => dispatch(getExchangeRate()),
  confirmQuote: (crypto: string, fiat: string, history: Object) => dispatch(confirmQuote(crypto,fiat, history))
})
export const SellQuoteRequestSceneConnector = connect(
  mapStateToProps,
  mapDispatchToProps
)(SellQuoteRequestScene)


////////////////////////////////

/*


const mapStateToProps = (state: State, ownProps: SROwnsProps) => {
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
 */
