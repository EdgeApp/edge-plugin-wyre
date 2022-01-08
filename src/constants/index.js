// @flow

export const APPROVED: string = 'APPROVED'
export const PENDING: string = 'PENDING'
export const PAYMENT_METHOD_PENDING: string = 'PAYMENT_METHOD_PENDING'
export const AWAITING_FOLLOWUP: string = 'AWAITING_FOLLOWUP'
export const REJECTED: string = 'REJECTED'
export const NOT_STARTED: string = 'NOT_STARTED'
export const AWAITING_DEPOSIT_VERIFICATION: string = 'AWAITING_DEPOSIT_VERIFICATION'
export const DISABLED: string = 'DISABLED'
export const NEED_WIDGET: string = 'NEED_WIDGET'

// https://docs.sendwyre.com/v1/docs/srns
export const SUPPORTED_DIGITAL_CURRENCIES = {
  'BTC': 'bitcoin:',
  'ETH': 'ethereum:',
  // 'MATIC': 'matic:',
  'DAI': 'ethereum:', 
  'USDC': 'ethereum:'
}

export const SUPPORTED_FIAT_CURRENCIES = [
  'USD', 'EUR'
]
