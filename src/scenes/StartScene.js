// @flow

import './inline.css'

import CircularProgress from '@material-ui/core/CircularProgress'
import { withStyles } from '@material-ui/core/styles'
import React, { Component } from 'react'

import PendingMethodPendingScreenComponent from '../components/PendingPaymentMethodScreenComponent'
import PendingScreenComponent from '../components/PendingScreenComponent'
import SignUpComponent from '../components/SignUpComponent'
import { BuySellSceneConnector } from '../connectors/BuySellSceneConnector'
import { APPROVED, NOT_STARTED, PAYMENT_METHOD_PENDING, PENDING } from '../constants/index'

type StartSceneProps = {
  history: Object,
  classes: Object,
  accountStatus: string | null,
  wyreAccount: string | null,
  initInfo(): void
}

type StartSceneState = {}

class StartScene extends Component<StartSceneProps, StartSceneState> {
  componentDidMount = async () => {
    this.props.initInfo()
  }

  initUser = async () => {
    const { wyreAccount } = this.props
    const widget = new window.Wyre.Widget({
      env: 'production',
      accountId: 'AC-FJN8L976EW4',
      auth: {
        type: 'secretKey',
        secretKey: wyreAccount
      },
      operation: {
        type: 'onramp',
        destCurrency: 'BTC'
      }
    })
    widget.open('complete', async function (e) {
      await window.edgeProvider.writeData({ wyreAccountStatus: PENDING })
      await window.edgeProvider.writeData({ wyreAccountId_id: e.accountId })
      await window.edgeProvider.writeData({ wyrePaymentMethodId: e.paymentMethodId })
      await window.edgeProvider.writeData({ wyrePaymentMethodId: e.wyreNetworkTxId })
      this.setState({
        accountStatus: PENDING
      })
    })
  }

  gotoSell = () => {
    this.props.history.push(`/sellQuoteRequest`)
  }

  render() {
    const classes = this.props.classes
    if (!this.props.accountStatus) {
      return (
        <div className={classes.containerSpinner}>
          <CircularProgress size={60} />
        </div>
      )
    }
    if (this.props.accountStatus === APPROVED) {
      return <BuySellSceneConnector onSellClick={this.gotoSell} />
    }
    if (this.props.accountStatus === PENDING) {
      return <PendingScreenComponent />
    }
    if (this.props.accountStatus === PAYMENT_METHOD_PENDING) {
      return <PendingMethodPendingScreenComponent />
    }
    if (this.props.accountStatus === NOT_STARTED) {
      return <SignUpComponent onPress={this.initUser} />
    }
    // NEED_WIDGET/unrecognized/default - Account statuses that require existing user to update account info via widget
    this.initUser()
    return null
  }
}

const startStyles = (theme: Object) => ({
  container: {
    backgroundColor: '#FFF',
    padding: '20px',
    width: '100%',
    height: '100%',
    overflow: 'hidden'
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
