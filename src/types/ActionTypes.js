// @flow
import type {
  LocalStorage,
  SellQuoteData,
  WalletDetails
} from '../types/AppTypes'
export type Action =
  | { type: 'LOCAL_DATA_INIT', data:  LocalStorage}
  | { type: 'WALLET_LOADED', data:  WalletDetails}
  | { type: 'ON_EXCHANGE_RATE', data: Object}
  | { type: 'ON_CHAINS_ADDED', data: Object}
  | { type: 'ON_QUOTE', data: SellQuoteData}
  | { type: 'RESET_QUOTE'}
