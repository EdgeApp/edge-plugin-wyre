import PropTypes from 'prop-types'
import React from 'react'
import uuidv1 from 'uuid/v1'
import { core } from 'edge-libplugin'
import { API_URL } from './env.js'

export const PROVIDER = 'edge'
export const API_VERSION = '1'
export const ACCEPT_LANGUAGE = 'en-US;q=0.7,en;q=0.3'
export const HTTP_ACCEPT = 'en-US;q=0.7,en;q=0.3'
export const RETURN_URL = 'https://simplex-api.edgesecure.co/redirect/'
export const LIMITS = {
  USD: {
    min: 50,
    daily: 18800,
    monthly: 47000
  },
  EUR: {
    min: 50,
    daily: 16972,
    monthly: 42431
  }
}

let lastRequest = null

export function requestAbort () {
  if (lastRequest) {
    lastRequest.cancel()
  }
}

export const SUPPORTED_DIGITAL_CURRENCIES = [
  'BTC', 'ETH', 'DAI'
]

export const SUPPORTED_FIAT_CURRENCIES = [
  'USD', 'EUR'
]

export const DEV = process.env.NODE_ENV === 'development'

const edgeUrl = DEV
  ? 'https://simplex-sandbox-api.edgesecure.co'
  : 'https://simplex-api.edgesecure.co'
const simplexUrl = DEV
  ? 'https://sandbox.test-simplexcc.com/payments/new'
  : 'https://checkout.simplexcc.com/payments/new'

export function sessionId () {
  return uuidv1()
}

export async function getUserId () {
  if (DEV) {
    return 'dev-user-id'
  }
  let id = null
  let inCore = true
  try {
    id = await core.readData('simplex_user_id')
    core.debugLevel(0, 'Found user key in core')
  } catch (e) {
    core.debugLevel(0, 'No existing key in core')
    inCore = false
  }
  if (!id) {
    id = window.localStorage.getItem('simplex_user_id')
  }
  if (!id) {
    id = uuidv1()
    core.debugLevel(0, 'Generating id "' + id + "' ")
  }
  if (!inCore) {
    try {
      await core.writeData('simplex_user_id', id)
      core.debugLevel(0, 'Wrote key to core')
    } catch (e) {
      core.debugLevel(0, 'Unable to write key to core. Storing in localStorage')
      window.localStorage.setItem('simplex_user_id', id)
    }
  }
  return id
}

export function installId () {
  const id = window.localStorage.getItem('simplex_install_id') || uuidv1()
  window.localStorage.setItem('simplex_install_id', id)
  return id
}

export async function payments () {
  const userId = await getUserId()

  const data = {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }
  const url = `${edgeUrl}/payments/${userId}/`
  return window.fetch(url, data)
}

export async function paymentDetails (paymentId) {
  const userId = await getUserId()
  const data = {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }
  const url = `${edgeUrl}/payments/${userId}/${paymentId}/`
  return window.fetch(url, data)
}

export const SimplexForm = (props) => {
  return (
    <form id='payment_form' action={simplexUrl} method='POST' target='_self'>
      <input type='hidden' name='version' value={props.quote.version} />
      <input type='hidden' name='partner' value={props.quote.partner} />
      <input type='hidden' name='payment_flow_type' value={props.quote.payment_flow_type} />
      <input type='hidden' name='return_url' value={props.quote.return_url} />
      <input type='hidden' name='quote_id' value={props.quote.quote_id} />
      <input type='hidden' name='payment_id' value={props.quote.payment_id} />
      <input type='hidden' name='user_id' value={props.quote.user_id} />
      <input type='hidden' name='destination_wallet[address]' value={props.quote.address} />
      <input type='hidden' name='destination_wallet[currency]' value={props.quote.currency} />
      <input type='hidden' name='fiat_total_amount[amount]' value={props.quote.fiat_total_amount_amount} />
      <input type='hidden' name='fiat_total_amount[currency]' value={props.quote.fiat_total_amount_currency} />
      <input type='hidden' name='digital_total_amount[amount]' value={props.quote.digital_amount} />
      <input type='hidden' name='digital_total_amount[currency]' value={props.quote.digital_currency} />
    </form>
  )
}

SimplexForm.propTypes = {
  quote: PropTypes.object.isRequired
}
