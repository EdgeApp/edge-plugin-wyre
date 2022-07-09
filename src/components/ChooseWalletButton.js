// @flow
// import * as API from './api'

import { withStyles } from '@material-ui/core/styles'
import React, { Component } from 'react'

import THEME from '../constants/themeConstants.js'

type Props = {
  image: string,
  classes: Object,
  text: string
}

class ChooseWalletButton extends Component<Props> {
  render() {
    const { classes } = this.props
    return (
      <div className={classes.buttonContainer}>
        <img src={this.props.image} className={classes.image} alt="logo" />
        <div className={classes.shim} />
        <div className={classes.whiteText}>{this.props.text}</div>
      </div>
    )
  }
}

const styles = theme => ({
  buttonContainer: {
    position: 'relative',
    display: 'flex',
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center'
  },
  image: {
    width: '30px',
    height: '30px'
  },
  shim: {
    width: '14px'
  },
  whiteText: {
    fontSize: 17,
    color: THEME.COLORS.WHITE
  }
})

export default withStyles(styles)(ChooseWalletButton)
