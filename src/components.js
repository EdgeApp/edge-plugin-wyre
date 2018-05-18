import PropTypes from 'prop-types'
import React from 'react'
import { withStyles } from 'material-ui/styles'
import Button from 'material-ui/Button'
import Typography from 'material-ui/Typography'
import Drawer from 'material-ui/Drawer'
import Dialog, {
  DialogContent,
  DialogContentText,
  DialogTitle
} from 'material-ui/Dialog'

import { formatRate } from './utils'

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
  }
})

export const ConfirmDialog = withStyles(confirmStyles)((props) => {
  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <DialogTitle id="alert-confirm-title" disableTypography>
        <Typography component="h2" className={props.classes.title}>
          Confirm Purchase Details
        </Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description" className={props.classes.p}>
          Are you sure you want to buy {props.fiatAmount} worth of {props.currency}, with a fee of {props.fee}?
        </DialogContentText>
        <EdgeButton color="primary" onClick={props.onAccept}>
          Yes, go to payment
        </EdgeButton>
        <div>
          <EdgeButton color="default" onClick={props.onClose}>
            Cancel
          </EdgeButton>
        </div>
      </DialogContent>
    </Dialog>
  )
})

ConfirmDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onAccept: PropTypes.func.isRequired,
  classes: PropTypes.object,
  fiatAmount: PropTypes.string,
  fee: PropTypes.string,
  currency: PropTypes.string
}

export class WalletDrawer extends React.Component {
  renderWallet = (wallet) => {
    return (
      <EdgeButton key={wallet.id} onClick={() => this.props.selectWallet(wallet)}>
        {wallet.name}
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
