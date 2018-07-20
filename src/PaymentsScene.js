import PropTypes from 'prop-types'
import React from 'react'
import { withStyles } from 'material-ui/styles'
import Typography from 'material-ui/Typography'
import Card, { CardContent } from 'material-ui/Card'
import Grid from 'material-ui/Grid'
import { CircularProgress } from 'material-ui/Progress'
import { ui } from 'edge-libplugin'

import * as API from './api'
import {
  PaymentRow,
  Support,
  PoweredBy
} from './components'

import './inline.css'

const eventStyles = (theme) => ({
  paymentScene: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  h3: {
    color: theme.palette.primary.main,
    fontSize: '17pt',
    padding: '5px 0',
    textAlign: 'center'

  },
  card: {
    margin: '20px',
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column'
  }
})

class PaymentsScene extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      payments: [],
      loaded: false
    }
  }

  componentWillMount () {
    window.scrollTo(0, 0)
    ui.title('Transactions')
    this.loadEvents()
  }

  loadEvents = () => {
    API.payments(API.userId())
      .then(d => d.json())
      .then((data) => {
        this.setState({
          payments: data.res || [],
          loaded: true
        })
      })
      .catch(() => {
        // Unable to load payments at this time...
      })
  }

  _renderPayment = (payment) => {
    return (<PaymentRow
      history={this.props.history}
      payment={payment}
      key={payment.payment_id} />)
  }

  _renderPayments = () => {
    return (
      <Grid container>
        <Grid item xs={12}>
          <Grid container className="header">
            <Grid item xs={6}><Typography>Created</Typography></Grid>
            <Grid item xs={3}><Typography>Amount</Typography></Grid>
            <Grid item xs={3}><Typography>Status</Typography></Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} className="body">
          {this.state.payments.map(payment => {
            return this._renderPayment(payment)
          })}
        </Grid>
      </Grid>
    )
  }

  _renderEmpty = () => {
    return (
      <div className="d-flex flex-fill empty">
        {this.state.loaded && (
          <div>No transactions yet!</div>
        )}
        {!this.state.loaded && (
          <CircularProgress size={25} />
        )}
      </div>
    )
  }

  render () {
    const body = this.state.payments.length > 0
      ? this._renderPayments()
      : this._renderEmpty()
    return (
      <div className={this.props.classes.paymentScene}>
        <div className="flex-fill d-flex">
          <Card className={this.props.classes.card}>
            <CardContent className="d-flex flex-fill">
              { body }
            </CardContent>
          </Card>
        </div>

        <div className="flex-shrink">
          <Support />
          <PoweredBy />
        </div>
      </div>
    )
  }
}

PaymentsScene.propTypes = {
  classes: PropTypes.object,
  history: PropTypes.object
}

export default withStyles(eventStyles)(PaymentsScene)
