// @flow
import { PoweredBy, PrimaryButton } from './components'
import React, { Component } from 'react'
import {
  containerSpinner,
  poweredByRow,
  sceneButtonBottom,
  sceneContainer,
  sceneMainContainer
} from '../styles/styles'

import CircularProgress from '@material-ui/core/CircularProgress'
import THEME from '../constants/themeConstants'
import TextField from '@material-ui/core/TextField'
import type { WalletDetails } from '../types/AppTypes'
import { withStyles } from '@material-ui/core/styles'

type Props = {
  history: Object,
  classes: Object,
  buyOrSell: string,
  cryptoAmount: string,
  fiatAmount: string,
  wallet: WalletDetails,
  bankName: string,
  exchangeRatesFrom: number,
  exchangeRatesTo: number,
  getExchangeRate(): void,
  confirmQuote(string,string, Object): void,
  changeCrypto(string, number): void,
  changeFiat(string, number): void
}
type State = {
  clicked: number,
  value: string
}

class SellQuoteRequestSceneComponent extends Component<Props, State> {
  inputRef: any
  constructor(props: Props) {
    super(props)
    this.state = {
      value: '',
      clicked: 0
    }
    // $FlowFixMe
    this.inputRef = React.createRef()
  }
  componentDidMount () {
    this.props.getExchangeRate()
  }
  componentDidUpdate() {
   if (this.inputRef.current) {
    this.inputRef.current.focus()
   }
  }
  onClick = () => {
    const cl = this.state.clicked + 1
    this.setState({
      clicked: cl
    })
  }
  onNext = () => {
    if(this.props.fiatAmount !== ''){
      this.props.confirmQuote(this.props.cryptoAmount, this.props.fiatAmount, this.props.history)
    }
  }
  onChange = (event: Object) => {
    const val = event.target.value
    this.setState({
      value: val
    })
    const exchangeRate = this.props.buyOrSell === 'sell' ? this.props.exchangeRatesFrom : this.props.exchangeRatesTo
    this.props.changeFiat(val, exchangeRate)
  }//
  renderReceive = () => {
    const { classes } = this.props
    if(this.state.value !== '') {
      return <div className={classes.receiveAmount} >
      You will {this.props.buyOrSell} {this.props.cryptoAmount} {this.props.wallet.currencyCode}
    </div>
    }
    return <div className={classes.receiveAmount} >You will {this.props.buyOrSell} 0 {this.props.wallet.currencyCode}</div>
  }
  renderOptions = () => {
    const { classes } = this.props
    if(this.state.clicked > 0) {
      return <div className={classes.doRow}>
        <div className={classes.dollar}>$</div>
        <div className={classes.inputWrapper}>{this.state.value}</div>
       </div>
    }
    return <div className={classes.static}>Enter Amount</div>
  }
  render () {
    const { classes } = this.props
    console.log('exchange Rates From ', this.props.exchangeRatesFrom)
    if (!this.props.exchangeRatesFrom) {
      return <div className={classes.containerSpinner}>
      <CircularProgress size={60} />
    </div>
    }
    return <div className={classes.container}>
      <div className={classes.containerMain} onClick={this.onClick}>
            <div className={classes.poweredByRow}>
              <PoweredBy />
            </div>
            {this.renderInvisible()}
            <div className={classes.amountContainer}>
              <div className={classes.innerDiv} >
                {this.renderOptions()}
              </div>
            </div>
            {this.renderReceive()}
            <div className={classes.depositBox} >
              <div className={classes.dpLeft} >
                Deposit To:
              </div>
              <div className={classes.dpRight} >
                {this.props.bankName}
              </div>
            </div>
            <div className={classes.disclaimer} >
              Sell amount is an estimate. Actual rate is determined at the time funds are received.
            </div>
      </div>
      <div className={classes.containerBottom}>
        <PrimaryButton onClick={this.onNext} >Next </PrimaryButton>
      </div>
    </div>
  }
  renderInvisible = () => {
    const { classes } = this.props
   return  <TextField
      inputRef={this.inputRef}
      autoFocus
      id="standard-uncontrolled"
      label="Phone Number"
      type="tel"
      tabIndex='0'
      fullWidth
      InputProps={{
        classes: {
          input: classes.resize,
        },
      }}
      style={{width: '2px', height: '2px', opacity: 0, fontSize: 2, position: 'absolute', top: 0}}
      value={this.state.value}
      className={classes.textField}
      margin="normal"
      onChange={this.onChange}
    />
  }
}
const styles = theme => ({
  container: sceneContainer,
  poweredByRow: poweredByRow,
  containerMain: sceneMainContainer,
  containerBottom: sceneButtonBottom,
  containerSpinner: containerSpinner,
  amountContainer: {
    position: 'relative',
    display: 'flex',
    flexShrink: 1,
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    borderRadius: 6
  },
  static: {
    fontSize: 24,
    border: '1px solid ' + THEME.COLORS.OPACITY_WHITE_TWO,
    borderRadius: 6,
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 15,
    paddingLeft: 15,
    marginTop: 24,
    marginBottom: 20,
    color: THEME.COLORS.WHITE
  },
  innerDiv: {
    display: 'flex',
    flexDirection: 'row',
    position: 'relative',
    flexShrink: 1,
    fontSize: 50,
    color: THEME.COLORS.WHITE
  },
  inputHidden: {
    fontSize: 2,
    border: 0,
    marginLeft: -20,
    color: THEME.COLORS.WHITE
  },
  doRow: {
    display: 'flex',
    position: 'relative',
    flexDirection: 'row',
    marginTop: 24,
    height: 69
  },
  overWrap: {
    height: 70,
    width: 100,
    backgroundColor: THEME.COLORS.ACCENT_ORANGE
  },
  dollar: {
    paddingTop: 10,
    fontSize: 40,
    marginRight: 3
  },
  inputWrapper: {
    fontSize: 68,
  },
  textField: {
    position: 'relative',
    selfAlign: 'center'
  },
  chooseAmount: {
    flexShrink: 1,
    display: 'flex',
    fontSize: 17,
    width: '100%',
    textAlign: 'center',
    marginTop: 24,
    color: THEME.COLORS.WHITE,
    flexDirection: 'column'
  },
  receiveAmount: {
    flexShrink: 1,
    display: 'flex',
    fontSize: 13,
    height: 14,
    width: '100%',
    textAlign: 'center',
    marginTop: 14,
    color: THEME.COLORS.WHITE,
    flexDirection: 'column'
  },
  depositBox: {
    display: 'flex',
    width: '100%',
    height: 62,
    marginTop: 46,
    borderTop: '0.5px solid #FFF',
    borderBottom: '0.5px solid #FFF'
  },
  dpLeft: {
    flexGrow: 1,
    display: 'flex',
    minWidth: 90,
    maxWidth: 90,
    fontSize: 16,
    color: THEME.COLORS.WHITE,
    flexDirection: 'row',
    alignItems: 'center'
  },
  dpRight: {
    flexGrow: 1,
    display: 'flex',
    fontSize: 16,
    color: THEME.COLORS.WHITE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  disclaimer: {
    flex: 1,
    display: 'flex',
    fontSize: 12,
    width: '100%',
    textAlign: 'center',
    color: THEME.COLORS.WHITE,
    flexDirection: 'column',
    marginTop: 20
  },
  resize: {
    fontSize: 2
  },
})
const SellQuoteRequestScene = withStyles(styles)(SellQuoteRequestSceneComponent)
export { SellQuoteRequestScene }
