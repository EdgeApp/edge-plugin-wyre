import PropTypes from 'prop-types'
import React from 'react'
import { withStyles } from 'material-ui/styles'
import Card, { CardContent } from 'material-ui/Card'
import TextField from 'material-ui/TextField'
import { InputAdornment } from 'material-ui/Input'
import Typography from 'material-ui/Typography'

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

  calcFiat = (event) => {
    if (event.target.value) {
      this.setState({
        fiatValue: (parseFloat(event.target.value) * this.state.rate).toFixed(2),
        cryptoValue: event.target.value
      })
    } else {
      this.setState({
        fiatValue: '',
        cryptoValue: ''
      })
    }
  }

  calcCrypto = (event) => {
    if (event.target.value) {
      this.setState({
        fiatValue: event.target.value,
        cryptoValue: (parseFloat(event.target.value) / this.state.rate).toFixed(5)
      })
    } else {
      this.setState({
        fiatValue: '',
        cryptoValue: ''
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
            <Typography component="p" className={classes.conversion}>
              1BTC = $ {this.formatRate(this.state.rate)}
            </Typography>
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
