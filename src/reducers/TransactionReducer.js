// @flow
import type { WyreTransaction } from '../types/AppTypes'
import type { Action } from '../types/ReduxTypes'

export type TransactionState = {
  transactions: WyreTransaction[]
}

export const initialState = {
  transactions: []
}

export const TransactionReducer = (state: TransactionState = initialState, action: Action): TransactionState => {
  switch (action.type) {
    case 'ON_TRANSACTION_HISTORY':
      return { ...state, transactions: action.data }
    default:
      return state
  }
}
