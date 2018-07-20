import PropTypes from 'prop-types'
import React from 'react'
import { withStyles } from 'material-ui/styles'
import Button from 'material-ui/Button'
import Typography from 'material-ui/Typography'
import Grid from 'material-ui/Grid'
import Drawer from 'material-ui/Drawer'
import Dialog, {
  DialogContent,
  DialogContentText,
  DialogTitle
} from 'material-ui/Dialog'
import { CircularProgress } from 'material-ui/Progress'
import { formatRate, formatStatus } from './utils'
import moment from 'moment'

const limitStyles = theme => ({
  p: {
    fontColor: theme.palette.primary.main,
    backgroundColor: '#d9e3ec',
    textAlign: 'center',
    padding: '10px 0',
    margin: '5px 0'
  }
})

export const DailyLimit = withStyles(limitStyles)((props) => {
  const {dailyLimit, monthlyLimit, fiat} = props
  return (
    <Typography component="p" className={props.classes.p}>
      Daily Limit: {formatRate(dailyLimit, fiat)} /
      Monthly Limit: {formatRate(monthlyLimit, fiat)}
    </Typography>
  )
})

DailyLimit.propTypes = {
  classes: PropTypes.object,
  dailyLimit: PropTypes.number,
  monthlyLimit: PropTypes.number,
  fiat: PropTypes.string
}

export const EdgeButton = (props) => {
  return (
    <Button
      variant="raised"
      color={props.color || 'default'}
      onClick={props.onClick}
      disabled={props.disabled}
      style={{
        textTransform: 'none',
        padding: '15px 0',
        margin: '5px 0'
      }}
      fullWidth>
      {props.children}
    </Button>
  )
}

EdgeButton.propTypes = {
  color: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  disabled: PropTypes.bool
}

export const SupportLink = (props) => {
  return (<a href="mailto:support@simplex.com">support@simplex.com</a>)
}

const supportThemes = theme => ({
  p: {
    textAlign: 'center',
    padding: '0 0 20px 0'
  }
})

export const Support = withStyles(supportThemes)((props) => {
  return (
    <Typography component="p" className={props.classes.p}>
      For support, please contact <SupportLink />.
    </Typography>
  )
})

Support.propTypes = {
  classes: PropTypes.object
}

const powerThemes = (theme) => ({
  p: {
    backgroundColor: '#d9e3ec',
    fontColor: theme.palette.primary.main,
    textAlign: 'center',
    padding: '20px 0'
  }
})

export const PoweredBy = withStyles(powerThemes)((props) => {
  return (
    <Typography component="p" className={props.classes.p}>
      Powered by Simplex
    </Typography>
  )
})

PoweredBy.propTypes = {
  classes: PropTypes.object
}

const confirmStyles = (theme) => ({
  title: {
    textAlign: 'center',
    color: theme.palette.primary.main,
    fontSize: '18pt'
  },
  p: {
    textAlign: 'center'
  },
  progress: {
    textAlign: 'center'
  }
})

class ConfirmUnstyled extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false
    }
  }

  onAccept = () => {
    this.setState({
      loading: true
    })
    this.props.onAccept()
  }

  render () {
    return (
      <Dialog open={this.props.open} onClose={this.props.onClose}>
        <DialogTitle id="alert-confirm-title" disableTypography>
          <Typography component="h2" className={this.props.classes.title}>
            {this.state.loading && 'Please Wait'}
            {!this.state.loading && 'Confirm Purchase Details'}
          </Typography>
        </DialogTitle>
        {this.state.loading && (
          <DialogContent>
            <DialogContentText id="alert-dialog-description" className={this.props.classes.p}>
              We are connecting to Simplex!
            </DialogContentText>
            <div className={this.props.classes.progress}>
              <CircularProgress />
            </div>
          </DialogContent>
        )}
        {!this.state.loading && (
          <DialogContent>
            <DialogContentText id="alert-dialog-description" className={this.props.classes.p}>
              Are you sure you want to buy {this.props.fiatAmount} worth of {this.props.currency}, with a fee of {this.props.fee}?
            </DialogContentText>
            <div>
              <EdgeButton color="primary" onClick={this.onAccept}>
                Yes, go to payment
              </EdgeButton>
              <EdgeButton color="default" onClick={this.props.onClose}>
                Cancel
              </EdgeButton>
            </div>
          </DialogContent>
        )}
      </Dialog>
    )
  }
}

ConfirmUnstyled.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onAccept: PropTypes.func.isRequired,
  classes: PropTypes.object,
  fiatAmount: PropTypes.string,
  fee: PropTypes.string,
  currency: PropTypes.string
}

export const ConfirmDialog = withStyles(confirmStyles)(ConfirmUnstyled)

export class WalletDrawer extends React.Component {
  renderWallet = (wallet) => {
    return (
      <EdgeButton key={wallet.id} onClick={() => this.props.selectWallet(wallet)}>
        {wallet.name} ({wallet.currencyCode})
      </EdgeButton>
    )
  }
  renderWallets = () => {
    return this.props.wallets.map((wallet) =>
      this.renderWallet(wallet))
  }
  render () {
    return (
      <Drawer
        anchor="bottom"
        variant="temporary"
        open={this.props.open}
        onClose={this.props.onClose}>
        <div>
          <EdgeButton color="primary" onClick={this.props.onHeaderClick}>
            Choose Destination Wallet
          </EdgeButton>
          {this.renderWallets()}
        </div>
      </Drawer>
    )
  }
}

WalletDrawer.propTypes = {
  open: PropTypes.bool,
  selectWallet: PropTypes.func.isRequired,
  onHeaderClick: PropTypes.func,
  onClose: PropTypes.func,
  wallets: PropTypes.array
}

export const PaymentRow = (props) => {
  const payment = props.payment
  const status = formatStatus(payment.status)
  const fiatAmount = formatRate(
    payment.fiat_total_amount,
    payment.fiat_currency)
  const cryptoAmount = formatRate(
    payment.requested_digital_amount,
    payment.requested_digital_currency)
  const date = moment(payment.created_at)
  const onClick = () => {
    if (props.history) {
      props.history.push(`/events/${payment.payment_id}/`)
    }
  }
  return (
    <Grid container key={payment.payment_id} onClick={onClick}>
      <Grid item xs={6} scope="row">
        <Typography variant="body1">{date.format('LL')}</Typography>
        <Typography variant="caption">{date.format('LT')}</Typography>
      </Grid>
      <Grid item xs={3}>
        <Typography variant="caption">{fiatAmount} {payment.fiat_currency}</Typography>
        <Typography variant="caption">{cryptoAmount} {payment.requested_digital_currency}</Typography>
      </Grid>
      <Grid item xs={3}>{status}</Grid>
    </Grid>
  )
}

PaymentRow.propTypes = {
  payment: PropTypes.object,
  history: PropTypes.object
}

export const PaymentDetails = (props) => {
  const payment = props.payment
  const fiatAmount = formatRate(
    payment.fiat_total_amount,
    payment.fiat_currency)
  const cryptoAmount = formatRate(
    payment.requested_digital_amount,
    payment.requested_digital_currency)
  const date = moment(payment.created_at)
  return (
    <Grid container key={payment.payment_id}>
      <Grid item xs={12}>
        <Grid container className="header">
          <Grid item xs={6}><Typography>Payment Id</Typography></Grid>
          <Grid item xs={6}><Typography>{payment.payment_id}</Typography></Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container className="header">
          <Grid item xs={6}><Typography>Date</Typography></Grid>
          <Grid item xs={6}>
            <Typography variant="body1">{date.format('LL')} {date.format('LT')}</Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container className="header">
          <Grid item xs={6}><Typography>Amount</Typography></Grid>
          <Grid item xs={6}>
            <Typography>
              {fiatAmount} {payment.fiat_currency} / {cryptoAmount} {payment.requested_digital_currency}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

PaymentDetails.propTypes = {
  payment: PropTypes.object
}
