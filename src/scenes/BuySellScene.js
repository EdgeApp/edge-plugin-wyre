// @flow
import { withStyles } from '@material-ui/core/styles'
import React, { Component } from 'react'

import ChooseWalletButton from '../components/ChooseWalletButton'
import { PoweredBy } from '../components/PoweredBy'
import { TertiaryButton } from '../components/TertiaryButton'
import { TransactionItem } from '../components/TransactionItem.js'
import { SUPPORTED_DIGITAL_CURRENCIES } from '../constants/index'
import THEME from '../constants/themeConstants.js'
import type { WalletDetails, WyreTransaction } from '../types/AppTypes'

type Props = {
  classes: Object,
  walletDetails: WalletDetails | null,
  transactions: WyreTransaction[],
  onSellClick(): void,
  selectWallet(): void,
  buy(): void
}
type State = {}

class BuySellScene extends Component<Props, State> {
  renderButtonInsides = () => {
    const { classes, walletDetails } = this.props
    if (walletDetails) {
      return <ChooseWalletButton text={walletDetails.name} image={walletDetails.currencyIcon} />
    }
    return <div className={classes.whiteText}>Choose Wallet</div>
  }

  isBuyDisabled = () => {
    if (!this.props.walletDetails) {
      return true
    }
    return false
  }

  isSellDisabled = () => {
    if (!this.props.walletDetails) {
      return true
    }
    if (!Object.keys(SUPPORTED_DIGITAL_CURRENCIES).includes(this.props.walletDetails.currencyCode)) {
      return true
    }
    return false
  }

  onSellClick = () => {
    this.props.onSellClick()
  }

  renderItems = () => {
    const { transactions } = this.props
    const items = transactions.map((transaction: WyreTransaction) => {
      return <TransactionItem transaction={transaction} key={transaction.id} />
    })
    return items
  }

  renderTransactions = () => {
    const { classes, transactions } = this.props
    if (transactions.length > 0) {
      return <div className={classes.scroller}>{this.renderItems()}</div>
    }
    return null
  }

  render() {
    const { classes, walletDetails } = this.props
    const currencyCode = walletDetails ? walletDetails.currencyCode : ''
    const buyText = this.props.walletDetails ? 'Buy ' + currencyCode + ' with Wyre ' : 'Buy'
    const sellText = this.props.walletDetails ? 'Sell ' + currencyCode + ' with Wyre ' : 'Sell'
    const textStyle = this.isSellDisabled() ? classes.disableText : classes.greenText
    return (
      <div className={classes.container}>
        <div className={classes.containerInside}>
          <PoweredBy />
          <div className={classes.buttonsContainer}>
            <TertiaryButton onClick={this.props.selectWallet} lineColor={THEME.COLORS.WHITE} disabled={false} isCustom>
              {this.renderButtonInsides()}
            </TertiaryButton>
            <div className={classes.space40} />
            <TertiaryButton onClick={this.props.buy} lineColor={THEME.COLORS.ACCENT_MINT} disabled={this.isBuyDisabled()}>
              <div className={textStyle}>{buyText}</div>
            </TertiaryButton>
            <div className={classes.space10} />
            <TertiaryButton onClick={this.onSellClick} lineColor={THEME.COLORS.ACCENT_MINT} disabled={this.isSellDisabled()}>
              <div className={textStyle}>{sellText}</div>
            </TertiaryButton>
          </div>
          <div className={classes.transactionsContainer}>
            <div className={classes.transactionsTitle}>Transaction History</div>
            {this.renderTransactions()}
          </div>
        </div>
      </div>
    )
  }
}

const styles = theme => ({
  scroller: {
    flexGrow: 1,
    position: 'relative',
    width: '100%'
  },
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center'
  },
  containerInside: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    width: '90%',
    height: '85%',
    paddingTop: '20px'
  },
  buttonsContainer: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    width: '100%',
    minHeight: '200px',
    maxHeight: '200px'
  },
  transactionsContainer: {
    paddingTop: '25px',
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column',
    width: '100%',
    fontSize: '17px',
    paddingBottom: '20px'
  },
  bottomPad: {
    display: 'flex',
    flexGrow: 1,
    maxHeight: '20px',
    minHeight: '20px'
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
    color: THEME.COLORS.ACCENT_MINT
  },
  disableText: {
    fontSize: 17,
    color: THEME.COLORS.GRAY_2
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
  conversion: {
    fontSize: '24pt',
    color: theme.palette.primary.main
  },
  p: {
    color: '#999',
    paddingBottom: '10px',
    textAlign: 'center'
  },
  transactionsTitle: {
    flexGrow: 1,
    minHeight: '20px',
    maxHeight: '20px',
    color: THEME.COLORS.WHITE,
    paddingBottom: '17px',
    width: '100%',
    textAlign: 'center'
  }
})

export default withStyles(styles)(BuySellScene)
