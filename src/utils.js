// @flow

import sha256 from 'js-sha256'
import { V2_API_URL, API_KEY, API_SECRET_KEY } from './env.js'

export const makeAuthenticationRequest = async (endpoint: string, method: string, body?: Object) => {
    const url = V2_API_URL
    const requestUrl = `${url}${endpoint}`
    const timestamp = (new Date()).getTime()
    const queryString = body ? Object.keys(body).map((key) => {
      return encodeURIComponent(key) + '=' + encodeURIComponent(body[key])
    }).join('&') : ''
    const suffix = queryString ? `&${queryString}` : ''
    const stringToHash = `${requestUrl}?timestamp=${timestamp}${suffix}`
    console.log('full URL to hash is: ', stringToHash)
    const authSigHash = calcAuthSigHash(API_SECRET_KEY, stringToHash)
    console.log('V2_API_URL is: ', V2_API_URL, ' API_KEY is: ', API_KEY, 'API_SECRET_KEY is: ', API_SECRET_KEY)
    const headers = {
      'Content-Type': 'application/json',
      'X-Api-Key': API_KEY,
      'X-Api-Signature': authSigHash,
      'X-Api-Version': '2'
    }
    console.log('headers are: ', headers)
    let requestResponse
    if (body) {
      requestResponse = await fetch(stringToHash, {
        headers,
        body,
        method
      })
    } else {
      requestResponse = await fetch(stringToHash, {
        headers,
        mode: 'cors',
        method
      })
    }
    const requestData = await requestResponse.json()
    return requestData
}

export const calcAuthSigHash = (secretKey: string, value: string) => {
  return sha256.hmac(secretKey, value);  
}

export function formatRate (rate, currency) {
  if (!rate) {
    return ''
  }
  return rate.toLocaleString(undefined, {
    style: 'currency',
    currency: currency
  })
}

export function formatStatus (status) {
  if (status === 'submitted') {
    return 'Submitted'
  } else if (status === 'pending_simplexcc_approval') {
    return 'Pending Approval'
  } else if (status === 'approved') {
    return 'Approved'
  } else if (status === 'declined') {
    return 'Declined'
  } else if (status === 'cancelled') {
    return 'Cancelled'
  }
  return status
}

export const cancelableFetch = (url, data) => {
  let canceled = false
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (canceled) {
        reject(new Error({isCanceled: true}))
      } else {
        window.fetch(url, data)
          .then((val) => canceled
            ? reject(new Error({isCanceled: true}))
            : resolve(val)
          )
          .catch((error) => canceled
            ? reject(new Error({isCanceled: true}))
            : reject(error)
          )
      }
    }, 250)
  })

  return {
    promise,
    cancel () {
      canceled = true
    }
  }
}


/////////////// fake stuff ///////////////////
export const makeFakeQuoteRequest = async (endpoint, method, data) => {
  return {
    currency: data.sourceCurrency,
    rate: (3500 + Math.random() * 700).toFixed(2)
  }
}

// only for buying!
export const makeFakeBuyRequest = (requestQuoteInfo) => {
  const exchangeRate = (3500 + Math.random() * 700).toFixed(2)
  
  if (requestQuoteInfo.destAmount) { // crypto amount defined
    requestQuoteInfo.sourceAmount = (requestQuoteInfo.destAmount * exchangeRate).toFixed(2)
  } else {
    requestQuoteInfo.destAmount = (requestQuoteInfo.sourceAmount / exchangeRate).toFixed(6)
  }

  const fakeBuyResponse = {  
    "id":"PLV7BBP7MVJ",
    "status":"UNCONFIRMED",
    "failureReason":null,
    "language":"en",
    "createdAt": new Date().getTime(),
    "completedAt":null,
    "depositInitiatedAt":null,
    "cancelledAt":null,
    "expiresAt": new Date().getTime() + 30000,
    "owner": "account:i6rgs8mjdmmu7cnf7a5bgl0r0vudsfe5",
    "source": "account:i6rgs8mjdmmu7cnf7a5bgl0r0vudsfe5",
    "dest": "bitcoin:2ShLpdz6XT8FRm1KZYSGwiHLZvZbrYgxrgB",
    "sourceCurrency":requestQuoteInfo.sourceCurrency,
    "sourceAmount":requestQuoteInfo.sourceAmount,
    "destCurrency":"BTC",
    "destAmount":requestQuoteInfo.destAmount,
    "exchangeRate":exchangeRate,
    "desc":"Unconfirmed: Exchange of $X.00 to 0.00XXBTC",
    "message":null,
    "totalFees":0.00,
    "equivalencies":{  
       "EUR":0.00418079,
       "USD":4.99,
       "CNY":29.66
    },
    "feeEquivalencies":{  
       "EUR":0.00,
       "USD":0.00,
       "CNY":0.00
    },
    "fees":{  
       "USD":0.00,
       "BTC":0.00
    },
    "authorizingIp":"10.255.0.2",
    "paymentUrl":null,
    "exchangeOrderId":null,
    "chargeId":null,
    "depositId":null,
    "sourceTxId":null,
    "destTxId":null,
    "customId":null,
    "buy":false,
    "instantBuy":false,
    "sell":false,
    "exchange":true,
    "send":true,
    "deposit":false,
    "withdrawal":false,
    "closed":false,
    "reversingSubStatus":null,
    "reversalReason":null,
    "retrievalUrl":null,
    "quotedMargin":null,
    "pendingSubStatus":null,
    "destName":"myUser@gmail.com",
    "sourceName":"Primary Account",
    "exchangeOrder":null,
    "estimatedArrival":new Date().getTime() + 86400000,
    "blockchainTx":null,
    "documents":[  
  
    ],
    "reversalRevenue":null,
    "reversalRevenueCurrency":null,
    "depositInfo":null,
    "chargeInfo":null
  }

  return fakeBuyResponse
}

const delay = (duration) =>
  new Promise(resolve => setTimeout(resolve, duration))
