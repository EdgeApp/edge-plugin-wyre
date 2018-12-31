// @flow

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

// only for buying!
export const makeFakeBuyRequest = (requestQuoteInfo) => {
  const exchangeRate = (3500 + Math.random() * 700).toFixed(2)

  if (requestQuoteInfo.destAmount) { // crypto amount defined
    requestQuoteInfo.sourceAmount = (requestQuoteInfo.destAmount * exchangeRate).toFixed(2)
  } else {
    requestQuoteInfo.destAmount = (requestQuoteInfo.sourceAmount / exchangeRate).toFixed(6)
  }
}

export const genRandomString = (length: number = 32) => {
  let text = ''
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}
