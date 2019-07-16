// @flow
import type { Dispatch as ReduxDispatch, Store as ReduxStore } from 'redux'

import type { Action } from './ActionTypes'
import type { RootState as State } from '../reducers/index.js'

// export type Action = { type: string, data?: any }

type ThunkDispatch<A> = ((Dispatch, GetState, Imports) => Promise<void> | void) => A
export type { Action, State }
export type Store = ReduxStore<State, Action>
export type GetState = () => State
export type Dispatch = ReduxDispatch<Action> & ThunkDispatch<Action>

export type Imports = {}
