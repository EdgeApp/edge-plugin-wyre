// @flow

import type { Dispatch, State } from '../types/ReduxTypes'

import ConfirmationScene from '../scenes/ConfirmationScreen'
import { connect } from 'react-redux'
import { finishTransaction } from '../actions/indexActions'

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
export const ConfirmationScreenConnector = connect(
  mapStateToProps,
  mapDispatchToProps
)(ConfirmationScene)
