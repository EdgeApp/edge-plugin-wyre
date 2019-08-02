// @flow
import React, { Component } from 'react'

import THEME from '../constants/themeConstants.js'
import TextField from 'material-ui/TextField'
import { withStyles } from 'material-ui/styles'

type Props = {
  history: Object,
  classes: Object,
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

class SellAmountFiatBigInputContainer extends Component <Props, State> {
  onChange = (event: Object) => {
    const val = event.target.value.substring(1)
    this.props.onChange(val)
  }
  render () {
    const { classes } = this.props
    const stringValue = '$' + this.props.value
    return <div className={classes.container}>
        <div className={classes.inputBottom} >
          <TextField
            InputProps={{
              classes: {
                input: classes.resize
              },
              disableUnderline: true,
              fillWidth: true,
              autoFocus: true
            }}
            disableUnderline={true}
            onChange={this.onChange}
            value={stringValue}
            type={'tel'}
            autoFocus={true}
            />
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
    height: '81px',
    marginBottom: '20px'
  },
  resize: {
    fontSize: '64px',
    textAlign: "center",
    color: THEME.COLORS.WHITE
  },
  inputBottom: {
    position: 'relative',
    flexGrow: 1,
    display: 'flex',
    width: '90%',
    alignItems: 'center',
    paddingLeft: '10px',
    paddingRight: '10px',
    fontSize: '21px'
  },
  inputComponent : {
    position: 'relative',
    width: '50%',
    fontSize: '21px'
  }


})

export default withStyles(styles)(SellAmountFiatBigInputContainer)
