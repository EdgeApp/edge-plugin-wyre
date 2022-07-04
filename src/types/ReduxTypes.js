// @flow
import type { Dispatch as ReduxDispatch, Store as ReduxStore } from 'redux'

import type { RootState as State } from '../reducers/index.js'
import type { Action } from './ActionTypes'

type ThunkDispatch<A> = ((Dispatch, GetState, Imports) => Promise<void> | void) => A
export type { Action, State }
export type Store = ReduxStore<State, Action>
export type GetState = () => State
export type Dispatch = ReduxDispatch<Action> & ThunkDispatch<Action>

export type Imports = {}
