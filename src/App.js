import PropTypes from 'prop-types'
import React from 'react'
import { HashRouter as Router, Route } from 'react-router-dom'
// import { createForm } from 'rc-form'
import { withStyles, createMuiTheme } from 'material-ui/styles'
import Button from 'material-ui/Button'
import Card, { CardContent } from 'material-ui/Card'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import TextField from 'material-ui/TextField'
import { InputAdornment } from 'material-ui/Input'
import Typography from 'material-ui/Typography'
import Drawer from 'material-ui/Drawer'
import Divider from 'material-ui/Divider'
import Dialog, {
  DialogContent,
  DialogContentText,
  DialogTitle
} from 'material-ui/Dialog'

import { core, ui } from 'edge-libplugin'

import './inline.css'

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#4876a4',
      main: '#0e4b75',
      dark: '#002449',
      contrastText: '#fff'
    }
  },
  typography: {
    fontFamily: "'Source Sans Pro', sans-serif !important"
  },
  shadows: ['none']
})

const limitThemes = theme => ({
  p: {
    fontColor: theme.palette.primary.main,
    backgroundColor: '#d9e3ec',
    textAlign: 'center',
    padding: '10px 0',
    margin: '5px 0'
  }
})

const _DailyLimits = (props) => {
  return (
    <Typography component="p" className={props.classes.p}>
      Daily Limit: $1,000 / Monthly Limit: $5,0000
    </Typography>
  )
}

_DailyLimits.propTypes = {
  classes: PropTypes.object
}

const DailyLimit = withStyles(limitThemes)(_DailyLimits)

const supportThemes = theme => ({
  p: {
    textAlign: 'center',
    padding: '0 0 20px 0'
  }
})

const EdgeButton = (props) => {
  return (
    <Button
      variant="raised"
      color={props.color || 'default'}
      onClick={props.onClick}
      style={{
        textTransform: 'none',
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
  children: PropTypes.node.isRequired
}

const SupportLink = (props) => {
  return (<a href="mailto:support@simplex.com">support@simplex.com</a>)
}

const _Support = (props) => {
  return (
    <Typography component="p" className={props.classes.p}>
      For support, please contact <SupportLink />.
    </Typography>
  )
}

_Support.propTypes = {
  classes: PropTypes.object
}

const Support = withStyles(supportThemes)(_Support)

const powerThemes = theme => ({
  p: {
    backgroundColor: '#d9e3ec',
    fontColor: theme.palette.primary.main,
    textAlign: 'center',
    padding: '20px 0'
  }
})

const _PoweredBy = (props) => {
  return (
    <Typography component="p" className={props.classes.p}>
      Powered by Simplex
    </Typography>
  )
}

_PoweredBy.propTypes = {
  classes: PropTypes.object
}

const PoweredBy = withStyles(powerThemes)(_PoweredBy)

const startStyles = (theme) => ({
  container: {
    backgroundColor: '#FFF',
    padding: '20px'
  },
  h3: {
    color: theme.palette.primary.main,
    fontSize: '17pt',
    padding: '5px 0'
  },
  p: {
    fontSize: '14pt'
  },
  divider: {
    margin: '15px 0',
    height: '2px'
  },
  feeList: {
    listStyleType: '-'
  }
})

const StartHeader = (props) => {
  return (
    <Typography variant="headline" component="h3" className={props.classes.h3}>
      {props.text}
    </Typography>
  )
}

StartHeader.propTypes = {
  classes: PropTypes.object,
  text: PropTypes.string
}

const StartParagraph = (props) => {
  return (
    <Typography component="p" className={props.classes.p}>
      {props.children}
    </Typography>
  )
}

StartParagraph.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired
}

class _StartScene extends React.Component {
  componentWillMount () {
    ui.title('Buy Bitcoin with Simplex')
  }
  _start = () => {
    this.props.history.push('/buy/')
    ui.navStackPush('/buy/')
  }
  render () {
    const classes = this.props.classes
    return (
      <div className={classes.container}>
        <div className="text-center">
          <div className="iconLogo" />
        </div>
        <div>
          <StartHeader text="Simplex" classes={classes} />
          <StartParagraph classes={classes}>
            Simplex is a Edge Wallet bank card processing partner. It is the
            service which allows you to purchase Bitcoin safely and quickly in just a
            few short minutes.
          </StartParagraph>
        </div>
        <Divider className={classes.divider} />
        <div>
          <StartHeader text="Fee" classes={classes} />
          <StartParagraph classes={classes}>
            Please note that additional fees will be charged, on top of the above Bitcoin / $ rate at checkout. Those fees are as follows:
          </StartParagraph>
          <ul className={classes.feeList}>
            <li>Edge Wallet 5%</li>
            <li>Credit Card processing by Simplex 5% ($10 min)</li>
          </ul>
        </div>
        <Divider className={classes.divider} />
        <div>
          <StartHeader text="Time" classes={classes} />
          <StartParagraph classes={classes}>
            Estimated transaction time is about 10-30min.
          </StartParagraph>
        </div>
        <Divider className={classes.divider} />
        <div>
          <StartHeader text="Support" classes={classes} />
          <StartParagraph classes={classes}>
            For support, please contact <SupportLink />.
          </StartParagraph>
        </div>
        <Divider className={classes.divider} />
        <div>
          <EdgeButton color="primary" onClick={this._start}>Next</EdgeButton>
        </div>
      </div>
    )
  }
}

_StartScene.propTypes = {
  history: PropTypes.object,
  classes: PropTypes.object
}

const StartScene = withStyles(startStyles)(_StartScene)

const confirmStyles = (theme) => ({
  title: {
    textAlign: 'center',
    color: theme.palette.primary.main,
    fontSize: '18pt'
  }
})

const _ConfirmDialog = (props) => {
  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <DialogTitle id="alert-confirm-title" disableTypography>
        <Typography component="h2" className={props.classes.title}>
          Confirm Purchase Details
        </Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to buy $500 worth of BTC, with a fee of $39.50?
        </DialogContentText>
        <EdgeButton color="primary" onClick={props.onClose}>
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
}

_ConfirmDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  classes: PropTypes.object
}

const ConfirmDialog = withStyles(confirmStyles)(_ConfirmDialog)

class WalletDrawer extends React.Component {
  renderWallet = (wallet) => {
    return (
      <EdgeButton key={wallet.id} onClick={this.props.selectWallet}>
        {wallet.name}
      </EdgeButton>
    )
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
          {this.props.wallets.map((wallet) => this.renderWallet(wallet))}
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

class _BuyScene extends React.Component {
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

_BuyScene.propTypes = {
  classes: PropTypes.object,
  history: PropTypes.object
}

const BuyScene = withStyles(buyStyles)(_BuyScene)

export const routes = [{
  path: '/',
  main: StartScene,
  exact: true
}, {
  path: '/buy/',
  main: BuyScene,
  exact: true
}]

const appStyles = (theme) => ({
  content: {
    height: '100%'
  }
})

class App extends React.Component {
  render () {
    return (
      <MuiThemeProvider theme={theme}>
        <Router>
          <div className={this.props.classes.content}>
            {routes.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                exact={route.exact}
                component={route.main}
              />
            ))}
          </div>
        </Router>
      </MuiThemeProvider>
    )
  }
}

App.propTypes = {
  classes: PropTypes.object
}

export default withStyles(appStyles)(App)
