// @flow
import { APPROVED, INITIAL_KEYS, NOT_STARTED, PENDING } from '../constants/index'
import type { Dispatch, GetState } from '../types/ReduxTypes'

import type { LocalStorage } from '../types/AppTypes'

export const initInfo = () => async (dispatch: Dispatch, getState: GetState) => {
  window.edgeProvider.consoleLog('WE ara in the action  ')
  const localStore: LocalStorage = await window.edgeProvider.readData(INITIAL_KEYS)
  // if the users are already approved set it up
  window.edgeProvider.consoleLog(localStore)
  if(localStore.wyreAccountStatus === APPROVED) {
    window.edgeProvider.consoleLog('APPROVED DISPATCH')
    dispatch({type: 'LOCAL_DATA_INIT', data: localStore})
    return
  }
  if(localStore.wyreAccountStatus === PENDING) {
  }

  if (localStore.wyreAccountId) {
  } else {

  }

}
/* componentDidMount2 = async () => {
  window.scrollTo(0, 0)
  try {
    // window.edgeProvider.consoleLog('Logging It ')
    const localStore = await window.edgeProvider.readData(INITIAL_KEYS)

    if(localStore.wyreAccountStatus === APPROVED) {
      this.setState({
        wyreAccount: localStore.wyreAccountId,
        accountStatus: localStore.wyreAccountStatus,
        initDataLoaded: true,
      })
      return
    }
    if(localStore.wyreAccountStatus === PENDING) {
      const accountDetail = await getAccount(localStore.wyreAccountId_id, localStore.wyreAccountId)
      await window.edgeProvider.writeData({wyreAccountStatus: accountDetail.status})
      this.setState({
        wyreAccount: localStore.wyreAccountId,
        accountStatus: accountDetail.status,
        initDataLoaded: true
      })
      this.setState({
        wyreAccount: localStore.wyreAccountId,
        accountStatus: localStore.wyreAccountStatus,
        initDataLoaded: true,
      })
      return
    }
    if (localStore.wyreAccountId) {
      this.setState({
        wyreAccount: localStore.wyreAccountId,
        accountStatus: localStore.wyreAccountStatus,
        initDataLoaded: true
      },
      async () => {
        if (!localStore.wyreAccountId_account && localStore.accountStatus !== NOT_STARTED) {
          // This recovers legacy account information
          const result = await getPaymentMethods(localStore.wyreAccountId)
          const parseResult = result.data[0]
          const accountID = parseResult.owner.substring(8)
          await window.edgeProvider.writeData({wyrePaymentMethodId: parseResult.id})
          await window.edgeProvider.writeData({wyreAccountId_id: accountID})
          await window.edgeProvider.writeData({wyreAccountName: parseResult.name})
          if (parseResult.blockchains.BTC) {
            await window.edgeProvider.writeData({wyreBTC: parseResult.blockchains.BTC})
          }
          if (parseResult.blockchains.ETH) {
            await window.edgeProvider.writeData({wyreETH: parseResult.blockchains.ETH})
          }

          const accountDetail = await getAccount(accountID, localStore.wyreAccountId)
          await window.edgeProvider.writeData({wyreAccountStatus: accountDetail.status})
          this.setState({
            wyreAccount: localStore.wyreAccountId,
            accountStatus: accountDetail.status,
            initDataLoaded: true
          })
        }
      })
    } else {
      try {
        // window.edgeProvider.consoleLog('Creating it all')
        const accountId = genRandomString(32)
        const key = 'wyreAccountId'
        const value = accountId
        await window.edgeProvider.writeData({[key]: value})
        await window.edgeProvider.writeData({wyreAccountStatus: NOT_STARTED})
        this.setState({
          wyreAccount: accountId,
          accountStatus: NOT_STARTED,
          initDataLoaded: true
        })

      } catch (e) {
        this.setState({
          initError: true
        })
      }
    }
  } catch (e) {
    this.setState({
      initError: true
    })
    // launch error alert
  }
} */
