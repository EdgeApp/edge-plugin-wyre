import PropTypes from 'prop-types'
import React from 'react'
import { withStyles } from 'material-ui/styles'
import Typography from 'material-ui/Typography'
import Card, { CardContent } from 'material-ui/Card'
import Grid from 'material-ui/Grid'
import { CircularProgress } from 'material-ui/Progress'
import { ui } from 'edge-libplugin'
import moment from 'moment'

import * as API from './api'
import { formatStatus } from './utils'
import {
  PaymentDetails,
  Support,
  PoweredBy
} from './components'

import './inline.css'

const eventStyles = (theme) => ({
  eventScene: {
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

class EventsScene extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      details: {},
      loaded: false,
      error: null
    }
  }

  componentWillMount () {
    window.scrollTo(0, 0)
    ui.title('Payment History')
    this.loadEvents()
  }

  loadEvents = () => {
    const { paymentId } = this.props.match.params
    API.paymentDetails(paymentId)
      .then(d => d.json())
      .then((data) => {
        this.setState({
          details: data.res,
          loaded: true
        })
      })
      .catch(() => {
        this.setState({
          loaded: true,
          error: 'Unable to load payment events at this time.'
        })
        // Unable to load events at this time...
      })
  }

  _renderEvent = (event) => {
    const status = formatStatus(event.payment_status)
    const date = moment(event.created_at)
    return (
      <Grid container key={event.id}>
        <Grid item xs={6} scope="row">
          <Typography variant="body1">{date.format('LL')}</Typography>
          <Typography variant="caption">{date.format('LT')}</Typography>
        </Grid>
        <Grid item xs={3}>{status}</Grid>
      </Grid>
    )
  }

  _renderEvents = () => {
    return (
      <Grid container>
        <Grid item xs={12}>
          <PaymentDetails payment={this.state.details} />
        </Grid>
        <Grid item xs={12}>
          <Grid container className="header">
            <Grid item xs={6}><Typography>Date</Typography></Grid>
            <Grid item xs={3}><Typography>Status</Typography></Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} className="body">
          {this.state.details &&
              this.state.details.events &&
              this.state.details.events.map(event => {
                return this._renderEvent(event)
              })}
        </Grid>
      </Grid>
    )
  }

  _renderEmpty = () => {
    let block = (<CircularProgress size={25} />)
    if (this.state.loaded) {
      if (this.state.error) {
        block = (<div>{this.state.error}</div>)
      } else {
        block = (<div>No transactions yet!</div>)
      }
    }
    return (
      <div className="d-flex flex-fill empty">
        {block}
      </div>
    )
  }

  render () {
    const body = this.state.details &&
      this.state.details.events &&
      this.state.details.events.length > 0
      ? this._renderEvents()
      : this._renderEmpty()
    return (
      <div className={this.props.classes.eventScene}>
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

EventsScene.propTypes = {
  classes: PropTypes.object,
  match: PropTypes.object
}

export default withStyles(eventStyles)(EventsScene)
