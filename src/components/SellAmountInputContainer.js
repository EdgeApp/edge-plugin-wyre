// @flow
import React, { Component } from 'react'

import Input from 'material-ui/Input';
import THEME from '../constants/themeConstants.js'
import { withStyles } from 'material-ui/styles'

type Props = {
  history: Object,
  classes: Object,
  image?: string,
  currencyCode: string,
  label: string,
  value: string,
  onChange(string): void
}
type State = {
  // wallet: WalletDetails | null,
  /* currencyCode: string | null,
  wallet: WalletDetails | null,
  walletName: string | null,
  currencyIcon: string | null */

}

class SellAmountInputContainer extends Component <Props, State> {
  renderImage = () => {
    const { classes } = this.props
    if (this.props.image) {
      return <img src={this.props.image} className={classes.image} alt={'logo'}/>
    }
    return null
  }
  onChange = (event: Object) => {
    this.props.onChange(event.target.value)
  }
  render () {
    const { classes } = this.props
    return <div className={classes.container}>
      <div className={classes.inputContainer}>
        <div className={classes.inputTop} >
          {this.props.label}:
        </div>
        <div className={classes.inputBottom} >
          <Input
            className={classes.inputComponent}
            disableUnderline={true}
            onChange={this.onChange}
            value={this.props.value}
            type={'number'}
            />
        </div>
      </div>
      <div className={classes.vl}>
      </div>
      <div className={classes.currencyContainer}>
        {this.renderImage()}
        <div className={classes.currencyCode}>
          {this.props.currencyCode}
        </div>
      </div>
      <div className={classes.arrowContainer}>

      </div>
    </div>
  }
}

const styles = theme => ({
  container: {
    position: 'relative',
    display: 'flex',
    width: '100%',
    borderRadius: '6px',
    height: '64px',
    backgroundColor: THEME.COLORS.WHITE,
    marginBottom: '20px',
    flexDirection: 'row',
    alignItems: 'center'
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
  inputContainer: {
    position: 'relative',
    height: '64px',
    flexGrow: 2,
    display: 'flex',
    flexDirection: 'column'
  },
  vl: {
    flexGrow: 1,
    minWidth: '1px',
    maxWidth: '1px',
    borderLeft: '1px solid black',
    height: '90%'
  },
  currencyContainer: {
    position: 'relative',
    flexGrow: 1,
    display: 'flex',
    maxWidth: '100px',
    minWidth: '100px',
    height: '100%',
    paddingLeft: '13px',
    paddingRight: '13px',
    flexDirection: 'row',
    alignItems: 'center'
  },
  arrowContainer: {
    position: 'relative',
    flexGrow: 1,
    maxWidth: '20px',
    minWidth: '20px',
    height: '100%'
  },
  image: {
    width: '30px',
    height: '30px'
  },
  currencyCode: {
    fontSize: '17px',
    marginLeft: '10px'
  },
  inputTop: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    paddingLeft: '10px',
    fontSize: '11px',
    color: '#363636',
    alignItems: 'center'
  },
  inputBottom: {
    flex: 1,
    paddingLeft: '10px',
    paddingRight: '10px'
  },
  inputComponent : {
    position: 'relative',
    width: '100%',
    height: '100%'
  }


})

export default withStyles(styles)(SellAmountInputContainer)
