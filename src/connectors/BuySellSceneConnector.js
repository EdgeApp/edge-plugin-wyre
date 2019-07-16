// @flow

import type { Dispatch, State } from '../types/ReduxTypes'

import BuySellScene from '../scenes/BuySellScene'
import { connect } from 'react-redux'
import { selectWallet } from '../actions/indexActions'

type BuySellOwnProps = {
  onSellClick(): void
}
const mapStateToProps = (state: State, ownProps: BuySellOwnProps) => {
  window.edgeProvider.consoleLog('WE are mapping to prop')
  window.edgeProvider.consoleLog(ownProps)
  return {
    wallet: state.Wallet.wallet
  }
}
const mapDispatchToProps = (dispatch: Dispatch, ownProps: BuySellOwnProps) => ({
  selectWallet: () => dispatch(selectWallet()),
  onSellClick: () => dispatch(ownProps.onSellClick())
})
export const BuySellSceneConnector = connect(
  mapStateToProps,
  mapDispatchToProps
)(BuySellScene)
