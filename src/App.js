// @flow

import React, { Component } from 'react'
import { Route, HashRouter as Router } from 'react-router-dom'
import { createMuiTheme, withStyles } from 'material-ui/styles'

import BuyScene from './BuyScene'
import BuySellScene  from './BuySellScene'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import SellQuoteScene from './SellQuoteScene'
import StartScene from './StartScene'

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

export const routes = [{
  path: '/',
  main: StartScene,
  exact: true
}, {
  path: '/buy/:accountId',
  main: BuyScene,
  exact: true
}, {
  path: '/buySell',
  main: BuySellScene,
  exact: true
}, {
  path: '/sellQuote',
  main: SellQuoteScene,
  exact: true
}]

const appStyles = (theme) => ({
  content: {
    height: '100%'
  }
})

type AppProps = {
  classes: Object
}

class App extends Component<AppProps> {
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

export default withStyles(appStyles)(App)
