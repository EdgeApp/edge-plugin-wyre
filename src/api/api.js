// @flow
import { V2_API_URL } from '../env'
import {
  type AddBlockChainToAccount,
  type GetAccount,
  type GetPaymentMethods,
  type GetTransferHistory,
  asAddBlockChainToAccount,
  asGetAccount,
  asGetPaymentMethods,
  asGetTransferHistory
} from '../types/WyreTypes'

export async function getSellQuoteAPI(token: string, fiat: string, cryptoCurrencyCode: string, address: string, bankAccount: string) {
  const data = {
    destAmount: Number(fiat),
    sourceCurrency: cryptoCurrencyCode,
    destCurrency: 'USD',
    dest: bankAccount
  }
  const request = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }
  const url = 'https://api.sendwyre.com/v3/transfers'
  const result = await window.fetch(url, request)
  const newData = result.json()
  return newData
}

export async function getTransferHistory(token: string): Promise<GetTransferHistory> {
  const request = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json'
    }
  }
  const url = 'https://api.sendwyre.com/v3/transfers' // V2_API_URL + 'apiKeys'
  const result = await window.fetch(url, request)
  if (!result.ok) {
    throw new Error('getTransferHistory failed')
  }
  const newData = asGetTransferHistory(await result.json())
  return newData
}

export async function getExchangeRates(token: string) {
  const request = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json'
    }
  }
  const url = 'https://api.sendwyre.com/v3/rates?as=MULTIPLIER' // V2_API_URL + 'apiKeys'
  const result = await window.fetch(url, request)
  const newData = result.json()
  return newData
}

export async function addBlockChainToAccount(token: string, paymentMethodId: string): Promise<AddBlockChainToAccount> {
  // https://api.sendwyre.com/v2/paymentMethod/:paymentMethodId/attach
  const data = {
    blockchain: 'ALL'
  }
  const request = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }
  const url = V2_API_URL + 'paymentMethod/' + paymentMethodId + '/attach'
  const result = await window.fetch(url, request)
  if (!result.ok) throw new Error('fetchError')
  const newData = asAddBlockChainToAccount(await result.json())
  return newData
}

export async function getPaymentMethods(token: string): Promise<GetPaymentMethods> {
  const request = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json'
    }
  }
  const url = 'https://api.sendwyre.com/v2/paymentMethods' // V2_API_URL + 'apiKeys'
  const result = await window.fetch(url, request)
  if (!result.ok) throw new Error('fetchError')
  if (result.status === 204) throw new Error('emptyResponse')
  const newData = asGetPaymentMethods(await result.json())
  if (newData.data.length < 1) throw new Error('emptyResponse')
  return newData
}

export async function getAccount(account: string, token: string): Promise<GetAccount> {
  const timestamp = new Date().getMilliseconds()
  const data = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json'
    }
  }
  const url = 'https://api.sendwyre.com/v2/account/' + account + '?timestamp=' + timestamp
  const result = await window.fetch(url, data)
  if (!result.ok) throw new Error('fetchError')
  if (result.status === 204) throw new Error('emptyResponse')
  const newData = asGetAccount(await result.json())
  return newData
}
