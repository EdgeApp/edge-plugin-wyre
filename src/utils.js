
export function formatRate (rate, currency) {
  return rate.toLocaleString(undefined, {
    style: 'currency',
    currency: currency || 'USD'
  })
}
