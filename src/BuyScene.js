import PropTypes from 'prop-types'
import React from 'react'
import { withStyles } from 'material-ui/styles'
import Card, { CardContent } from 'material-ui/Card'
import TextField from 'material-ui/TextField'
import { InputAdornment } from 'material-ui/Input'
import Typography from 'material-ui/Typography'
import { CircularProgress } from 'material-ui/Progress'
import { core, ui } from 'edge-libplugin'
import fakeWallets from './fake/wallets.js'
import * as API from './api'
import { formatRate, makeFakeQuoteRequest, makeFakeBuyRequest, makeAuthenticationRequest } from './utils'
import {
  DailyLimit,
  EdgeButton,
  ConfirmDialog,
  Support,
  PoweredBy,
  WalletDrawer
} from './components'

import './inline.css'

const setDomValue = (id, value) => {
  if (document.getElementById(id)) {
    document.getElementById(id).value = value
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

class BuyScene extends React.Component {
  constructor (props) {
    super(props)
    /* sessionId can be regenerated each time we come to this form */
    this.sessionId = API.sessionId()
    /* this only needs to persist with an install. localStorage will do */
    this.uaid = API.installId()
    const wallets = fakeWallets
    this.state = {
      dialogOpen: false,
      drawerOpen: false,
      wallets: wallets,
      rate: null,
      quote: null,
      fiatSupport: true,
      fiat: 'USD',
      defaultFiat: 'USD',
      wyreAccount: null,
      expiration: 0
    }
  }

  UNSAFE_componentWillMount () {
    window.scrollTo(0, 0)
    if (this.state.wallets.length > 0) {
      this.selectWallet(this.state.wallets[0])
    }
    this.loadWallets()
    this.fetchWyreAccount()
  }

  fetchWyreAccount = async () => {
    const wyreAccountResponse = await makeAuthenticationRequest('account', 'GET')
    const wyreAccountData = wyreAccountResponse.json()
    console.log('wyreAccountData: ', wyreAccountData)
  }

  loadWallets = () => {
    core.wallets()
      .then((data) => {
        this.setState({
          rate: data,
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
            this.selectWallet(this.state.wallets[i])
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

  next = () => {
    this.setState({
      dialogOpen: true
    })
  }

  cancel = () => {
    this.props.history.goBack()
  }

  handleAccept = () => {
    console.log('About to ask for confirmation of quote')
  }

  handleClose = () => {
    this.setState({
      dialogOpen: false
    })
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

  changeDefaultFiat = (event) => {
    this.setState({
      defaultFiat: event.target.value,
      fiat: event.target.value,
      rate: null,
      quote: null
    }, () => {
      this.loadConversion()
    })
  }

  selectWallet = (wallet) => {
    if (!wallet || !wallet.id) {
      return
    }
    /* Check if this wallets fiat currency is supported */
    const fiatSupport = API.SUPPORTED_FIAT_CURRENCIES.indexOf(wallet.fiatCurrencyCode) !== -1
    /* If we don't support this wallet's currency switch to the default */
    const fiat = fiatSupport ? wallet.fiatCurrencyCode : this.state.defaultFiat
    this.closeWallets()
    this.setState({
      selectedWallet: wallet,
      fiatSupport,
      fiat,
      defaultFiat: fiat
    }, () => {
      window.localStorage.removeItem('last_crypto_amount')
      window.localStorage.removeItem('last_fiat_amount')
    })
    ui.title(`Buy ${wallet.currencyCode}`)
    window.localStorage.setItem('last_wallet', wallet.id)
  }

  render () {
    const { classes } = this.props
    const { fiat, fiatSupport, selectedWallet, quote } = this.state

    return (
      <div>
        {selectedWallet && !fiatSupport && (
          <Typography
            component='h2'
            className={classes.warning}>
            Please note that {selectedWallet.fiatCurrencyCode} is not supported by Wyre.
            Defaulting to
            <select defaultValue={fiat} onChange={this.changeDefaultFiat}>
              <option value='USD'>USD</option>
              <option value='EUR'>EUR</option>
            </select>
          </Typography>
        )}

        <Card className={classes.card}>
          <CardContent>
            <Typography
              variant='headline'
              component='h3'
              className={classes.h3}>
              Destination Wallet
              {this.state.selectedWallet && (
                <span>: {this.state.selectedWallet.name} ({this.state.selectedWallet.currencyCode})</span>
              )}
            </Typography>
            <EdgeButton color='primary' onClick={this.openWallets}>
              Change Destination Wallet
            </EdgeButton>
          </CardContent>
        </Card>

        <Card className={classes.card}>
          <CardContent>
            <Typography component='p' className={classes.p}>
              You will see a confirmation screen before you buy.
            </Typography>
            {quote && quote.address && (
              <p style={{textAlign: 'center', maxWidth: '100%', wordWrap: 'break-word', overflowWrap: 'break-word', flexWrap: 'wrap'}} component='p'>
                Payment will be sent to<br />
                <strong style={{maxWidth: '100%', wordWrap: 'break-word', overflowWrap: 'break-word', flexWrap: 'wrap'}} className={classes.address}>{quote.address}</strong>
              </p>
            )}
            <EdgeButton
              tabIndex={3}
              color='primary'
              onClick={this.next}
              disabled={false}>
              Next
            </EdgeButton>
            <EdgeButton onClick={this.cancel} tabIndex={4}>Cancel</EdgeButton>
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

BuyScene.propTypes = {
  classes: PropTypes.object,
  history: PropTypes.object
}

export default withStyles(buyStyles)(BuyScene)

const buildObject = async () => {
  return null
}
