// @flow
import React, { Component } from 'react'

import ChooseWalletButton from '../components/ChooseWalletButton'
import { SUPPORTED_SELL_DIGITAL_CURRENCIES } from '../constants/index'
import THEME from '../constants/themeConstants.js'
import { TertiaryButton } from '../components/TertiaryButton'
import type { WalletDetails } from '../types/AppTypes'
import { withStyles } from 'material-ui/styles'

type Props = {
  history: Object,
  classes: Object,
  wallet: WalletDetails | null,
  onSellClick(): void,
  selectWallet(): void,
  buy(): void
}
type State = {
}

class BuySellScene extends Component<Props, State> {


  /* buy = () => {
    const { wallet } = this.props
    const { currencyCode } =  wallet
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
  } */
  renderButtonInsides = () => {
    const { classes, wallet } = this.props
    if (wallet) {
      return <ChooseWalletButton text={wallet.name} image={wallet.currencyIcon}/>
    }
    return <div className={classes.whiteText} >
      Choose Wallet
    </div>
  }
  isBuyDisabled =() => {
    if(!this.props.wallet) {
      return true
    }
    return false
  }
  isSellDisabled =() => {
    if(!this.props.wallet) {
      return true
    }
    if(!SUPPORTED_SELL_DIGITAL_CURRENCIES.includes(this.props.wallet.currencyCode)){
      return true
    }
    return false
  }

  onSellClick = () => {
    this.props.onSellClick()
  }
  render () {
    const { classes } = this.props
    return <div className={classes.container}>
      <div className={classes.containerInside}>
        <TertiaryButton
          onClick={this.props.selectWallet}
          lineColor={THEME.COLORS.WHITE}
          disabled={false}
          isCustom  >
            {this.renderButtonInsides()}
        </TertiaryButton>
        <div className={classes.space40} />
        <TertiaryButton
          onClick={this.props.buy}
          lineColor={THEME.COLORS.ACCENT_MINT}
          disabled={this.isBuyDisabled()}>
          <div className={classes.greenText} >
            Buy
          </div>
        </TertiaryButton>
        <div className={classes.space10} />
        <TertiaryButton
          onClick={this.onSellClick}
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
