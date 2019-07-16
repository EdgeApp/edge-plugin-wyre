import type { Action } from '../types/ReduxTypes'
// @flow
import type {PinData} from '../types/AppTypes'

export type WyreState = {
  secretKey: string | null,
  accountStatus: string | null,
  accountId: string | null,
  paymentMethodId: string | null,
  networkTxId: string | null,
  accountName: string | null,
  btcAddress: string | null,
  ethAddress: string | null
}
/* export const INITIAL_KEYS = [
  'wyreAccountId',
  'wyreAccountStatus',
  'wyreAccountId_id',
  'wyrePaymentMethodId',
  'wyreNetworkTxId',
  'wyreAccountName',
  'wyreBTC',
  'wyreETH'
] */

export const initialState = {
  secretKey: null,
  accountStatus: null,
  accountId: null,
  paymentMethodId: null,
  networkTxId: null,
  accountName: null,
  btcAddress: null,
  ethAddress: null
}

export const WyreReducer = (state: WyreState = initialState, action: Action): WyreState => {
  switch (action.type) {
    case 'LOCAL_DATA_INIT':
      window.edgeProvider.consoleLog('Wyre Reducer LOCAL_DATA_INIT')
      window.edgeProvider.consoleLog(action.data)
      return {
        ...state,
        secretKey: action.data.wyreAccountId,
        accountStatus: action.data.wyreAccountStatus,
        accountId: action.data.wyreAccountId_id,
        paymentMethodId: action.data.wyrePaymentMethodId,
        networkTxId: action.data.wyreNetworkTxId,
        accountName: action.data.wyreAccountName,
        btcAddress: action.data.wyreBTC,
        ethAddress: action.data.wyreETH
      }
    default:
      // window.edgeProvider.consoleLog('Wyre Reducer Default')
      return state
  }
}
