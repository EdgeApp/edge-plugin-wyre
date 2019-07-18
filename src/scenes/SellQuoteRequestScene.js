// @flow
import React, { Component } from 'react'

import { CircularProgress } from 'material-ui/Progress'
import { PrimaryButton } from './components'
import SellAmountInputContainer from '../components/SellAmountInputContainer.js'
import THEME from '../constants/themeConstants.js'
import type {WalletDetails} from '../types/AppTypes'
import { withStyles } from 'material-ui/styles'

type Props = {
  history: Object,
  classes: Object,
  wallet: WalletDetails,
  bankName: string,
  exchangeRatesFrom: number,
  exchangeRatesTo: number,
  getExchangeRate(): void,
  confirmQuote(string,string, Object): void
}
type State = {
  cryptoAmount: string,
  fiatAmount: string
}

class SellQuoteRequestScene extends Component<Props, State> {
  constructor (props: Props) {
    super(props)
    this.state = {
      cryptoAmount: '',
      fiatAmount: ''
    }
  }
  componentDidMount () {
    this.props.getExchangeRate()
  }
  next = () => {
    this.props.confirmQuote(this.state.cryptoAmount, this.state.fiatAmount, this.props.history)
  }
  changeCrypto = (arg: string) => {
    window.edgeProvider.consoleLog('arg: ' + arg)
    window.edgeProvider.consoleLog('this.props.exchangeRatesFrom: ' + this.props.exchangeRatesFrom)
    window.edgeProvider.consoleLog(Number(arg) * this.props.exchangeRatesFrom)
    const fiat = Number(arg) * this.props.exchangeRatesFrom
    const fiatRound = Math.round(fiat * 100) / 100
    this.setState({
      cryptoAmount: arg,
      fiatAmount: fiatRound.toString()
    })
  }
  changeFiat = (arg: string) => {
    window.edgeProvider.consoleLog('arg: ' + arg)
    window.edgeProvider.consoleLog('this.props.exchangeRatesFrom: ' + this.props.exchangeRatesFrom)
    window.edgeProvider.consoleLog(Number(arg) * this.props.exchangeRatesFrom)
    const crypto = Number(arg) * this.props.exchangeRatesTo
    this.setState({
      fiatAmount: arg,
      cryptoAmount: crypto.toString()
    })
  }
  render () {
    const { classes } = this.props
    if (!this.props.exchangeRatesFrom) {
      return <div className={classes.containerSpinner}>
      <CircularProgress size={60} />
    </div>
    }
    return (<div className={classes.container} >
      <div className={classes.containerInsideTop} >
        <div className={classes.chooseAmount} >
          Choose Amount
        </div>
        <SellAmountInputContainer
          image={this.props.wallet.currencyIcon}
          currencyCode={this.props.wallet.currencyCode}
          label={'Sell'}
          onChange={this.changeCrypto}
          value={this.state.cryptoAmount}
          />
        <SellAmountInputContainer
          label={'Receive'}
          currencyCode={'USD'}
          onChange={this.changeFiat}
          value={this.state.fiatAmount}
          />
          <div className={classes.depositBox} >
            <div className={classes.dpLeft} >
              Deposit To:
            </div>
            <div className={classes.dpRight} >
              {this.props.bankName}
            </div>
          </div>
      </div>
      <div className={classes.containerInsideBottom} >
        <PrimaryButton onClick={this.next}>Next</PrimaryButton>
      </div>
    </div>)
  }
}

const styles = theme => ({
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
    justifyContent: 'space-around'
  },
  depositBox: {
    display: 'flex',
    width: '100%',
    height: '60px',
    borderTop: '0.5px solid #FFF',
    borderBottom: '0.5px solid #FFF'
  },
  dpLeft: {
    flexGrow: 1,
    display: 'flex',
    minWidth: '90px',
    maxWidth: '90px',
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
  }
})

export default withStyles(styles)(SellQuoteRequestScene)
