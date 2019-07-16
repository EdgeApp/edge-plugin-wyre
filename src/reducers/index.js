// @flow
import { type Reducer, combineReducers } from 'redux'
import { WalletReducer as Wallet, type WalletState } from './WalletReducer.js'
import { WyreReducer as Wyre, type WyreState } from './WyreReducer.js'

import { type Action } from '../types/ReduxTypes.js'

export type RootState = {
  +Wyre: WyreState,
  +Wallet: WalletState
}

export const rootReducer: Reducer<RootState, Action> = combineReducers({
  Wyre,
  Wallet
})
