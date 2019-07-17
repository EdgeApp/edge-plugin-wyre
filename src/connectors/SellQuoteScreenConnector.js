// @flow

import type { Dispatch, State } from '../types/ReduxTypes'

import SellQuoteScene from '../scenes/SellQuoteScene'
import { confirmQuote } from '../actions/indexActions'
import { connect } from 'react-redux'

const mapStateToProps = (state: State) => {
  // window.edgeProvider.consoleLog('WE are mapping to prop')
  return {
    quote: state.Wyre.quote,
    wallet:  state.Wallet.wallet,
    bankName: state.Wyre.accountName
  }
}
const mapDispatchToProps = (dispatch: Dispatch) => ({
  confirmQuote: (history: Object) => dispatch(confirmQuote(history))
})
export const SellQuoteSceneConnector = connect(
  mapStateToProps,
  mapDispatchToProps
)(SellQuoteScene)
