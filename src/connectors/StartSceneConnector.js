// @flow

import type { Dispatch, State } from '../types/ReduxTypes'

import StartScene from '../scenes/StartScene'
import { connect } from 'react-redux'
import { initInfo } from '../actions/indexActions'

type StartSceneProps = {
  history: Object
}
const mapStateToProps = (state: State, ownProps: StartSceneProps) => {
  return {
    accountStatus:  state.Wyre.accountStatus,
    history: ownProps.history,
    wyreAccount: state.Wyre.secretKey
  }
}
const mapDispatchToProps = (dispatch: Dispatch) => ({
  initInfo: () => dispatch(initInfo())
})
export const StartSceneConnector = connect(
  mapStateToProps,
  mapDispatchToProps
)(StartScene)
