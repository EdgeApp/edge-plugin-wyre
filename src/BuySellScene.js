// @flow
import * as API from './api'

import React, { Component } from 'react'

import ChooseWalletButton from './components/ChooseWalletButton'
import THEME from './constants/themeConstants.js'
import { TertiaryButton } from './components/TertiaryButton'
import type { WalletDetails } from './types'
import { withStyles } from 'material-ui/styles'

type Props = {
  history: Object,
  classes: Object,
  wyreAccount: string
}
type State = {
  currencyCode: string | null,
  wallet: WalletDetails | null,
  walletName: string | null,
  currencyIcon: string | null

}

class BuySellScene extends Component<Props, State> {
  constructor (props: Props) {
    super(props)
    this.state = {
      currencyCode: null,
      wallet: null,
      walletName: null,
      currencyIcon: null
    }
  }
  renderWalletButton = () => {

  }

  selectWallet = async () =>{
    window.edgeProvider.consoleLog(' select wallet')
    const currencyCode = await window.edgeProvider.chooseCurrencyWallet(['ETH','BTC','DIA'])
    window.edgeProvider.consoleLog('currency code' + currencyCode)
    if (currencyCode) {
      const wallet = await window.edgeProvider.getCurrentWalletInfo()
      window.edgeProvider.consoleLog('wallet' + currencyCode)
      window.edgeProvider.consoleLog(wallet)
      if(wallet) {
        this.setState({
          currencyCode: currencyCode,
          wallet: wallet,
          walletName: wallet.name
        })
      }
    }
  }
  buy = () => {
    const { wallet, currencyCode } = this.state
    const { wyreAccount } = this.props
    if (!wallet) return
    const addressPrefix = currencyCode === 'BTC' ? 'bitcoin:' : 'ethereum:'
    try {
      const widget = new window.Wyre.Widget({
        env: 'production',
        accountId: 'AC-FJN8L976EW4',
        auth: {
          type: 'secretKey',
          secretKey: wyreAccount
        },
        operation: {
          type: 'onramp',
          destCurrency: currencyCode,
          dest: `${addressPrefix}${wallet.receiveAddress.publicAddress}`
        }
      })
      widget.open()
    } catch (e) {
      window.edgeProvider.consoleLog('Error on Widget thingy')
    }
  }
  renderButtonInsides = () => {
    const { classes } = this.props
    const currencyIcon = this.state.currencyIcon || ''
    if (this.state.walletName) {
      return <ChooseWalletButton text={this.state.walletName} image={currencyIcon}/>
    }
    return <div className={classes.whiteText} >
      Choose Wallet
    </div>
  }
  isBuyDisabled =() => {
    if(!this.state.wallet) {
      return true
    }
    return false
  }
  isSellDisabled =() => {
    if(!this.state.wallet) {
      return true
    }
    if(!API.SUPPORTED_SELL_DIGITAL_CURRENCIES.includes(this.state.currencyCode)){
      return true
    }
    return false
  }

  makeSpend = async () => {
    const spendTarget = {
      nativeAmount: '431980',
      publicAddress: '3A3GmsQBw6kAEt9ySkGca3SusWey9Sswiu',
      otherParams: {}
    }
    try {
      const result = await window.edgeProvider.requestSpend ([spendTarget])
      window.edgeProvider.consoleLog('e I have my result already wtf... ')
      window.edgeProvider.consoleLog(result)
    } catch(e) {
      window.edgeProvider.consoleLog('e I have my error wtf... ')
      window.edgeProvider.consoleLog(e)
    }


  }

  render () {
    const { classes } = this.props
    return <div className={classes.container}>
      <div className={classes.containerInside}>
        <TertiaryButton
          onClick={this.selectWallet}
          lineColor={THEME.COLORS.WHITE}
          isCustom  >
            {this.renderButtonInsides()}
        </TertiaryButton>
        <div className={classes.space40} />
        <TertiaryButton
          onClick={this.buy}
          lineColor={THEME.COLORS.ACCENT_MINT}
          disabled={this.isBuyDisabled()}>
          <div className={classes.greenText} >
            Buy
          </div>
        </TertiaryButton>
        <div className={classes.space10} />
        <TertiaryButton
          onClick={this.makeSpend}
          lineColor={THEME.COLORS.ACCENT_MINT}
          disabled={this.isSellDisabled()}>
          <div className={classes.greenText}>
            Sell
          </div>
        </TertiaryButton>
      </div>
    </div>
  }
}

const styles = theme => ({
  container: {
    width: '100%',
    height: '100%',
    paddingLeft: '5%',
    paddingRight: '5%',
    backgroundImage: 'linear-gradient(to right, #0E4B75 , #0D2145)'
  },
  containerInside: {
    position: 'relative',
    width: '90%',
    height: '100%',
    paddingTop: '50px'
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

export default withStyles(styles)(BuySellScene)
