// @flow

import sha256 from 'js-sha256'
import { API_URL, API_KEY, API_SECRET_KEY } from './env.js'

export const makeAuthenticationRequest = async (endpoint: string, method: string, body?: Object) => {
    const url = API_URL
    const apiKey = API_KEY
    const secretKey = API_SECRET_KEY
    const requestUrl = `${url}${endpoint}`
    const timestamp = (new Date()).getTime()
    const queryString = body ? Object.keys(body).map((key) => {
      return encodeURIComponent(key) + '=' + encodeURIComponent(body[key])
    }).join('&') : ''
    const stringToHash = `${requestUrl}?timestamp=${timestamp}&${queryString}`
    const authSigHash = calcAuthSigHash(secretKey, stringToHash)
    const headers = {
      'Content-Type': 'application/json',
      'X-Api-Key': apiKey,
      'X-Api-Signature': authSigHash,
      'X-Api-Version': '3'
    }
    let requestResponse
    if (body) {
      requestResponse = await fetch(requestUrl, {
        headers,
        body,
        method
      })
    } else {
      requestResponse = await fetch(requestUrl, {
        headers,
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
    rate: (Math.random() * 10000).toFixed(2)
  }
}
