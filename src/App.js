import React from 'react'
import PropTypes from 'prop-types'
import { HashRouter as Router, Route } from 'react-router-dom'
import { withStyles, createMuiTheme } from 'material-ui/styles'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import StartScene from './StartScene'
import BuyScene from './BuyScene'
import PaymentsScene from './PaymentsScene'
import EventsScene from './EventsScene'

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
  path: '/payments/',
  main: PaymentsScene,
  exact: true
}, {
  path: '/events/:paymentId/',
  main: EventsScene,
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
