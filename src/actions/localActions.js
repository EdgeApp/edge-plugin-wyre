// @flow
import { APPROVED, NEED_WIDGET, AWAITING_FOLLOWUP, NOT_STARTED, PENDING, PAYMENT_METHOD_PENDING, REJECTED, AWAITING_DEPOSIT_VERIFICATION, DISABLED } from '../constants/index'
import type { Dispatch, GetState } from '../types/ReduxTypes'
import { getAccount, getPaymentMethods, addBlockChainToAccount } from '../api/api'

import type { WyreAccountDetails } from '../types/AppTypes'
import { genRandomString } from '../utils'
import { getTransactions } from '../actions/indexActions'

export const initInfo = () => async (dispatch: Dispatch, getState: GetState) => {
  let wyreAccountDetails: WyreAccountDetails = {
    wyreSecret: '',
    wyreAccountStatus: '',
    wyreAccountName: '',
    wyrePaymentMethodId: '',
    wyrePaymentMethodName: '',
    sellAddresses: {},
    wyreAccountId: '' // this is the old secret key variable replaced by wyreSecret
  }

  try {
    // If wyreSecret doesn't exist, check for wyreAcountId. If both are undefined create a secret
    wyreAccountDetails = await window.edgeProvider.readData(['wyreSecret', 'wyreAccountId'])
    if (wyreAccountDetails.wyreSecret == null) {
      if (wyreAccountDetails.wyreAccountId == null) {
        wyreAccountDetails.wyreSecret = genRandomString(32)
        await window.edgeProvider.writeData({wyreSecret: wyreAccountDetails.wyreSecret})
        wyreAccountDetails.wyreAccountStatus = NOT_STARTED
        dispatch({type: 'LOCAL_DATA_INIT', data: wyreAccountDetails})
        return
      } else {
        wyreAccountDetails.wyreSecret = wyreAccountDetails.wyreAccountId
      }
    } 
  } catch (e) {
    await window.edgeProvider.displayError('Failed to read data on disk')
    await window.edgeProvider.exitPlugin()
    return
  }

  // Get account payment methods and account ID
  let paymentMethods
  try {
    paymentMethods = await getPaymentMethods(wyreAccountDetails.wyreSecret)
  } catch (e) {
    if (e.message === 'fetchError') {
      await window.edgeProvider.displayError('Error accessing Wyre. Please try again later.')
      await window.edgeProvider.exitPlugin()
    }
    // If getPaymentMethod fails, send user to info screen with Create Account button
    wyreAccountDetails.wyreAccountStatus = NOT_STARTED
    dispatch({type: 'LOCAL_DATA_INIT', data: wyreAccountDetails})
    return
  }
  wyreAccountDetails.wyreAccountName = paymentMethods.data[0].owner.substring(8)

  // Get account status
  let account
  try {
    account = await getAccount(wyreAccountDetails.wyreAccountName, wyreAccountDetails.wyreSecret)
    wyreAccountDetails.wyreAccountStatus = account.status
    if (wyreAccountDetails.wyreAccountStatus === PENDING) {
      dispatch({type: 'LOCAL_DATA_INIT', data: wyreAccountDetails})
      return
    }
  } catch (e) {
    if (e.message === 'fetchError') {
      await window.edgeProvider.displayError('Wyre unavailable. Please try again later.')
      await window.edgeProvider.exitPlugin()
    }
    // If user has already created account but is not APPROVED send directly to widget
    wyreAccountDetails.wyreAccountStatus = NEED_WIDGET
    dispatch({type: 'LOCAL_DATA_INIT', data: wyreAccountDetails})
    return
  }

  // Gather payment methods
  let activePaymentMethodArray = []
  let inactivePaymentMethodArray = []
  for (let i = 0; i < paymentMethods.data.length; i++) {

    // Skip all inactive payment methods
    if (paymentMethods.data[i].status !== 'ACTIVE') {
      inactivePaymentMethodArray.push( paymentMethods.data[i] )
      continue
    }

    // Always make sure active payment method is attached to all available blockchains
    let sellAddresses = paymentMethods.data[i].blockchains
    let addBlockChainResult
    try {
      addBlockChainResult = await addBlockChainToAccount(wyreAccountDetails.wyreSecret, paymentMethods.data[i].id)
      if (Object.keys(addBlockChainResult.blockchains).length > Object.keys(sellAddresses).length) {
        paymentMethods.data[i].blockchains = addBlockChainResult.blockchains
      }
    } catch (e) {
      window.edgeProvider.consoleLog(`wyre Failed to attach sellAddresses ${JSON.stringify(e)}`)
    }
    activePaymentMethodArray.push( paymentMethods.data[i] )
  }

  // Find the most recently approved payment method
  while (activePaymentMethodArray.length > 1) {
    if (activePaymentMethodArray[0].createdAt < activePaymentMethodArray[1].createdAt) {
      activePaymentMethodArray.splice(0, 1)
    } else {
      activePaymentMethodArray.splice(1, 1)
    }
  }

  // If no active payment methods exist, show the status of the most recently added payment method
  if (activePaymentMethodArray.length === 0) {

    // Find the most recently added inactive payment method
    while (inactivePaymentMethodArray.length > 1) {
      if (inactivePaymentMethodArray[0].createdAt < inactivePaymentMethodArray[1].createdAt) {
        inactivePaymentMethodArray.splice(0, 1)
      } else {
        inactivePaymentMethodArray.splice(1, 1)
      }
    }

    // Approved accounts without an ACTIVE or PENDING payment method need to be routed directly to the widget after displaying the appropriate error message
    wyreAccountDetails.wyreAccountStatus = NEED_WIDGET

    // Show error with recent payment method status
    switch(inactivePaymentMethodArray[0].status) {
      case PENDING:
        window.edgeProvider.displayError('Your payment method is pending and awaiting approval')
        wyreAccountDetails.wyreAccountStatus = PAYMENT_METHOD_PENDING
        break
      case AWAITING_DEPOSIT_VERIFICATION:
        window.edgeProvider.displayError('Your payment method is pending and awaiting deposit verification')
        break
      case REJECTED:
        window.edgeProvider.displayError('Your payment method has been rejected. Please link another.')
        break
      case DISABLED:
        window.edgeProvider.displayError('Your payment method has been disabled. Please link another.')
        break
      case AWAITING_FOLLOWUP:
        window.edgeProvider.displayError('Please re-verify your bank information.')
        break
      default:
        window.edgeProvider.displayError(`Unknown payment method status ${inactivePaymentMethodArray[0].status}`)
    }
  } else {
    // Save active payment method details to redux
    wyreAccountDetails.wyrePaymentMethodId = activePaymentMethodArray[0].id
    wyreAccountDetails.wyrePaymentMethodName = activePaymentMethodArray[0].name
    wyreAccountDetails.sellAddresses = activePaymentMethodArray[0].blockchains
  }
  
  dispatch({type: 'LOCAL_DATA_INIT', data: wyreAccountDetails})
  if (wyreAccountDetails.wyreAccountStatus === APPROVED) {
    dispatch(getTransactions())
  }
}
