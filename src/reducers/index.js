// @flow
import { type Reducer, combineReducers } from 'redux'
import { type TransactionState, TransactionReducer as Transactions } from './TransactionReducer.js'
import { WalletReducer as Wallet, type WalletState } from './WalletReducer.js'
import { WyreReducer as Wyre, type WyreState } from './WyreReducer.js'

import { type Action } from '../types/ReduxTypes.js'

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
