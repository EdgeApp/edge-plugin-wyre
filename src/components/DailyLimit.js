// @flow
import React from 'react'
import Typography from '@material-ui/core/Typography'
import { formatRate } from '../utils'
import { withStyles } from '@material-ui/core/styles'
const limitStyles = theme => ({
  p: {
    fontColor: theme.palette.primary.main,
    backgroundColor: '#d9e3ec',
    textAlign: 'center',
    padding: '10px 0',
    margin: '5px 0'
  }
})
type Props = {
  classes: Object,
  dailyLimit: number,
  monthlyLimit: number,
  fiat: string
}
const DailyLimit = withStyles(limitStyles)((props: Props) => {
  const { dailyLimit, monthlyLimit, fiat } = props
  return (
    <Typography component="p" className={props.classes.p}>
      Daily Limit: {formatRate(dailyLimit, fiat)} / Monthly Limit: {formatRate(monthlyLimit, fiat)}
    </Typography>
  )
})

export { DailyLimit }
