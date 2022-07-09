// @flow
import { type Reducer, combineReducers } from 'redux'

import { type Action } from '../types/ReduxTypes.js'
import { type TransactionState, TransactionReducer as Transactions } from './TransactionReducer.js'
import { type WalletState, WalletReducer as Wallet } from './WalletReducer.js'
import { type WyreState, WyreReducer as Wyre } from './WyreReducer.js'

export type RootState = {
  +Wyre: WyreState,
  +Wallet: WalletState,
  +Transactions: TransactionState
}

export const rootReducer: Reducer<RootState, Action> = combineReducers({
  Wyre,
  Wallet,
  Transactions
})
