// @flow

import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { withStyles } from 'material-ui/styles'
import Card, { CardContent } from 'material-ui/Card'
import Typography from 'material-ui/Typography'
import { core, ui } from 'edge-libplugin'
import fakeWallets from './fake/wallets.js'
import * as API from './api'
import {
  Support,
  PoweredBy,
  WalletDrawer,
  PrimaryButton,
  SecondaryButton
} from './components'

import './inline.css'

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

type BuySceneProps = {
  history: Object,
  classes: Object
}

type BuySceneState = {
  drawerOpen: boolean,
  wallets: any,
  wyreAccount: string | null,
  selectedWallet: Object | null,
  publicAddress: string
}

class BuyScene extends Component<BuySceneProps, BuySceneState> {
  sessionsId: string
  constructor (props) {
    super(props)
    const wallets = fakeWallets
    this.state = {
      drawerOpen: false,
      wallets: wallets,
      wyreAccount: props.match.params.accountId || null,
      selectedWallet: null,
      publicAddress: ''
    }
  }

  componentDidMount = async () => {
    // string given to wyre to identify this specific user
    window.scrollTo(0, 0)
    this.loadWallets()
  }

  loadWallets = () => {
    core.wallets()
      .then((data) => {
        this.setState({
          wallets: data.filter((wallet) =>
            API.SUPPORTED_DIGITAL_CURRENCIES.indexOf(wallet.currencyCode) >= 0)
        }, () => {
          if (this.state.wallets.length > 0) {
            let i = 0
            const lastWallet = window.localStorage.getItem('last_wallet')
            if (lastWallet) {
              for (; i < this.state.wallets.length; ++i) {
                if (this.state.wallets[i].id === lastWallet) {
                  break
                }
              }
              if (i >= this.state.wallets.length) {
                i = 0
              }
            }
          } else {
            // Probably exit...not available wallets
          }
        })
      })
      .catch(() => {
        ui.showAlert(false, 'Error', 'Unable to fetch wallets. Please try again later.')
        ui.exit()
      })
  }

  cancel = () => {
    this.props.history.goBack()
  }

  onAccept = () => {
    const { selectedWallet, publicAddress, wyreAccount } = this.state
    if (!selectedWallet) return
    const { currencyCode } = selectedWallet
    const addressPrefix = currencyCode === 'BTC' ? 'bitcoin:' : 'ethereum:'
    try {
      const widget = new window.Wyre.Widget({
        env: 'prod',
        accountId: 'SK-XTEA2PLV-7MJX7P7A-PY296XEL-MB6DMYYL',
        auth: {
          type: 'secretKey',
          secretKey: wyreAccount
        },
        operation: {
          type: 'onramp',
          destCurrency: currencyCode,
          dest: `${addressPrefix}${publicAddress}`
        }
      })
      widget.open()
      setTimeout(() => this.props.history.goBack(), 2000)
    } catch (e) {
      core.debugLevel(0, 'Opening widget error is: ' + e)
    }
  }

  openWallets = () => {
    this.setState({
      drawerOpen: true
    })
  }

  closeWallets = () => {
    this.setState({
      drawerOpen: false
    })
  }

  selectWallet = async (wallet) => {
    if (!wallet || !wallet.id) {
      return
    }
    /* Check if this wallets fiat currency is supported */
    /* If we don't support this wallet's currency switch to the default */
    this.closeWallets()
    const response = await core.getAddress(wallet.id, wallet.currencyCode)
    this.setState({
      selectedWallet: wallet,
      publicAddress: response.address.publicAddress
    })
    ui.title(`Buy ${wallet.currencyCode}`)
    window.localStorage.setItem('last_wallet', wallet.id)
  }

  render () {
    const { classes } = this.props
    const { selectedWallet, publicAddress } = this.state
    return (
      <div>
        <Card className={classes.card}>
          <CardContent>
            <PrimaryButton color='primary' onClick={this.openWallets}>
              {this.state.selectedWallet ? (
                `Wallet: ${this.state.selectedWallet.name} (${this.state.selectedWallet.currencyCode})`
              ) : (
                'Change Destination Wallet'
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
            <Typography component='p' className={classes.p}>
              Please be aware that account verification may take a few days.
            </Typography>
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
        <WalletDrawer
          open={this.state.drawerOpen}
          selectWallet={this.selectWallet}
          onHeaderClick={this.closeWallets}
          onClose={this.closeWallets}
          wallets={this.state.wallets} />
      </div>
    )
  }
}

export default withStyles(buyStyles)(BuyScene)
