// @flow
import React, { Component } from 'react'
import type {SellQuoteData, WalletDetails} from '../types/AppTypes'

import { CircularProgress } from 'material-ui/Progress'
import { PrimaryButton } from './components'
import THEME from '../constants/themeConstants.js'
import { withStyles } from 'material-ui/styles'

type Props = {
  history: Object,
  classes: Object,
  wallet: WalletDetails,
  bankName: string,
  quote: SellQuoteData | null,
  confirmQuote(Object): void
}
type State = {
}

class SellQuoteScene extends Component<Props, State> {
  confirm = () => {
    this.props.confirmQuote(this.props.history)
  }
  render () {
    const { classes } = this.props
    const { quote, wallet } = this.props
    if(!quote) {
      return <div className={classes.containerSpinner}>
      <CircularProgress size={60} />
    </div>
    }

    const usdAmount = quote.sourceAmount * quote.exchangeRate
    const totalFees = quote.totalFees * quote.exchangeRate
    const totalAmount = quote.sourceAmount - quote.totalFees
    const totalAmountFiat = totalAmount * quote.exchangeRate
    return (<div className={classes.container} >
      <div className={classes.containerInsideTop} >
        <div className={classes.chooseAmount} >
          <div className={classes.amountText} >
            {quote.sourceAmount}
          </div>
          Amount to be sold
        </div>
        <div className={classes.depositBox} >
          <div className={classes.dpLeft} >
            {this.props.wallet.currencyCode} Price:
          </div>
          <div className={classes.dpRight} >
            ${ Math.round(usdAmount * 100) / 100 }
          </div>
        </div>
        <div className={classes.depositBox} >
          <div className={classes.dpLeft} >
            Deposit To:
          </div>
          <div className={classes.dpRight} >
            {this.props.bankName}
          </div>
        </div>
        <div className={classes.depositBox} >
          <div className={classes.dpLeft} >
            Source Wallet:
          </div>
          <div className={classes.dpRight} >
            {wallet.name}
          </div>
        </div>
        <div className={classes.shim} />
        <div className={classes.depositBox} >
          <div className={classes.dpLeft} >
            <div className={classes.stack} >
              <div className={classes.greenLeft} >
                Fee:
              </div>
              <div className={classes.greenLeft} >
                Total:
              </div>
            </div>
          </div>
          <div className={classes.dpRight} >
            <div className={classes.stack} >
              <div className={classes.green} >
                $ {Math.round(totalFees * 100) / 100}
              </div>
              <div className={classes.green} >
                $ {Math.round(totalAmountFiat * 100) / 100}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={classes.containerInsideBottom} >
        <PrimaryButton onClick={this.confirm}>Confirm</PrimaryButton>
      </div>
    </div>)
  }
}

const styles = theme => ({
  shim: {
    height: '15px'
  },
  container: {
    width: '100%',
    height: '100%',
    paddingLeft: '5%',
    paddingRight: '5%',
    display: 'flex',
    flexDirection: 'column',
    backgroundImage: 'linear-gradient(to right, #0E4B75 , #0D2145)'
  },
  containerInsideTop: {
    flexGrow: 2,
    position: 'relative',
    width: '90%',
    minHeight: '320px',
    maxHeight: '320px',
    paddingTop: '50px'
  },
  containerInsideBottom: {
    flexGrow: 1,
    display: 'flex',
    position: 'relative',
    width: '90%',
    paddingBottom: '10px',
    alignItems: 'flex-end'
  },
  chooseAmount: {
    alignItems: 'center',
    textAlign: 'center',
    fontSize: '17px',
    color: THEME.COLORS.WHITE,
    marginBottom: '25px'
  },
  containerSpinner: {
    display: 'flex',
    flex: '1',
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundImage: 'linear-gradient(to right, #0E4B75 , #0D2145)'
  },
  depositBox: {
    display: 'flex',
    width: '100%',
    height: '60px',
    borderBottom: '0.5px solid #FFF'
  },
  dpLeft: {
    flexGrow: 1,
    display: 'flex',
    minWidth: '90px',
    maxWidth: '130px',
    fontSize: '16px',
    color: THEME.COLORS.WHITE,
    flexDirection: 'row',
    alignItems: 'center'
  },
  dpRight: {
    flexGrow: 1,
    display: 'flex',
    fontSize: '16px',
    color: THEME.COLORS.WHITE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  amountText: {
    fontSize: 32
  },
  stack: {
    display: 'flex',
    flexDirection: 'column'
  },
  green: {
    color: THEME.COLORS.ACCENT_MINT,
    textAlign: 'right'
  },
  greenLeft: {
    color: THEME.COLORS.ACCENT_MINT,
    textAlign: 'left'
  }
})

export default withStyles(styles)(SellQuoteScene)
