// @flow

import { connect } from 'react-redux'

import { buyCurrency, selectWallet } from '../actions/indexActions'
import BuySellScene from '../scenes/BuySellScene'
import type { Dispatch, State } from '../types/ReduxTypes'

type BuySellOwnProps = {
  onSellClick(): void
}
const mapStateToProps = (state: State, ownProps: BuySellOwnProps) => {
  return {
    wallet: state.Wallet.wallet,
    transactions: state.Transactions.transactions
  }
}
const mapDispatchToProps = (dispatch: Dispatch, ownProps: BuySellOwnProps) => ({
  selectWallet: () => dispatch(selectWallet()),
  onSellClick: () => dispatch(ownProps.onSellClick()),
  buy: () => dispatch(buyCurrency())
})
export const BuySellSceneConnector = connect(mapStateToProps, mapDispatchToProps)(BuySellScene)
