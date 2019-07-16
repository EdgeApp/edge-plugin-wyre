import {sha256}  from 'js-sha256'

export const encodeGetSig = (url, msg, userApiSecretKey) => {
  const hash = sha256.hmac.create(userApiSecretKey)
  const message = url + msg
  hash.update(message)
  return hash.hex()
}

export const genRandomString = (length: number = 32) => {
  let text = ''
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
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
export function formatAmount (rate, currency) {
  if (!rate) {
    return ''
  }
  return `${parseFloat(rate).toFixed(3)} ${currency}`
}
