// @flow
import type {
  CryptoFiatAmounts,
  WalletDetails,
  WyreTransaction,
  WyreAccountDetails
} from '../types/AppTypes'
export type Action =
  | { type: 'LOCAL_DATA_INIT', data:  WyreAccountDetails}
  | { type: 'WALLET_LOADED', data:  WalletDetails}
  | { type: 'ON_EXCHANGE_RATE', data: Object}
  | { type: 'ON_CHAINS_ADDED', data: Object}
  | { type: 'ON_TRANSACTION_HISTORY', data: Array<WyreTransaction>}
  | { type: 'SET_AMOUNTS', data: CryptoFiatAmounts }
