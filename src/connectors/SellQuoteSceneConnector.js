// @flow

import type { Dispatch, State } from '../types/ReduxTypes'

import SellQuoteScene from '../scenes/SellQuoteScene'
import { connect } from 'react-redux'
import { initInfo } from '../actions/indexActions'

const mapStateToProps = (state: State) => {
  // window.edgeProvider.consoleLog('WE are mapping to prop')
  return {
    wallet:  state.Wallet.wallet,
    bankName: state.Wyre.accountName
  }
}
const mapDispatchToProps = (dispatch: Dispatch) => ({
  initInfo: () => dispatch(initInfo())
})
export const SellQuoteSceneConnector = connect(
  mapStateToProps,
  mapDispatchToProps
)(SellQuoteScene)
