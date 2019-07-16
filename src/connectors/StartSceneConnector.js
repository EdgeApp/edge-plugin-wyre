// @flow

import type { Dispatch, State } from '../types/ReduxTypes'

import StartScene from '../scenes/StartScene'
import { connect } from 'react-redux'
import { initInfo } from '../actions/indexActions'

type StartSceneProps = {
  history: Object
}
const mapStateToProps = (state: State, ownProps: StartSceneProps) => {
  // window.edgeProvider.consoleLog('WE are mapping to prop')
  return {
    accountStatus:  state.Wyre.accountStatus,
    history: ownProps.history
  }
}
const mapDispatchToProps = (dispatch: Dispatch) => ({
  initInfo: () => dispatch(initInfo())
})
export const StartSceneConnector = connect(
  mapStateToProps,
  mapDispatchToProps
)(StartScene)
