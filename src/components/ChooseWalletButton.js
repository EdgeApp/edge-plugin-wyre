// @flow
// import * as API from './api'

import React, {Component} from 'react'

import THEME from '../constants/themeConstants.js'
import { withStyles } from 'material-ui/styles'

type Props = {
  image: string,
  classes: Object,
  text: string
}

class ChooseWalletButton extends Component<Props> {
  render () {
    const { classes } = this.props
    return <div className={classes.buttonContainer}>
    <div className={classes.imageContainer}>
      <img src={this.props.image} className={classes.image} alt={'logo'}/>
    </div>
    <div className={classes.textContainer}>
      <div className={classes.whiteText} >
        {this.props.text}
      </div>
    </div>
  </div>
  }
}

const styles = theme => ({
  buttonContainer: {
    position: 'relative',
    display: 'flex',
    width:'100%',
    height:'100%',
    flexDirection: 'row'
  },
  imageContainer: {
    position: 'relative',
    width: '20%'
  },
  image: {
    width: '30px',
    height: '30px'
  },
  textContainer: {
    display: 'flex',
    position: 'relative',
    width: '90%',
    alignItems: 'center'
  },
  whiteText: {
    fontSize: 17,
    color: THEME.COLORS.WHITE
  },
})

export default withStyles(styles)(ChooseWalletButton)
