// @flow
import type { WalletDetails } from '../types/AppTypes'
import type { Action } from '../types/ReduxTypes'

export type WalletState = {
  wallet: WalletDetails | null
}

export const initialState = {
  wallet: null
}

export const WalletReducer = (state: WalletState = initialState, action: Action): WalletState => {
  switch (action.type) {
    case 'WALLET_LOADED':
      return { ...state, wallet: action.data }
    default:
      return state
  }
}
