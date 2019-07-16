// @flow
import type {
  LocalStorage,
  WalletDetails
} from '../types/AppTypes'
export type Action =
  | { type: 'LOCAL_DATA_INIT', data:  LocalStorage}
  | { type: 'WALLET_LOADED', data:  WalletDetails}
