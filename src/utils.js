
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
