// @flow
import { APPROVED, AWAITING_FOLLOWUP, INITIAL_KEYS, NOT_STARTED, PENDING, REJECTED } from '../constants/index'
import type { Dispatch, GetState } from '../types/ReduxTypes'
import { getAccount, getPaymentMethods } from '../api/api'

import type { LocalStorage } from '../types/AppTypes'
import { genRandomString } from '../utils'
import { getTransactions } from '../actions/indexActions'

const checkOnCurrentStatus = (secret: string, localStore: LocalStorage) => async (dispatch: Dispatch, getState: GetState) => {
  window.edgeProvider.consoleLog('######## checkOnCurrentStatus result' )
  try {
    const result = await getPaymentMethods(secret)

    window.edgeProvider.consoleLog(result)
    if (result.data.length < 1) {
      localStore.wyreAccountStatus = NOT_STARTED
      dispatch({type: 'LOCAL_DATA_INIT', data: localStore})
      await window.edgeProvider.writeData({wyreAccountStatus: NOT_STARTED})
      return
    }
    const parseResult = result.data[0]
    const accountID = parseResult.owner.substring(8)
    if (parseResult.blockchains.BTC) {
      await window.edgeProvider.writeData({
        wyreAccountName: parseResult.name,
        wyreAccountId_id: accountID,
        wyrePaymentMethodId: parseResult.id,
        wyreBTC: parseResult.blockchains.BTC
      })
    } else if (parseResult.blockchains.ETH) {
      await window.edgeProvider.writeData({
        wyreAccountName: parseResult.name,
        wyreAccountId_id: accountID,
        wyrePaymentMethodId: parseResult.id,
        wyreETH: parseResult.blockchains.ETH
      })
    } else {
      await window.edgeProvider.writeData({
        wyreAccountName: parseResult.name,
        wyreAccountId_id: accountID,
        wyrePaymentMethodId: parseResult.id
      })
    }
    const accountDetail = await getAccount(accountID, secret)
    // if this account
    if (accountDetail.status === REJECTED) {
      window.edgeProvider.displayError('Your payment method has been rejected')
    }
    if (accountDetail.status === AWAITING_FOLLOWUP) {
      window.edgeProvider.displayError('Please re-verify your bank information.')
    }
    await window.edgeProvider.writeData({wyreAccountStatus: accountDetail.status})
    const updatedLocalStore: LocalStorage = await window.edgeProvider.readData(INITIAL_KEYS)
    dispatch({type: 'LOCAL_DATA_INIT', data: updatedLocalStore})
    return
  } catch (e) {
    if(!localStore.status) {
      await window.edgeProvider.writeData({wyreAccountStatus: NOT_STARTED})
      const updatedLocalStore: LocalStorage = await window.edgeProvider.readData(INITIAL_KEYS)
      dispatch({type: 'LOCAL_DATA_INIT', data: updatedLocalStore})
      return
    }
    dispatch({type: 'LOCAL_DATA_INIT', data: localStore})
  }
}

export const initInfo = () => async (dispatch: Dispatch, getState: GetState) => {
  let localStore: LocalStorage = await window.edgeProvider.readData(INITIAL_KEYS)
  // window.edgeProvider.consoleLog('localStorage From the initInfo')
  try {
    // window.edgeProvider.consoleLog(localStore)
    if(localStore.wyreAccountStatus === APPROVED) {
      window.edgeProvider.consoleLog('APPROVED DISPATCH')
      // dispatch({type: 'LOCAL_DATA_INIT', data: localStore})
      if(localStore.wyreAccountId) {
        dispatch(checkOnCurrentStatus(localStore.wyreAccountId, localStore))
      }
      dispatch(getTransactions())
      return
    }
    if(localStore.wyreAccountStatus === PENDING) {
      // Check to see if we are still pending ->
      if(localStore.wyreAccountId) {
        dispatch(checkOnCurrentStatus(localStore.wyreAccountId, localStore))
      }
      return
    }
    if(localStore.wyreAccountStatus === NOT_STARTED) {
      // check to see if we are still pending. ... Pull
      if(localStore.wyreAccountId) {
        dispatch(checkOnCurrentStatus(localStore.wyreAccountId, localStore))
      }
      return
    }
    // window.edgeProvider.consoleLog('No Status so we had to do this. ')
    const secret = localStore.wyreAccountId
    // window.edgeProvider.consoleLog('secret '+ secret)
    if (secret) {
      dispatch(checkOnCurrentStatus(secret,localStore))
    } else {
      // window.edgeProvider.consoleLog('I am in the else')
      const accountId = genRandomString(32)
      const value = accountId
      await window.edgeProvider.writeData({'wyreAccountId': value})
      window.edgeProvider.consoleLog('I am in the else 2')
      await window.edgeProvider.writeData({'wyreAccountStatus': NOT_STARTED})
      const localStore2: LocalStorage = await window.edgeProvider.readData(INITIAL_KEYS)
      // window.edgeProvider.consoleLog('I am in the else 3')
      dispatch({type: 'LOCAL_DATA_INIT', data: localStore2})
    }
  } catch (e) {
    if(localStore.wyreAccountId) {
      localStore.wyreAccountStatus = NOT_STARTED
      dispatch({type: 'LOCAL_DATA_INIT', data: localStore})
      await window.edgeProvider.writeData({wyreAccountStatus: NOT_STARTED})
    }
    window.edgeProvider.consoleLog('localStore Error')
    window.edgeProvider.consoleLog(e)
  }
}
