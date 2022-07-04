// @flow
import { API_SECRET_KEY, API_URL, V2_API_URL } from './env'
import { encodeGetSig } from './utils'

export async function addBlockChainToAccount(token: string) {
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
  const url = V2_API_URL + 'paymentMethod/:paymentMethodId/attach'
  return window.fetch(url, request)
}

export async function getPaymentMethods(token: string) {
  const request = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json'
    }
  }
  const url = 'https://api.sendwyre.com/v2/paymentMethods' // V2_API_URL + 'apiKeys'
  console.log(' API -  ', url)

  console.log('request', request)
  const result = await window.fetch(url, request)

  const newData = result.json()
  console.log('newData ', newData)
  return newData
}

export async function getAccount(account: string, token: string) {
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
  const newData = result.json()
  return newData
}
