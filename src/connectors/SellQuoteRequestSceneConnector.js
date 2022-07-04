// @flow
import { connect } from 'react-redux'

import { changeCrypto, changeFiat, confirmQuote, getExchangeRate, initInfo } from '../actions/indexActions'
import { SellQuoteRequestScene } from '../scenes/SellQuoteRequestScene'
import type { Dispatch, State } from '../types/ReduxTypes'

type SROwnsProps = {
  history: Object
}
const mapStateToProps = (state: State, ownProps: SROwnsProps) => {
  const wallet = state.Wallet.walletDetails
  const pairFrom = wallet && wallet.currencyCode ? wallet.currencyCode + 'USD' : 0
  const pairTo = wallet && wallet.currencyCode ? 'USD' + wallet.currencyCode : 0
  return {
    wallet: state.Wallet.walletDetails,
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
  confirmQuote: (crypto: string, fiat: string, history: Object) => dispatch(confirmQuote(crypto, fiat, history))
})
export const SellQuoteRequestSceneConnector = connect(mapStateToProps, mapDispatchToProps)(SellQuoteRequestScene)
