import PropTypes from 'prop-types'
import React from 'react'
import { HashRouter as Router, Route } from 'react-router-dom'
// import { createForm } from 'rc-form'
import { withStyles, createMuiTheme } from 'material-ui/styles'
import Button from 'material-ui/Button'
import Card, { CardActions, CardContent } from 'material-ui/Card'
// import Grid from 'material-ui/Grid'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import TextField from 'material-ui/TextField'
import { InputAdornment } from 'material-ui/Input'
import Typography from 'material-ui/Typography'

import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from 'material-ui/Dialog'

// import { ui } from 'edge-libplugin'

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
  }
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

class StartScene extends React.Component {
  componentWillMount () {
    // ui.title('Simplex')
  }
  _start = async () => {
    const isSetup = false // await core.readData('setup') === true
    if (isSetup) {
      this.props.history.push('/fullView/')
      // ui.navStackPush('/fullView/')
    } else {
      this.props.history.push('/buy/')
      // ui.navStackPush('/buy/')
    }
  }
  render () {
    return (
      <div>
        <div className="text-center">
          <div className="iconLogo" />
        </div>
        <Block title="Simplex">
          <Typography component="p">
            Simplex is a Edge Wallet bank card processing partner. It is the
            service which allows you to purchase Bitcoin safely and quickly in just a
            few short minutes.
          </Typography>
        </Block>
        <Block title="Fee">
          <Typography component="p">
            Please note that additional fees will be charged, on top of the above Bitcoin / $ rate at checkout. Those fees are as follows:
          </Typography>
        </Block>
        <Block title="Time">
          <Typography component="p">
            Estimated transaction time is about 10-30min.
          </Typography>
        </Block>
        <Block title="Support">
          <Typography component="p">
            For support, please contact <SupportLink />.
          </Typography>
        </Block>
        <Block>
          <CardActions>
            <Button variant="raised" color="primary" fullWidth onClick={this._start}>Next</Button>
          </CardActions>
        </Block>
      </div>
    )
  }
}

StartScene.propTypes = {
  history: PropTypes.object
}

const blockStyles = theme => ({
  card: {
    margin: '100px 0px',
    padding: '5px 10px'
  }
})

const _Block = (props) => {
  return (
    <Card>
      <CardContent>
        { props.iconClassName &&
          <div className={props.iconClassName} />
        }
        <Typography variant="headline" component="h3">
          {props.title}
        </Typography>
        { props.children }
      </CardContent>
    </Card>
  )
}

_Block.propTypes = {
  title: PropTypes.string,
  iconClassName: PropTypes.string,
  children: PropTypes.node.isRequired
}

const Block = withStyles(blockStyles)(_Block)

const confirmStyles = (theme) => ({
  title: {
    textAlign: 'center'
  }
})

const _ConfirmDialog = (props) => {
  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description" >
      <DialogTitle id="alert-dialog-title" className={props.classes.title}>
        Confirm Purchase Details
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to buy $500 worth of BTC, with a fee of $39.50?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose} color="primary">
          Agree
        </Button>
        <Button onClick={props.onClose} color="default" autoFocus>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

_ConfirmDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  classes: PropTypes.object
}

const ConfirmDialog = withStyles(confirmStyles)(_ConfirmDialog)

const buyStyles = theme => ({
  card: {
    margin: '20px 0px',
    padding: '0px 10px'
  },
  h3: {
    color: theme.palette.primary.main,
    padding: 0,
    margin: '10px 0',
    fontSize: '16px'
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
      dialogOpen: false
    }
  }
  async componentWillMount () {
    // ui.title('Buy Bitcoin')
  }
  _next = () => {
    this.setState({
      dialogOpen: true
    })
  }
  _handleClose = () => {
    this.setState({
      dialogOpen: false
    })
  }
  render () {
    const { classes } = this.props
    return (
      <div>
        <ConfirmDialog
          open={this.state.dialogOpen}
          onClose={this._handleClose} />
        <Card className={classes.card}>
          <CardContent>
            <Typography
              component="h3"
              className={classes.h3}>
              Conversion Rate
            </Typography>
            <Typography component="p">
              1BTC = $ 10,488.25
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
            <Button size="large" variant="raised" color="primary" fullWidth>
              Choose Destination Wallet
            </Button>
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
            />

            <TextField id="id-usd" type="number" label="Enter Amount"
              margin="none" fullWidth
              InputProps={{
                endAdornment: <InputAdornment position="end">USD</InputAdornment>
              }}
            />

            <DailyLimit />
          </CardContent>
        </Card>

        <Card className={classes.card}>
          <CardContent>
            <Typography component="p" className={classes.p}>
              You will see a confirmation screen before you buy.
            </Typography>
            <Button size="large"
              variant="raised"
              color="primary"
              fullWidth
              onClick={this._next}>Next</Button>
            <Button size="large" fullWidth>Cancel</Button>
          </CardContent>
        </Card>

        <Support />
        <PoweredBy />
      </div>
    )
  }
}

_BuyScene.propTypes = {
  classes: PropTypes.object
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
    height: '100%',
    paddingBottom: '20px'
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
