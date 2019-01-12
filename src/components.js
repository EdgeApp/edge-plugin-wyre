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
import { CircularProgress } from 'material-ui/Progress'
import THEME from './constants/themeConstants.js'

const buttonStyle = {
  textTransform: 'none',
  padding: '15px 0',
  margin: '5px 0',
  borderRadius: '5px'
}

export const EdgeButton = (props) => {
  return (
    <Button
      variant="raised"
      onClick={props.onClick}
      disabled={props.disabled}
      style={{
        ...buttonStyle,
        backgroundColor: props.backgroundColor,
        color: props.textColor
      }}
      fullWidth>
      {props.children}
    </Button>
  )
}

EdgeButton.propTypes = {
  textColor: PropTypes.string,
  backgroundColor: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  disabled: PropTypes.bool
}

export const PrimaryButton = (props) => {
  return (
    <Button
      variant="raised"
      onClick={props.onClick}
      disabled={props.disabled}
      style={{
        ...buttonStyle,
        backgroundColor: THEME.COLORS.SECONDARY,
        color: THEME.COLORS.WHITE
      }}
      fullWidth>
      {props.children}
    </Button>
  )
}

PrimaryButton.propTypes = {
  textColor: PropTypes.string,
  backgroundColor: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  disabled: PropTypes.bool
}

export const SecondaryButton = (props) => {
  return (
    <Button
      variant="raised"
      onClick={props.onClick}
      disabled={props.disabled}
      style={{
        ...buttonStyle,
        backgroundColor: THEME.COLORS.GRAY_2,
        color: THEME.COLORS.WHITE
      }}
      fullWidth>
      {props.children}
    </Button>
  )
}

SecondaryButton.propTypes = {
  textColor: PropTypes.string,
  backgroundColor: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  disabled: PropTypes.bool
}

export const TertiaryButton = (props) => {
  return (
    <Button
      variant="raised"
      onClick={props.onClick}
      disabled={props.disabled}
      style={{
        ...buttonStyle,
        backgroundColor: THEME.COLORS.WHITE,
        color: THEME.COLORS.SECONDARY,
        border: `2px solid ${THEME.COLORS.SECONDARY}`
      }}
      fullWidth>
      {props.children}
    </Button>
  )
}

TertiaryButton.propTypes = {
  textColor: PropTypes.string,
  backgroundColor: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  disabled: PropTypes.bool
}

export const SupportLink = (props) => {
  return (<a href="mailto:support@sendwyre.com">support@sendwyre.com</a>)
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
      Powered by Wyre
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

export const WalletButton = (props) => {
  return (
    <Button
      variant="raised"
      onClick={props.onClick}
      disabled={props.disabled}
      style={{
        ...buttonStyle,
        backgroundColor: props.backgroundColor,
        color: props.textColor,
        margin: '0',
        borderRadius: '0',
        borderTop: '1px solid #d8d6d8'
      }}
      fullWidth>
      {props.children}
    </Button>
  )
}

WalletButton.propTypes = {
  textColor: PropTypes.string,
  backgroundColor: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  disabled: PropTypes.bool
}

export class WalletDrawer extends React.Component {
  renderWallet = (wallet) => {
    return (
      <WalletButton key={wallet.id} onClick={() => this.props.selectWallet(wallet)} backgroundColor='white'>
        {wallet.name} ({wallet.currencyCode})
      </WalletButton>
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
          <WalletButton color="primary" onClick={this.props.onHeaderClick} backgroundColor='white'>
            <span style={{ fontWeight: 'bold' }}>Choose Destination Wallet</span>
          </WalletButton>
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
