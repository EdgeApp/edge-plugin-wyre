import { } from './components'

// @flow
import * as API from './api'

import React, { Component } from 'react'

import { CircularProgress } from 'material-ui/Progress'
import { INITIAL_KEYS } from './api'
import { PrimaryButton } from './components'
import SellAmountInputContainer from './components/SellAmountInputContainer.js'
import THEME from './constants/themeConstants.js'
import type {WalletDetails} from './types'
import { withStyles } from 'material-ui/styles'

type Props = {
  history: Object,
  classes: Object
}
type State = {
  wallet: WalletDetails | null,
  bankName: string
  /* currencyCode: string | null,
  wallet: WalletDetails | null,
  walletName: string | null,
  currencyIcon: string | null */

}

class SellQuoteScene extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      wallet: null,
      bankName: ''
    }
  }
  componentDidMount = async () => {
    const localStore = await window.edgeProvider.readData(INITIAL_KEYS)
    const wallet = await window.edgeProvider.getCurrentWalletInfo()
    window.edgeProvider.consoleLog('local')
    window.edgeProvider.consoleLog(localStore)

    this.setState({
      wallet: wallet,
      bankName: localStore.wyreAccountName
    })
    /*
    'wyreAccountId',
    'wyreAccountStatus',
    'wyreAccountId_id',
    'wyrePaymentMethodId',
    'wyreNetworkTxId',
    'wyreAccountName',
    'wyreBTC',
    'wyreETH'
    */
  }
  render () {
    const { classes } = this.props
    if (!this.state.wallet ) {
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
          image={this.state.wallet.currencyIcon}
          currencyCode={this.state.wallet.currencyCode}
          label={'Sell'}
          />
        <SellAmountInputContainer
          label={'Receive'}
          currencyCode={'USD'}/>
          <div className={classes.depositBox} >
            <div className={classes.dpLeft} >
              Deposit To:
            </div>
            <div className={classes.dpRight} >
              {this.state.bankName}
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
  },



  buttonContainer: {
    display: 'flex',
    flexDirection: 'row'
  },
  imageContainer: {
    position: 'relative',
    width: '20%'
  },
  textContainer: {
    position: 'relative',
    width: '90%',
    backgroundColor: THEME.COLORS.ACCENT_RED
  },
  space40: {
    height: '40px'
  },
  space10: {
    height: '10px'
  },
  whiteText: {
    fontSize: 17,
    color: THEME.COLORS.WHITE
  },
  greenText: {
    fontSize: 17,
    color: THEME.COLORS.WHITE
  },
  card: {
    margin: '20px 0px',
    padding: '0px 10px'
  },
  h3: {
    color: theme.palette.primary.main,
    padding: 0,
    margin: '10px 0',
    fontSize: '16px',
    fontWeight: 'bold'
  },
  warning: {
    color: theme.palette.primary.error,
    padding: 10,
    margin: '10px 0',
    fontSize: '16px',
    fontWeight: 'bold'
  },
  conversion: {
    fontSize: '24pt',
    color: theme.palette.primary.main
  },
  p: {
    color: '#999',
    paddingBottom: '10px',
    textAlign: 'center'
  }
})

export default withStyles(styles)(SellQuoteScene)
