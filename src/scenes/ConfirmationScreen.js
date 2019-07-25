// @flow
import React, { Component } from 'react'

import { PrimaryButton } from './components'
import THEME from '../constants/themeConstants.js'
import { withStyles } from 'material-ui/styles'

type Props = {
  history: Object,
  classes: Object,
  startOver(Object): void
}
type State = {
}

class ConfirmationScene extends Component<Props, State> {
  onClick = () => {
    this.props.startOver(this.props.history)
  }
  render () {
    const { classes } = this.props
    return <div className={classes.container} >
      <div className={classes.containerTop} >
        <div >
          <div className={classes.bigText} >
            Congratulations
          </div>
          <div className={classes.smallText} >
            Transaction was successful
          </div>
        </div>
      </div>
      <div className={classes.containerBottom} >
        <PrimaryButton onClick={this.onClick}>Done</PrimaryButton>
      </div>
    </div>

  }
}
const styles = theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    backgroundImage: 'linear-gradient(to right, #0E4B75 , #0D2145)'
  },
  containerTop: {
    display: 'flex',
    flexGrow: 1,
    flexDirection:'column',
    width:'90%',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  containerBottom: {
    display: 'flex',
    flexGrow: 1,
    maxHeight: '60px',
    minHeight: '60px',
    width: '90%',
    alignItems: 'center'
  },
  bigText: {
    fontSize: 32,
    color: THEME.COLORS.WHITE,
    width: '100%',
    textAlign: 'center',
    marginBottom: '16px'
  },
  smallText: {
    fontSize: 16,
    color: THEME.COLORS.WHITE,
    width: '100%',
    textAlign: 'center'
  }
})

export default withStyles(styles)(ConfirmationScene)
