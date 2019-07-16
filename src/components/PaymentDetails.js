// @flow
import { formatAmount, formatRate } from '../utils'

import Grid from 'material-ui/Grid'
import React from 'react'
import Typography from 'material-ui/Typography'
import moment from 'moment'

type Props = {
  transaction: Object
}
const PaymentDetails = (props: Props) => {
  const transaction = props.transaction
  const fiatAmount = formatRate(transaction.fiat_total_amount, transaction.fiat_currency)
  const cryptoAmount = formatRate(transaction.requested_digital_amount, transaction.requested_digital_currency)
  const date = moment(transaction.created_at)
  return (
    <Grid container key={transaction.id}>
      <Grid item xs={12}>
        <Grid container className="header">
          <Grid item xs={6}>
            <Typography>Id</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              {transaction.url ? (
                <span>
                  <a href={transaction.url}>{transaction.id}</a>
                  <small>{` (click to view)`}</small>
                </span>
              ) : (
                <span>{transaction.id}</span>
              )}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container className="header">
          <Grid item xs={6}>
            <Typography>Date</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1">
              {date.format('LL')} {date.format('LT')}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container className="header">
          <Grid item xs={6}>
            <Typography>Amount</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              {formatAmount(fiatAmount, transaction.fiat_currency)} / {formatAmount(cryptoAmount, transaction.requested_digital_currency)}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export { PaymentDetails }
