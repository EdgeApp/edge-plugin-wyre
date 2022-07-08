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
export const SUPPORTED_DIGITAL_CURRENCIES: { [code: string]: { wyrePrefix: string, wyreCode: string, buy: boolean, sell: boolean } } = {
  'bitcoin-BTC': { wyrePrefix: 'bitcoin:', wyreCode: 'BTC', buy: true, sell: true },
  'ethereum-ETH': { wyrePrefix: 'bitcoin:', wyreCode: 'ETH', buy: true, sell: true },
  'polygon-MATIC': { wyrePrefix: 'matic:', wyreCode: 'MATIC', buy: false, sell: true },
  'polygon-USDC': { wyrePrefix: 'matic:', wyreCode: 'mUSDC', buy: false, sell: true },
  'ethereum-AAVE': { wyrePrefix: 'ethereum:', wyreCode: 'AAVE', buy: true, sell: true },
  'ethereum-BAT': { wyrePrefix: 'ethereum:', wyreCode: 'BAT', buy: true, sell: true },
  'ethereum-DAI': { wyrePrefix: 'ethereum:', wyreCode: 'DAI', buy: true, sell: true },
  'ethereum-GUSD': { wyrePrefix: 'ethereum:', wyreCode: 'GUSD', buy: true, sell: true },
  'ethereum-MKR': { wyrePrefix: 'ethereum:', wyreCode: 'MKR', buy: true, sell: true },
  'ethereum-SNX': { wyrePrefix: 'ethereum:', wyreCode: 'SNX', buy: true, sell: true },
  'ethereum-UNI': { wyrePrefix: 'ethereum:', wyreCode: 'UNI', buy: true, sell: true },
  'ethereum-USDC': { wyrePrefix: 'ethereum:', wyreCode: 'USDC', buy: true, sell: true },
  'ethereum-USDT': { wyrePrefix: 'ethereum:', wyreCode: 'USDT', buy: true, sell: true },
  'ethereum-WBTC': { wyrePrefix: 'ethereum:', wyreCode: 'WBTC', buy: true, sell: true },
  'ethereum-YFI': { wyrePrefix: 'ethereum:', wyreCode: 'YFI', buy: true, sell: true }
}

export const SUPPORTED_FIAT_CURRENCIES = ['USD', 'EUR']
