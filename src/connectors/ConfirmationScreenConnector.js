// @flow

import { connect } from 'react-redux'

import { finishTransaction } from '../actions/indexActions'
import ConfirmationScene from '../scenes/ConfirmationScreen'
import type { Dispatch, State } from '../types/ReduxTypes'

type ConfScreenProps = {
  history: Object
}
const mapStateToProps = (state: State, ownProps: ConfScreenProps) => {
  return {
    history: ownProps.history
  }
}
const mapDispatchToProps = (dispatch: Dispatch) => ({
  startOver: (history: Object) => dispatch(finishTransaction(history))
})
export const ConfirmationScreenConnector = connect(mapStateToProps, mapDispatchToProps)(ConfirmationScene)
