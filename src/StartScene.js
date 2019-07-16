// @flow

import './inline.css'

// import { ui, core } from 'edge-libplugin'
import { EdgeButton, PrimaryButton, StartHeader, StartParagraph, SupportLink } from './components'
import React, { Component } from 'react'
import { addBlockChainToAccount, getAccount, getApiKeys, getPaymentMethods } from './api'

import BuySellScene from './BuySellScene'
import { CircularProgress } from 'material-ui/Progress'
import Divider from 'material-ui/Divider'
import Grid from 'material-ui/Grid'
import PendingScreenComponent from './components/PendingScreenComponent'
import SignUpComponent from './components/SignUpComponent'
import { genRandomString } from './utils.js'
import { withStyles } from 'material-ui/styles'

type StartSceneProps = {
  history: Object,
  classes: Object
}

type StartSceneState = {
  wyreAccount: string | null,
  accountStatus: string | null,
  initError: boolean,
  initDataLoaded: boolean
}

const APPROVED: string = 'APPROVED'
const PENDING: string = 'PENDING'
const NOT_STARTED: string = 'NOT_STARTED'

const INITIAL_KEYS = [
  'wyreAccountId',
  'wyreAccountStatus',
  'wyreAccountId_id',
  'wyrePaymentMethodId',
  'wyreNetworkTxId',
  'wyreAccountName',
  'wyreBTC',
  'wyreETH'
]

class StartScene extends Component<StartSceneProps, StartSceneState> {
  constructor (props: StartSceneProps) {
    super(props)
    this.state = {
      wyreAccount: null,
      accountStatus: null,
      initError: false,
      initDataLoaded: false
    }
  }

  componentDidMount2 = async () => {
    const value = undefined // 'h22UWNTboATPWOf4KZzTnE5X6OZzxuWe'
    // await window.edgeProvider.writeData({wyreAccountId: value})
    await window.edgeProvider.writeData({wyreAccountStatus: value})
    window.edgeProvider.consoleLog('RESET IT')
  }
  componentDidMount = async () => {
    window.scrollTo(0, 0)
    try {
      // window.edgeProvider.consoleLog('Logging It ')
      const localStore = await window.edgeProvider.readData(INITIAL_KEYS)
      window.edgeProvider.consoleLog('localStore')
      window.edgeProvider.consoleLog(localStore)
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
          /* window.edgeProvider.consoleLog('current status ' + localStore.wyreAccountStatus)
          window.edgeProvider.consoleLog(this.state) */
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
            window.edgeProvider.consoleLog('account Detail')
            window.edgeProvider.consoleLog(accountDetail)
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
          window.edgeProvider.consoleLog('Creating it all')
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
  }

  initUser = async () => {
    const { wyreAccount } = this.state
    const widget = new window.Wyre.Widget({
      env: 'test',
      accountId: 'AC-FJN8L976EW4',
      auth: {
        type: 'secretKey',
        secretKey: wyreAccount
      },
      operation: {
        type: 'onramp'
      }
    })
    widget.open('complete', async function(e) {
      // onboarding was completed successfully!
      window.edgeProvider.consoleLog('Widget on complete');
      window.edgeProvider.consoleLog(e);
      await window.edgeProvider.writeData({wyreAccountStatus: PENDING})
      await window.edgeProvider.writeData({wyreAccountId_id: e.accountId})
      await window.edgeProvider.writeData({wyrePaymentMethodId: e.paymentMethodId})
      await window.edgeProvider.writeData({wyrePaymentMethodId: e.wyreNetworkTxId})
      this.setState({
        accountStatus: PENDING
      })
    });
  }


  render () {
    const classes = this.props.classes
    if (!this.state.initDataLoaded || !this.state.accountStatus) {
      return <div className={classes.containerSpinner}>
      <CircularProgress size={60} />
    </div>
    }
    if(this.state.accountStatus === NOT_STARTED) {
      window.edgeProvider.consoleLog('Not Started ')
      return <SignUpComponent  onPress={this.initUser}/>
    }
    if(this.state.accountStatus === PENDING) {
      window.edgeProvider.consoleLog('PENDING ')
      return <PendingScreenComponent  onPress={this.initUser}/>
    }
    window.edgeProvider.consoleLog('Last stop')
    return <BuySellScene wyreAccount={this.state.wyreAccount}/>
  }
}

const startStyles = (theme: Object) => ({
  container: {
    backgroundColor: '#FFF',
    padding: '20px'
  },
  containerSpinner: {
    display: 'flex',
    flex: '1',
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  h3: {
    color: theme.palette.primary.main,
    fontSize: '17pt',
    padding: '5px 0'
  },
  p: {
    fontSize: '14pt'
  },
  divider: {
    margin: '15px 0',
    height: '2px'
  },
  feeList: {
    listStyleType: '-'
  }
})


export default withStyles(startStyles)(StartScene)
