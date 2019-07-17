// @flow
import { V2_API_URL } from '../env'

export async function getSellQuoteAPI(token: string, fiat: string, cryptoCurrencyCode: string, address: string, bankAccount: string) {
  window.edgeProvider.consoleLog('getSellQuoteAPI api')

  const data = {
    destAmount: Number(fiat),
    sourceCurrency: cryptoCurrencyCode,
    destCurrency: 'USD',
    dest: bankAccount // cryptoCurrencyCode === 'BTC' ? 'bitcoin:' + address : address,
  }
  const request = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Bearer '+ token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }
  const url = 'https://api.sendwyre.com/v3/transfers'
  window.edgeProvider.consoleLog(' API -  '+ url)
  const result = await window.fetch(url, request)
  const newData = result.json()
  window.edgeProvider.consoleLog(newData)
  return newData
}


export async function getExchangeRates(token: string) {
  const request = {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Bearer '+ token,
      'Content-Type': 'application/json'
    }
  }
  const url ='https://api.sendwyre.com/v3/rates?as=MULTIPLIER' // V2_API_URL + 'apiKeys'
  const result = await window.fetch(url, request)
  const newData = result.json()
  return newData
}

export async function addBlockChainToAccount(token: string, paymentMethodId: string) {
  //https://api.sendwyre.com/v2/paymentMethod/:paymentMethodId/attach
  const data = {
    blockchain: 'ALL'
  }
  const request = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Bearer '+ token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }
  const url = V2_API_URL + 'paymentMethod/' + paymentMethodId + '/attach'
  window.edgeProvider.consoleLog(' API -  '+ url)
  const result = await window.fetch(url, request)
  const newData = result.json()
  return newData
}

export async function getPaymentMethods(token: string) {
  const request = {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Bearer '+ token,
      'Content-Type': 'application/json'
    }
  }
  const url ='https://api.sendwyre.com/v2/paymentMethods' // V2_API_URL + 'apiKeys'
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
      'Accept': 'application/json',
      'Authorization': 'Bearer '+ token,
      'Content-Type': 'application/json'
    }
  }
  const url = 'https://api.sendwyre.com/v2/account/' + account + '?timestamp=' + timestamp
  const result = await window.fetch(url, data)
  const newData = result.json()
  return newData
}
