// @flow

import './inline.css'

import { APPROVED, NOT_STARTED, PENDING } from '../constants/index'
// import { ui, core } from 'edge-libplugin'
import { EdgeButton, PrimaryButton, StartHeader, StartParagraph, SupportLink } from './components'
import React, { Component } from 'react'
import { addBlockChainToAccount, getAccount, getPaymentMethods } from './api'

import { BuySellSceneConnector } from '../connectors/BuySellSceneConnector'
import { CircularProgress } from 'material-ui/Progress'
import Divider from 'material-ui/Divider'
import Grid from 'material-ui/Grid'
import PendingScreenComponent from '../components/PendingScreenComponent'
import SignUpComponent from '../components/SignUpComponent'
import { genRandomString } from '../utils.js'
import { withStyles } from 'material-ui/styles'

type StartSceneProps = {
  history: Object,
  classes: Object,
  accountStatus: string | null,
  initInfo(): void,
  initUser(): void
}

type StartSceneState = {
}



class StartScene extends Component<StartSceneProps, StartSceneState> {

  componentDidMount = async () => {
    // window.edgeProvider.consoleLog('Sign In Screen ')
    this.props.initInfo()
  }

  /* initUser = async () => {
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
      /* window.edgeProvider.consoleLog('Widget on complete');
      window.edgeProvider.consoleLog(e); */
     /* await window.edgeProvider.writeData({wyreAccountStatus: PENDING})
      await window.edgeProvider.writeData({wyreAccountId_id: e.accountId})
      await window.edgeProvider.writeData({wyrePaymentMethodId: e.paymentMethodId})
      await window.edgeProvider.writeData({wyrePaymentMethodId: e.wyreNetworkTxId})
      this.setState({
        accountStatus: PENDING
      })
    });
  } */

  gotoSell = () => {
    window.edgeProvider.consoleLog('GOtot Sell ')
    window.edgeProvider.consoleLog(this.props)
    console.log(this.props)
    this.props.history.push(`/sellQuote`)
  }


  render () {
    const classes = this.props.classes
    if (!this.props.accountStatus) {
      return <div className={classes.containerSpinner}>
      <CircularProgress size={60} />
    </div>
    }
    if(this.props.accountStatus === NOT_STARTED) {
      window.edgeProvider.consoleLog('Not Started ')
      return <SignUpComponent  onPress={this.props.initUser}/>
    }
    if(this.props.accountStatus === PENDING) {
      window.edgeProvider.consoleLog('PENDING ')
      return <PendingScreenComponent />
    }
    window.edgeProvider.consoleLog('Ready to render the buySell ')
    return <BuySellSceneConnector onSellClick={this.gotoSell}/>
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
