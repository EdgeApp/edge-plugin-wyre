// @flow
import type { Action } from '../types/ReduxTypes'
import type { WalletDetails } from '../types/AppTypes'

export type WalletState = {
  wallet: WalletDetails | null
}

export const initialState = {
  wallet: null
}

export const WalletReducer = (state: WalletState = initialState, action: Action): WalletState => {
  switch (action.type) {
    case 'WALLET_LOADED':
      return {...state, wallet: action.data}
    default:
      // window.edgeProvider.consoleLog('Wyre Reducer Default')
      return state
  }
}
