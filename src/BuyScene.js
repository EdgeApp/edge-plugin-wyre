import PropTypes from 'prop-types'
import React from 'react'
import { withStyles } from 'material-ui/styles'
import Card, { CardContent } from 'material-ui/Card'
import TextField from 'material-ui/TextField'
import { InputAdornment } from 'material-ui/Input'
import Typography from 'material-ui/Typography'
import uuidv1 from 'uuid/v1'

import { core, ui } from 'edge-libplugin'
import { requestAbort, requestConfirm, requestQuote, FIAT_CURRENCY, SimplexForm } from './api'
import {
  DailyLimit,
  EdgeButton,
  ConfirmDialog,
  Support,
  PoweredBy,
  WalletDrawer
} from './components'

import './inline.css'

const formatRate = (rate, symbol) => {
  return symbol + rate.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
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
    /* sessionId can be regenerated each time we come to this form */
    this.sessionId = uuidv1()
    /* this should be written to the encrypted storage */
    this.userId = window.localStorage.getItem('simplex_user_id') || uuidv1()
    /* this only needs to persist with an install. localStorage will do */
    this.uaid = window.localStorage.getItem('simplex_install_id') || uuidv1()
    window.localStorage.setItem('simplex_install_id', this.uaid)

    this.state = {
      dialogOpen: false,
      drawerOpen: false,
      wallets: [],
      selectedWallet: {
        currency: 'BTC'
      },
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
    requestConfirm(
      this.userId, this.sessionId,
      this.uaid, this.state.quote)
      .then((data) => data.json())
      .then((data) => {
        // document.getElementById('payment_form').submit()
        console.log(data)
      })
      .catch((err) => {
        /* Tell the user dummy */
        console.log(err)
      })
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

  buildObject = (quote) => {
    const o = {
      version: '1',
      partner: 'edge',
      payment_flow_type: 'wallet',
      return_url: 'https://www.edgesecure.co',
      quote_id: quote.quote_id,
      wallet_id: quote.wallet_id,
      payment_id: quote.quote_id,
      order_id: quote.quote_id,
      user_id: quote.user_id,
      address: '1BnT87d7jeqmT7kr49kLMUsNzCeKQq2mBT',
      currency: 'BTC'
    }
    o.fiat_total_amount_amount = quote.fiat_money.total_amount
    o.fiat_total_amount_currency = quote.fiat_money.currency
    o.fee = quote.fiat_money.total_amount - quote.fiat_money.base_amount
    o.fiat_amount = quote.fiat_money.base_amount
    o.digital_amount = quote.digital_money.amount
    o.digital_currency = quote.digital_money.currency
    o.rate = (o.fiat_amount / o.digital_amount)
    return o
  }

  calcFiat = (event) => {
    if (event.target.value) {
      this.setState({
        cryptoLoading: false,
        fiatLoading: true
      })
      requestQuote(this.userId, 'BTC', event.target.value, this.state.selectedWallet.currency)
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
      requestAbort()
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
      requestQuote(this.userId, FIAT_CURRENCY, event.target.value, this.state.selectedWallet.currency)
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
      requestAbort()
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
            fiatAmount={formatRate(this.state.quote.fiat_amount, '$')}
            fee={formatRate(this.state.quote.fee, '$')}
            open={this.state.dialogOpen}
            onAccept={this.handleAccept}
            onClose={this.handleClose} />
        )}
        {this.state.quote && (
          <Card className={classes.card}>
            <CardContent>
              <Typography
                component="h3"
                className={classes.h3}>
                Conversion Rate
              </Typography>
              <Typography component="p" className={classes.conversion}>
                1{this.state.quote.currency} = {formatRate(this.state.quote.rate, '$')}
              </Typography>
            </CardContent>
          </Card>
        )}

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
                endAdornment: <InputAdornment position="end">{FIAT_CURRENCY}</InputAdornment>
              }}
              onKeyUp={this.calcCrypto}
            />

            <DailyLimit dailyLimit="$20,000" monthlyLimit="$50,000" />
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
          <SimplexForm quote={this.state.quote} />}

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
