// @flow

import React, { Component } from 'react'
import { Route, HashRouter as Router } from 'react-router-dom'
import { createMuiTheme, withStyles } from 'material-ui/styles'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { SellQuoteRequestSceneConnector as SellQuoteRequestScene } from '../connectors/SellQuoteRequestSceneConnector'
import { SellQuoteSceneConnector as SellQuoteScene } from '../connectors/SellQuoteScreenConnector.js'
import { StartSceneConnector as StartScene } from '../connectors/StartSceneConnector'
import history from '../history/history';

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
  path: '/sellQuoteRequest',
  main: SellQuoteRequestScene,
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

class Navigation extends Component<AppProps> {
  render () {
    return (
      <MuiThemeProvider theme={theme}>
        <Router history={history}>
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

export default withStyles(appStyles)(Navigation)
