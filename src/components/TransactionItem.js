// @flow
import React from 'react'
import THEME from '../constants/themeConstants.js'
import type { WyreTransaction } from '../types/AppTypes'
import { withStyles } from 'material-ui/styles'
const limitStyles = theme => ({
  container: {
    position: 'relative',
    display: 'flex',
    width: '100%',
    border: '1px solid #FFFFFF',
    boxSizing: 'border-box',
    borderRadius: '6px',
    marginBottom: '14px',
    paddingTop: '9px',
    paddingBottom: '9px',
    paddingLeft: '11px',
    paddingRight: '11px',
    flexDirection: 'row'
  },
  containerLeft: {
    flex: 1,
    display: 'flex'
  },
  containerRight: {
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-end'
  },
  columnStuff: {
    display: 'flex',
    flexDirection: 'column'
  },
  transactionTypeText: {
    marginBottom: '5px',
    fontSize: '13px',
    color: THEME.COLORS.WHITE
  },
  cryptoAmountTextSell: {
    marginBottom: '5px',
    fontSize: '13px',
    color: THEME.COLORS.ACCENT_RED,
    textAlign: 'right'
  },
  cryptoAmountTextBuy: {
    marginBottom: '5px',
    fontSize: '13px',
    color: THEME.COLORS.ACCENT_MINT,
    textAlign: 'right'
  },
  dateText: {
    fontSize: '11px',
    color: THEME.COLORS.WHITE
  },
  fiatAmountText: {
    fontSize: '11px',
    color: THEME.COLORS.WHITE,
    textAlign: 'right'
  }
})
type Props = {
  classes: Object,
  transaction: WyreTransaction
}
const TransactionItem = withStyles(limitStyles)((props: Props) => {
  const { transaction, classes } = props
  const transactionType = transaction.destCurrency === 'USD' ? 'Sell' : 'Buy'
  const moneyClass = transactionType === 'Sell' ? classes.cryptoAmountTextSell : classes.cryptoAmountTextBuy
  window.edgeProvider.consoleLog('-- TRANSACTION --')
  window.edgeProvider.consoleLog(transaction)
  const date = new Date(transaction.createdAt)
  const dateString = date.getMonth() + '/' + date.getDate() + '/' + date.getFullYear()
  const upDown = transactionType === 'Sell' ? '-' : '+'
  const cryptoCode = transactionType === 'Sell' ? transaction.sourceCurrency : transaction.destCurrency
  const cryptoAmount =  transactionType === 'Sell' ? transaction.sourceAmount : transaction.destAmount
  const fiatAmount = transactionType === 'Sell' ? transaction.destAmount : transaction.sourceAmount
  return (
    <div className={classes.container} >
      <div className={classes.containerLeft} >
        <div className={classes.columnStuff} >
          <div className={classes.transactionTypeText} >
            {transactionType}: {transaction.status}
          </div>
          <div className={classes.dateText} >
           {dateString}
          </div>
        </div>
      </div>
      <div className={classes.containerRight} >
        <div className={classes.columnStuff} >
          <div className={moneyClass} >
            {upDown} {cryptoAmount} {cryptoCode}
          </div>
          <div className={classes.fiatAmountText} >
            $ {fiatAmount}
          </div>
        </div>
      </div>
    </div>
  )
})

export { TransactionItem }

/*
 return (
    <Typography component="p" className={props.classes.p}>
      Daily Limit: {formatRate(dailyLimit, fiat)} / Monthly Limit: {formatRate(monthlyLimit, fiat)}
    </Typography>
  )
  */
