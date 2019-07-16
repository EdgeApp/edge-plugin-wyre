// @flow

import './inline.css'

import * as API from './api'

import Card, { CardContent } from 'material-ui/Card'
import {
  PoweredBy,
  PrimaryButton,
  SecondaryButton,
  Support
} from './components'
import React, { Component } from 'react'

import type { WalletDetails } from './types'
import { core } from 'edge-libplugin'
import { withStyles } from 'material-ui/styles'

type BuySceneProps = {
  history: Object,
  classes: Object
}

type BuySceneState = {
  currentWalletCurrencyCode: string | null,
  wyreAccount: string | null,
  selectedWallet: WalletDetails | null
}

class BuyScene extends Component<BuySceneProps, BuySceneState> {
  sessionsId: string
  constructor (props) {
    super(props)
    this.state = {
      currentWalletCurrencyCode: null,
      wyreAccount: null,
      selectedWallet: null
    }
  }

  componentDidMount = async () => {
    // string given to wyre to identify this specific user
    window.scrollTo(0, 0)
    const key = 'wyreAccountId'
    const wyreAccount: string = await window.edgeProvider.readData([key])
    if (wyreAccount) {
      this.setState({
        wyreAccount
      })
    }
  }

  cancel = () => {
    this.props.history.goBack()
  }

  onAccept = () => {
    window.edgeProvider.consoleLog('handle Accept ')

    /* const { selectedWallet, wyreAccount } = this.state
    window.edgeProvider.consoleLog('address: ' + selectedWallet.receiveAddress.publicAddress)
    if (!selectedWallet) return
    const { currencyCode } = selectedWallet
    const addressPrefix = currencyCode === 'BTC' ? 'bitcoin:' : 'ethereum:' */
    try {
      /* const widget = new window.Wyre.Widget({
        env: 'production',
        accountId: 'AC-FJN8L976EW4',
        auth: {
          type: 'secretKey',
          secretKey: wyreAccount
        },
        operation: {
          type: 'onramp',
          destCurrency: currencyCode,
          dest: `${addressPrefix}${selectedWallet.receiveAddress.publicAddress}`
        }
      })
      widget.open() */
      // setTimeout(() => this.props.history.goBack(), 2000)
    } catch (e) {
      core.debugLevel(0, 'Opening widget error is: ' + e)
    }
  }
  getWalletDetails = () => {
    window.edgeProvider.getCurrentWalletInfo()
      .then(result => {
        // if (API.SUPPORTED_DIGITAL_CURRENCIES.includes(result.currencyCode)) {
          /* Check if this wallets fiat currency is supported */
          // const fiatSupport = API.SUPPORTED_FIAT_CURRENCIES.indexOf(result.fiatCurrencyCode) !== -1
          /* If we don't support this wallet's currency switch to the default */
          // const fiat = fiatSupport ? result.fiatCurrencyCode : this.state.defaultFiat
          this.setState({
            selectedWallet: result/* ,
            fiatSupport,
            fiat */
          })
      })
  }
  openWallets = () => {
    window.edgeProvider.chooseCurrencyWallet(API.SUPPORTED_DIGITAL_CURRENCIES)
      .then(result => {
        window.edgeProvider.consoleLog('Wallet choice ' + result)
        this.setState(
          {
            currentWalletCurrencyCode: result
          },
          () => {
            this.getWalletDetails()
          }
        )
      })
  }

  selectWallet = async (wallet) => {
    if (!wallet || !wallet.id) {
      return
    }
    /* Check if this wallets fiat currency is supported */
    /* If we don't support this wallet's currency switch to the default */
    /* this.closeWallets()
    const response = await core.getAddress(wallet.id, wallet.currencyCode)
    this.setState({
      selectedWallet: wallet,
      publicAddress: response.address.publicAddress
    })
    ui.title(`Buy ${wallet.currencyCode}`)
    window.localStorage.setItem('last_wallet', wallet.id) */
  }

  render () {
    const { classes } = this.props
    const { selectedWallet } = this.state
    const publicAddress =   selectedWallet ? selectedWallet.receiveAddress.publicAddress : null
    return (
      <div>
        <Card className={classes.card}>
          <CardContent>
            <PrimaryButton color='primary' onClick={this.openWallets}>
              {selectedWallet ? (
                `Wallet: ${selectedWallet.name} (${selectedWallet.currencyCode})`
              ) : (
                'Choose Destination Wallet'
              ) }
            </PrimaryButton>
            {publicAddress && (
              <p style={{textAlign: 'center', maxWidth: '100%', wordWrap: 'break-word', overflowWrap: 'break-word', flexWrap: 'wrap'}} component='p'>
                Receive Address:<br />
                <strong style={{maxWidth: '100%', wordWrap: 'break-word', overflowWrap: 'break-word', flexWrap: 'wrap'}} className={classes.address}>{publicAddress}</strong>
              </p>
            )}
          </CardContent>
        </Card>

        <Card className={classes.card}>
          <CardContent>
            {selectedWallet ? (
              <PrimaryButton
                tabIndex={3}
                color='primary'
                onClick={this.onAccept}
                disabled={false}>
                Next
              </PrimaryButton>
            ) : (
              <SecondaryButton
                tabIndex={3}
                color='primary'
                onClick={this.onAccept}
                disabled={true}>
                Next
              </SecondaryButton>
            )}
            <SecondaryButton onClick={this.cancel} tabIndex={4}>Cancel</SecondaryButton>
          </CardContent>
        </Card>
        <Support />
        <PoweredBy />
      </div>
    )
  }
}

const buyStyles = theme => ({
  card: {
    margin: '20px 0px',
    padding: '0px 10px'
  },
  h3: {
    color: theme.palette.primary.main,
    padding: 0,
    margin: '10px 0',
    fontSize: '16px',
    fontWeight: 'bold'
  },
  warning: {
    color: theme.palette.primary.error,
    padding: 10,
    margin: '10px 0',
    fontSize: '16px',
    fontWeight: 'bold'
  },
  conversion: {
    fontSize: '24pt',
    color: theme.palette.primary.main
  },
  p: {
    color: '#999',
    paddingBottom: '10px',
    textAlign: 'center'
  }
})

export default withStyles(buyStyles)(BuyScene)
