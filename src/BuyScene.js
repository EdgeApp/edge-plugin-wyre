import PropTypes from 'prop-types'
import React from 'react'
import { withStyles } from 'material-ui/styles'
import Card, { CardContent } from 'material-ui/Card'
import TextField from 'material-ui/TextField'
import { InputAdornment } from 'material-ui/Input'
import Typography from 'material-ui/Typography'
import { CircularProgress } from 'material-ui/Progress'
import uuidv1 from 'uuid/v1'
import { core, ui } from 'edge-libplugin'

import * as API from './api'
import { formatRate } from './utils'
import {
  DailyLimit,
  EdgeButton,
  ConfirmDialog,
  Support,
  PoweredBy,
  WalletDrawer
} from './components'

import './inline.css'

const setFiatInput = (value) => {
  setDomValue('fiatInput', value)
}

const setCryptoInput = (value) => {
  setDomValue('cryptoInput', value)
}

const setDomValue = (id, value) => {
  if (document.getElementById(id)) {
    document.getElementById(id).value = value
  }
}

const buildObject = async (res, wallet) => {
  if (!res.quote_id) {
    throw new Error('Invalid response')
  }
  let address = null
  if (!API.DEV) {
    const addressData = await core.getAddress(wallet.id, wallet.currencyCode)
    address = addressData.address.legacyAddress
    if (!address) {
      address = addressData.address.publicAddress
    }
  } else {
    address = '1fakejPwRxWKiSgMBUewqMCws7DLuzAHQ'
  }
  const quote = {
    version: API.API_VERSION,
    partner: API.PROVIDER,
    payment_flow_type: 'wallet',
    return_url: API.RETURN_URL,
    quote_id: res.quote_id,
    wallet_id: res.wallet_id,
    payment_id: uuidv1(),
    order_id: res.quote_id,
    user_id: res.user_id,
    address: address,
    currency: res.digital_money.currency,
    fiat_total_amount_amount: res.fiat_money.total_amount,
    fiat_total_amount_currency: res.fiat_money.currency,
    fee: res.fiat_money.total_amount - res.fiat_money.base_amount,
    fiat_amount: res.fiat_money.base_amount,
    digital_amount: res.digital_money.amount,
    digital_currency: res.digital_money.currency
  }
  const rate = {
    currency: res.digital_money.currency,
    rate: (quote.fiat_amount / quote.digital_amount)
  }
  return {quote, rate}
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

    const wallets = !API.DEV
      ? []
      : [
        {id: 'BTC', name: 'BTC', currencyCode: 'BTC', fiatCurrencyCode: 'EUR'},
        {id: 'ETH', name: 'ETH', currencyCode: 'ETH', fiatCurrencyCode: 'USD'},
        {id: 'BTC-EUR', name: 'BTC-EUR', currencyCode: 'BTC', fiatCurrencyCode: 'EUR'},
        {id: 'BTC-MXN', name: 'BTC-MXN', currencyCode: 'BTC', fiatCurrencyCode: 'MXN'},
        {id: 'XRP-USD', name: 'XRP-USD', currencyCode: 'XRP', fiatCurrencyCode: 'USD'}
      ]
    this.state = {
      dialogOpen: false,
      drawerOpen: false,
      wallets: wallets,
      rate: null,
      quote: null,
      fiatSupport: true,
      fiat: 'USD',
      defaultFiat: 'USD'
    }
  }

  componentWillMount () {
    window.scrollTo(0, 0)
    if (this.state.wallets.length > 0) {
      this.selectWallet(this.state.wallets[0])
    }
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

  loadConversion = () => {
    const c = this.state.selectedWallet.currencyCode
    API.requestQuote(c, 1, c, this.state.defaultFiat)
      .then(d => d.json())
      .then(r => buildObject(r.res, this.state.selectedWallet))
      .then(r => this.setState({rate: r.rate}))
      .catch(() => {
        ui.showAlert(false, 'Error', 'Unable to retrieve rates. Please try again later.')
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
    API.requestConfirm(
      this.sessionId,
      this.uaid, this.state.quote)
      .then((data) => data.json())
      .then((data) => {
        console.log(data)
        document.getElementById('payment_form').submit()
      })
      .catch((err) => {
        /* Tell the user dummy */
        console.log(err)
        this.setState({
          dialogOpen: false
        })
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
      rate: null,
      quote: null,
      fiatSupport,
      fiat,
      defaultFiat: fiat
    }, () => {
      const lastCrypto = window.localStorage.getItem('last_crypto_amount')
      const lastFiat = window.localStorage.getItem('last_fiat_amount')
      if (lastCrypto) {
        setCryptoInput(lastCrypto)
        this.calcFiat({target: {value: lastCrypto}})
      } else if (lastFiat) {
        setFiatInput(lastFiat)
        this.calcCrypto({target: {value: lastFiat}})
      } else {
        setFiatInput('')
        setCryptoInput('')
        this.loadConversion()
      }
      window.localStorage.removeItem('last_crypto_amount')
      window.localStorage.removeItem('last_fiat_amount')
    })
    ui.title(`Buy ${wallet.currencyCode}`)
    window.localStorage.setItem('last_wallet', wallet.id)
  }

  calcFiat = (event) => {
    window.localStorage.setItem('last_crypto_amount', event.target.value)
    window.localStorage.removeItem('last_fiat_amount')
    if (event.target.value && event.target.value > 0) {
      this.setState({
        cryptoLoading: false,
        fiatLoading: true
      })
      const v = event.target.value
      const c = this.state.selectedWallet.currencyCode
      API.requestQuote(c, v, c, this.state.defaultFiat)
        .then(d => d.json())
        .then(r => buildObject(r.res, this.state.selectedWallet))
        .then(r => {
          this.setState({
            fiatLoading: false,
            quote: r.quote,
            rate: r.rate
          })
          setFiatInput(r.quote.fiat_amount)
        })
        .catch(err => {
          core.debugLevel(0, JSON.stringify(err))
        })
    } else {
      API.requestAbort()
      this.setState({
        quote: null,
        fiatLoading: false,
        cryptoLoading: false
      }, () => {
        setFiatInput('')
      })
    }
  }

  calcCrypto = async (event) => {
    window.localStorage.setItem('last_fiat_amount', event.target.value)
    window.localStorage.removeItem('last_crypto_amount')
    if (event.target.value && event.target.value > 0) {
      this.setState({
        fiatLoading: false,
        cryptoLoading: true
      })
      const v = event.target.value
      const c = this.state.selectedWallet.currencyCode
      API.requestQuote(this.state.defaultFiat, v, c, this.state.defaultFiat)
        .then(d => d.json())
        .then(r => buildObject(r.res, this.state.selectedWallet))
        .then(r => {
          this.setState({
            cryptoLoading: false,
            quote: r.quote,
            rate: r.rate
          })
          setCryptoInput(r.quote.digital_amount)
        })
        .catch(err => {
          core.debugLevel(0, JSON.stringify(err))
        })
    } else {
      API.requestAbort()
      this.setState({
        quote: null,
        fiatLoading: false,
        cryptoLoading: false
      }, () => {
        setCryptoInput('')
      })
    }
  }

  render () {
    const { classes } = this.props
    const { fiat, fiatSupport, selectedWallet, quote } = this.state
    let errors = {
      error: false, helperText: ''
    }
    if (quote) {
      if (quote.fiat_amount > API.LIMITS[fiat].daily) {
        errors = {error: true, helperText: 'Exceeding daily limit'}
      } else if (quote.fiat_amount > API.LIMITS[fiat].monthly) {
        errors = {error: true, helperText: 'Exceeding monthly limit'}
      } else if (quote.fiat_amount < API.LIMITS[fiat].min) {
        errors = {
          error: true,
          helperText: `Below the minimum of ${formatRate(API.LIMITS[fiat].min, fiat)}`
        }
      }
    }
    return (
      <div>
        {this.state.quote && (
          <ConfirmDialog
            fiatAmount={formatRate(quote.fiat_amount, fiat)}
            fee={formatRate(quote.fee, fiat)}
            currency={quote.currency}
            address={quote.address}
            open={this.state.dialogOpen}
            onAccept={this.handleAccept}
            onClose={this.handleClose} />
        )}
        {selectedWallet && !fiatSupport && (
          <Typography
            component="h2"
            className={classes.warning}>
            Please note that {selectedWallet.fiatCurrencyCode} is not supported by Simplex.
            Defaulting to
            <select defaultValue={fiat} onChange={this.changeDefaultFiat}>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </Typography>
        )}
        <Card className={classes.card}>
          <CardContent>
            <Typography
              component="h3"
              className={classes.h3}>
              Conversion Rate
            </Typography>
            {!this.state.rate && (
              <CircularProgress size={25} />
            )}
            {this.state.rate && (
              <Typography component="p" className={classes.conversion}>
                1{this.state.rate.currency} = {formatRate(this.state.rate.rate, fiat)}
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
              {this.state.selectedWallet && (
                <span>: {this.state.selectedWallet.name}</span>
              )}
            </Typography>
            <EdgeButton color="primary" onClick={this.openWallets}>
              Change Destination Wallet
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
              margin="none" fullWidth
              disabled={this.state.cryptoLoading}
              InputLabelProps={{
                shrink: true
              }}
              tabIndex={1}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {this.state.cryptoLoading && <CircularProgress size={25} />}
                    {!this.state.cryptoLoading && selectedWallet && this.state.selectedWallet.currencyCode}
                  </InputAdornment>)
              }}
              onChange={this.calcFiat}
            />

            <TextField id="fiatInput" type="number" label="Enter Amount"
              {...errors}
              margin="none" fullWidth
              disabled={this.state.fiatLoading}
              InputLabelProps={{
                shrink: true
              }}
              tabIndex={2}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {this.state.fiatLoading && <CircularProgress size={25} />}
                    {!this.state.fiatLoading && fiat}
                  </InputAdornment>)
              }}
              onChange={this.calcCrypto}
            />

            <DailyLimit
              fiat={fiat}
              dailyLimit={API.LIMITS[fiat].daily}
              monthlyLimit={API.LIMITS[fiat].monthly} />
          </CardContent>
        </Card>

        <Card className={classes.card}>
          <CardContent>
            <Typography component="p" className={classes.p}>
              You will see a confirmation screen before you buy.
            </Typography>
            {quote && quote.address && (
              <p style={{textAlign: "center", maxWidth: "100%", wordWrap: "break-word", overflowWrap: "break-word", flexWrap: "wrap"}} component="p">
                Payment will be sent to<br />
                <strong style={{maxWidth: "100%", wordWrap: "break-word", overflowWrap: "break-word", flexWrap: "wrap"}} className={classes.address}>{quote.address}</strong>
              </p>
            )}
            <EdgeButton
              tabIndex={3}
              color="primary"
              onClick={this.next}
              disabled={quote === null || errors.error}>
              Next
            </EdgeButton>
            <EdgeButton onClick={this.cancel} tabIndex={4}>Cancel</EdgeButton>
          </CardContent>
        </Card>

        {quote &&
          <API.SimplexForm quote={this.state.quote} />}

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
