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

const SimplexForm = (props) => {
  return (
    <form id='payment_form' action={props.simplexUrl} method='POST' target='_self'>
      <input type='hidden' name='version' value={props.quote.version} />
      <input type='hidden' name='partner' value={props.quote.partner} />
      <input type='hidden' name='payment_flow_type' value={props.quote.payment_flow_type} />
      <input type='hidden' name='return_url' value={props.quote.return_url} />
      <input type='hidden' name='quote_id' value={props.quote.quote_id} />
      <input type='hidden' name='payment_id' value={props.quote.payment_id} />
      <input type='hidden' name='user_id' value={props.quote.user_id} />
      <input type='hidden' name='destination_wallet[address]' value={props.quote.address} />
      <input type='hidden' name='destination_wallet[currency]' value={props.quote.currency} />
      <input type='hidden' name='fiat_total_amount[amount]' value={props.quote.fiat_total_amount_amount} />
      <input type='hidden' name='fiat_total_amount[currency]' value={props.quote.fiat_total_amount_currency} />
      <input type='hidden' name='digital_total_amount[amount]' value={props.quote.digital_amount} />
      <input type='hidden' name='digital_total_amount[currency]' value={props.quote.digital_currency} />
    </form>
  )
}

SimplexForm.propTypes = {
  simplexUrl: PropTypes.string.isRequired,
  quote: PropTypes.object.isRequired
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
      ? 'https://sandbox.test-simplexcc.com/mock/partner/deposit'
      : 'https://checkout.simplexcc.com/payments/new'
    this.state = {
      dialogOpen: false,
      drawerOpen: false,
      wallets: [],
      quote: null
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
  handleAccept = () => {
    this.setState({
      dialogOpen: false
    })
    document.getElementById('payment_form').submit()
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
    /* core.debugLevel(0, this.edgeUrl) */
    // Abort any active requests
    this.requestAbort()
    const data = {
      /* signal: this.abortController.signal, */
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
    /* core.debugLevel(0, JSON.stringify(data)) */
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
      payment_id: '12123123',
      user_id: quote.user_id,
      address: '1BnT87d7jeqmT7kr49kLMUsNzCeKQq2mBT',
      currency: 'USD'
    }
    o.fiat_total_amount_amount = quote.fiat_money.total_amount
    o.fiat_total_amount_currency = quote.fiat_money.currency
    o.fee = quote.fiat_money.total_amount - quote.fiat_money.base_amount
    o.fiat_amount = quote.fiat_money.base_amount
    o.digital_amount = quote.digital_money.amount
    o.digital_currency = quote.digital_money.currency
    return o
  }

  calcFiat = (event) => {
    if (event.target.value) {
      this.setState({
        cryptoLoading: false,
        fiatLoading: true
      })
      this.request('BTC', event.target.value)
        .then(data => data.json())
        .then(r => {
          this.setState({
            fiatLoading: false,
            quote: this.buildObject(r.res)
          })
          document.getElementById('fiatInput').value = r.res.fiat_money.base_amount
        })
        .catch(err => {
          console.log(err)
          /* core.debugLevel(0, JSON.stringify(err)) */
        })
    } else {
      this.requestAbort()
      this.setState({
        quote: null,
        fiatLoading: false,
        cryptoLoading: false
      })
    }
  }

  calcCrypto = async (event) => {
    console.log(event)
    if (event.target.value) {
      this.setState({
        fiatLoading: false,
        cryptoLoading: true
      })
      this.request('USD', event.target.value)
        .then(data => data.json())
        .then(r => {
          this.setState({
            cryptoLoading: false,
            quote: this.buildObject(r.res)
          })
          document.getElementById('cryptoInput').value = r.res.digital_money.amount
        })
        .catch(err => {
          console.log(err)
          /* core.debugLevel(0, JSON.stringify(err)) */
        })
    } else {
      this.requestAbort()
      this.setState({
        quote: null,
        fiatLoading: false,
        cryptoLoading: false
      })
    }
  }

  render () {
    const { classes } = this.props
    return (
      <div>
        {this.state.quote && (
          <ConfirmDialog
            fiatAmount={this.state.quote.fiat_amount.toFixed(2)}
            fee={this.state.quote.fee.toFixed(2)}
            open={this.state.dialogOpen}
            onAccept={this.handleAccept}
            onClose={this.handleClose} />
        )}
        <Card className={classes.card}>
          <CardContent>
            <Typography
              component="h3"
              className={classes.h3}>
              Conversion Rate
            </Typography>
            {this.state.quote && (
              <Typography component="p" className={classes.conversion}>
                1BTC = $ TODO
              </Typography>
            )}
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

            <TextField id="cryptoInput" type="number" label="Enter Amount"
              margin="none"
              fullWidth
              disabled={this.state.cryptoLoading}
              InputProps={{
                endAdornment: <InputAdornment position="end">BTC</InputAdornment>
              }}
              onKeyUp={this.calcFiat}
            />

            <TextField id="fiatInput" type="number" label="Enter Amount"
              margin="none" fullWidth
              disabled={this.state.fiatLoading}
              InputProps={{
                endAdornment: <InputAdornment position="end">USD</InputAdornment>
              }}
              onKeyUp={this.calcCrypto}
            />

            <DailyLimit />
          </CardContent>
        </Card>

        <Card className={classes.card}>
          <CardContent>
            <Typography component="p" className={classes.p}>
              You will see a confirmation screen before you buy.
            </Typography>
            <EdgeButton
              color="primary"
              onClick={this.next}
              disabled={this.state.quote === null}>
              Next
            </EdgeButton>
            <EdgeButton onClick={this.cancel}>Cancel</EdgeButton>
          </CardContent>
        </Card>

        {this.state.quote &&
          <SimplexForm simplexUrl={this.simplexUrl} quote={this.state.quote} />}

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
