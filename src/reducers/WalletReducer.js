// @flow
import type { WalletDetails } from '../types/AppTypes'
import type { Action } from '../types/ReduxTypes'

export type WalletState = {
  walletDetails: WalletDetails | null
}

export const initialState = {
  walletDetails: null
}

export const WalletReducer = (state: WalletState = initialState, action: Action): WalletState => {
  switch (action.type) {
    case 'WALLET_LOADED':
      return { ...state, walletDetails: action.data }
    default:
      return state
  }
}
