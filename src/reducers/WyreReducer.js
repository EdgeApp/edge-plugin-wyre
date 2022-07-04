// @flow
import type { SellAddresses } from '../types/AppTypes'
import type { Action } from '../types/ReduxTypes'

export type WyreState = {
  secretKey: string | null,
  accountStatus: string | null,
  accountId: string | null,
  paymentMethodId: string | null,
  accountName: string | null,
  sellAddresses: SellAddresses,
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
  sellAddresses: {},
  exchangeRates: {},
  cryptoAmount: null,
  fiatAmount: null
}

export const WyreReducer = (state: WyreState = initialState, action: Action): WyreState => {
  switch (action.type) {
    case 'SET_AMOUNTS':
      return { ...state, cryptoAmount: action.data.cryptoAmount, fiatAmount: action.data.fiatAmount }

    case 'LOCAL_DATA_INIT':
      return {
        ...state,
        secretKey: action.data.wyreSecret,
        accountStatus: action.data.wyreAccountStatus,
        accountId: action.data.wyreAccountName,
        paymentMethodId: action.data.wyrePaymentMethodId,
        accountName: action.data.wyrePaymentMethodName,
        sellAddresses: action.data.sellAddresses
      }
    case 'ON_EXCHANGE_RATE':
      return { ...state, exchangeRates: action.data }
    default:
      return state
  }
}
