import PropTypes from 'prop-types'
import React from 'react'
import { withStyles } from 'material-ui/styles'
import Card, { CardContent } from 'material-ui/Card'
import TextField from 'material-ui/TextField'
import { InputAdornment } from 'material-ui/Input'
import Typography from 'material-ui/Typography'
import AbortController from 'abort-controller'

import { core, ui } from 'edge-libplugin'
import {
  DailyLimit,
  EdgeButton,
  ConfirmDialog,
  Support,
  PoweredBy,
  WalletDrawer
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
    this.abortController = new AbortController()
    this.edgeUrl = true
      ? 'https://simplex-sandbox-api.edgesecure.co/quote'
      : 'https://simplex-api.edgesecure.co/quote'
    this.simplexUrl = true
      ? 'https://checkout.test-simplexcc.com/payments/new'
      : 'https://checkout.simplexcc.com/payments/new'
    this.state = {
      dialogOpen: false,
      drawerOpen: false,
      rate: 10488.25,
      fiatValue: '',
      cryptoValue: '',
      wallets: []
    }
  }
  componentWillMount () {
    ui.title('Buy Bitcoin')
    this.loadWallets()
  }
  loadWallets = () => {
    core.wallets()
      .then((data) => {
        this.setState({
          wallets: data
        })
      })
      .catch(() => {
        ui.showAlert(false, 'Error', 'Unable to fetch wallets. Please try again later.')
        core.exit()
      })
  }
  next = () => {
    this.setState({
      dialogOpen: true
    })
  }
  cancel = () => {
    this.props.history.goBack()
    ui.navStackPop()
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

  selectWallet = (event) => {
    console.log(event)
    this.closeWallets()
  }

  formatRate = (rate) => {
    return rate.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  requestAbort = () => {
    this.abortController.abort()
  }

  request = (requested, amount) => {
    core.debugLevel(0, this.edgeUrl)
    // Abort any active requests
    this.requestAbort()
    const data = {
      signal: this.abortController.signal,
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        digital_currency: 'BTC',
        fiat_currency: 'USD',
        requested_currency: requested,
        requested_amount: parseFloat(amount),
        client_id: 'asfasfasdasdfadsf'
      })
    }
    core.debugLevel(0, JSON.stringify(data))
    // Issue a new request
    return window.fetch(this.edgeUrl, data)
  }

  buildObject = (quote) => {
    const o = {
      version: '1',
      partner: 'edge',
      payment_flow_type: 'wallet',
      return_url: 'https://www.edgesecure.co',
      quote_id: quote.quote_id,
      wallet_id: quote.wallet_id,
      payment_id: '',
      user_id: quote.user_id,
      address: '',
      currency: ''
    }
    if (quote.fiat_money.total_amount) {
      o.fiat_total_amount_amount = quote.fiat_money.total_amount
      o.fiat_total_amount_currency = quote.fiat_money.currency
    } else {
      o.digital_total_amount_amount = quote.digital_money.total_amount
      o.digital_total_amount_currency = quote.digital_money.currency
    }
    return o
  }

  calcFiat = (event) => {
    if (event.target.value) {
      this.setState({
        cryptoValue: event.target.value,
        cryptoLoading: false,
        fiatLoading: true
      })
      this.request('USD', event.target.value)
        .then(data => {
          const r = data.json()
          this.setState({
            fiatValue: parseFloat(r.res.fiat_money.base_amount).toFixed(2),
            fiatLoading: false,
            quote: this.buildObject(r.res)
          })
        })
        .catch(err => {
          core.debugLevel(0, JSON.stringify(err))
        })
    } else {
      this.requestAbort()
      this.setState({
        fiatValue: '',
        fiatLoading: false,
        cryptoValue: '',
        cryptoLoading: false
      })
    }
  }

  calcCrypto = async (event) => {
    if (event.target.value) {
      this.setState({
        fiatValue: event.target.value,
        fiatLoading: false,
        cryptoLoading: true,
        loading: true
      })
      this.request('BTC', event.target.value)
        .then(data => {
          const r = data.json()
          this.setState({
            cryptoValue: parseFloat(r.res.digital_currency.base_amount).toFixed(5),
            cryptoLoading: false,
            quote: this.buildObject(r.res)
          })
        })
        .catch(err => {
          core.debugLevel(0, JSON.stringify(err))
        })
    } else {
      this.requestAbort()
      this.setState({
        fiatValue: '',
        fiatLoading: false,
        cryptoValue: '',
        cryptoLoading: false
      })
    }
  }

  render () {
    const { classes } = this.props
    return (
      <div>
        <ConfirmDialog
          open={this.state.dialogOpen}
          onClose={this.handleClose} />
        <Card className={classes.card}>
          <CardContent>
            <Typography
              component="h3"
              className={classes.h3}>
              Conversion Rate
            </Typography>
            (this.state.quote && (
              <Typography component="p" className={classes.conversion}>
                1BTC = $ TODO
              </Typography>
            ))
          </CardContent>
        </Card>

        <Card className={classes.card}>
          <CardContent>
            <Typography
              variant="headline"
              component="h3"
              className={classes.h3}>
              Destination Wallet
            </Typography>
            <EdgeButton color="primary" onClick={this.openWallets}>
              Choose Destination Wallet
            </EdgeButton>
          </CardContent>
        </Card>

        <Card className={classes.card}>
          <CardContent>
            <Typography
              variant="headline"
              component="h3"
              className={classes.h3}>
              Purchase Amount
            </Typography>

            <TextField id="id-btc" type="number" label="Enter Amount"
              margin="none" fullWidth
              InputProps={{
                endAdornment: <InputAdornment position="end">BTC</InputAdornment>
              }}
              value={this.state.cryptoValue}
              onChange={this.calcFiat}
            />

            <TextField id="id-usd" type="number" label="Enter Amount"
              margin="none" fullWidth
              InputProps={{
                endAdornment: <InputAdornment position="end">USD</InputAdornment>
              }}
              value={this.state.fiatValue}
              onChange={this.calcCrypto}
            />

            <DailyLimit />
          </CardContent>
        </Card>

        <Card className={classes.card}>
          <CardContent>
            <Typography component="p" className={classes.p}>
              You will see a confirmation screen before you buy.
            </Typography>
            <EdgeButton color="primary" onClick={this.next}>
              Next
            </EdgeButton>
            <EdgeButton onClick={this.cancel}>Cancel</EdgeButton>
          </CardContent>
        </Card>

        (this.state.selectedQuote && (
        <form id='payment_form' action={this.simplexUrl} method='POST' target='_self'>
          <input type='hidden' name='version' value={this.state.quote.version} />
          <input type='hidden' name='partner' value={this.state.quote.partner} />
          <input type='hidden' name='payment_flow_type' value={this.state.quote.payment_flow_type} />
          <input type='hidden' name='return_url' value={this.state.quote.return_url} />
          <input type='hidden' name='quote_id' value={this.state.quote.quote_id} />
          <input type='hidden' name='payment_id' value={this.state.quote.payment_id} />
          <input type='hidden' name='user_id' value={this.state.quote.user_id} />
          <input type='hidden' name='destination_wallet[address]' value={this.state.quote.address} />
          <input type='hidden' name='destination_wallet[currency]' value={this.state.quote.currency} />
          <input type='hidden' name='fiat_total_amount[amount]' value={this.state.quote.fiat_total_amount_amount} />
          <input type='hidden' name='fiat_total_amount[currency]' value={this.state.quote.fiat_total_amount_currency} />
          <input type='hidden' name='digital_total_amount[amount]' value={this.state.quote.digital_total_amount_amount} />
          <input type='hidden' name='digital_total_amount[currency]' value={this.state.quote.digital_total_amount_currency} />
        </form>
        ))

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
