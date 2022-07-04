// @flow
import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import React, { Component } from 'react'

import THEME from '../constants/themeConstants.js'

type Props = {
  history: Object,
  classes: Object,
  image?: string,
  currencyCode: string,
  label: string,
  value: string,
  onChange(string): void
}
type State = {}

class SellAmountInputContainer extends Component<Props, State> {
  renderImage = () => {
    const { classes } = this.props
    if (this.props.image) {
      return <img src={this.props.image} className={classes.image} alt="logo" />
    }
    return null
  }

  onChange = (event: Object) => {
    this.props.onChange(event.target.value)
  }

  render() {
    const { classes } = this.props
    return (
      <div className={classes.container}>
        <div className={classes.inputContainer}>
          <div className={classes.inputTop}>{this.props.label}:</div>
          <div className={classes.inputBottom}>
            <TextField
              InputProps={{
                classes: {
                  input: classes.resize
                },
                disableUnderline: true,
                fillWidth: true
              }}
              disableUnderline
              onChange={this.onChange}
              value={this.props.value}
              type="number"
            />
          </div>
        </div>
        <div className={classes.currencyContainer}>
          <div className={classes.vl} />
          {this.renderImage()}
          <div className={classes.currencyCode}>{this.props.currencyCode}</div>
        </div>
      </div>
    )
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
  resize: {
    fontSize: '21px',
    width: '60%'
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
    display: 'flex',
    position: 'relative',
    height: '64px',
    flexDirection: 'column'
  },
  vl: {
    minWidth: '1px',
    maxWidth: '1px',
    borderLeft: '1px solid #979797',
    height: '40px',
    marginRight: '14px'
  },
  currencyContainer: {
    position: 'relative',
    display: 'flex',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: '10px',
    borderRadius: '6px'
  },
  image: {
    width: '30px',
    height: '30px'
  },
  currencyCode: {
    fontSize: '17px',
    width: '60px',
    marginLeft: '10px'
  },
  inputTop: {
    flexGrow: 1,
    position: 'relative',
    display: 'flex',
    maxHeight: '21px',
    width: '50%',
    flexDirection: 'row',
    paddingLeft: '10px',
    fontSize: '11px',
    color: '#363636',
    paddingTop: '12px'
  },
  inputBottom: {
    position: 'relative',
    top: '-8px',
    flexGrow: 1,
    display: 'flex',
    width: '90%',

    paddingLeft: '10px',
    paddingRight: '10px',
    fontSize: '21px'
  },
  inputComponent: {
    position: 'relative',
    width: '50%',
    fontSize: '21px'
  }
})

export default withStyles(styles)(SellAmountInputContainer)
