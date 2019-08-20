// @flow
import type { Action } from '../types/ReduxTypes'

export type WyreState = {
  secretKey: string | null,
  accountStatus: string | null,
  accountId: string | null,
  paymentMethodId: string | null,
  networkTxId: string | null,
  accountName: string | null,
  btcAddress: string | null,
  ethAddress: string | null,
  exchangeRates: Object,
  cryptoAmount: string | null,
  fiatAmount: string | null
}

export const initialState = {
  secretKey: null,
  accountStatus: null,
  accountId: null,
  paymentMethodId: null,
  networkTxId: null,
  accountName: null,
  btcAddress: null,
  ethAddress: null,
  exchangeRates: {},
  cryptoAmount: null,
  fiatAmount: null
}

export const WyreReducer = (state: WyreState = initialState, action: Action): WyreState => {
  switch (action.type) {
    case 'SET_AMOUNTS':
      return {...state, cryptoAmount: action.data.cryptoAmount, fiatAmount: action.data.fiatAmount}

    case 'LOCAL_DATA_INIT':
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
    case 'ON_EXCHANGE_RATE':
      return {...state , exchangeRates: action.data}
    default:
      // window.edgeProvider.consoleLog('Wyre Reducer Default')
      return state
  }
}
