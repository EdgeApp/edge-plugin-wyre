// @flow
import type { Action } from '../types/ReduxTypes'
import type { WyreTransaction } from '../types/AppTypes'

export type TransactionState = {
  transactions:Array<WyreTransaction>
}

export const initialState = {
  transactions: []
}

export const TransactionReducer = (state: TransactionState = initialState, action: Action): TransactionState => {
  switch (action.type) {
    case 'ON_TRANSACTION_HISTORY':
      return {...state, transactions: action.data}
    default:
      return state
  }
}
