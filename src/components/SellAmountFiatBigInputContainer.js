// @flow
import { colors, withStyles } from '@material-ui/core/styles'
import React, { Component } from 'react'

import THEME from '../constants/themeConstants.js'

type Props = {
  history: Object,
  classes: Object,
  onChange(string): void
}
type State = {
  value: string,
  clicked: boolean
}

class SellAmountFiatBigInputContainer extends Component<Props, State> {
  inputRef: any
  constructor(props: Props) {
    super(props)
    this.state = {
      value: '',
      clicked: false
    }
    // $FlowFixMe
    this.inputRef = React.createRef()
  }

  onChange = (event: Object) => {
    const val = event.target.value
    this.setState({
      value: val
    })
    this.props.onChange(val)
  }

  componentDidUpdate() {
    if (this.inputRef.current) {
      this.inputRef.current.focus()
    }
  }

  onClick = () => {
    this.setState({
      clicked: true
    })
  }

  renderOptions = () => {
    const { classes } = this.props
    if (this.state.clicked) {
      return (
        <div className={classes.doRow}>
          <div className={classes.dollar}>$</div>
          <div className={classes.inputWrapper}>{this.state.value}</div>
        </div>
      )
    }
    return <div className={classes.static}>Enter Amount</div>
  }

  render() {
    const { classes } = this.props
    const newWidth = 30 * this.state.value.length
    return (
      <div className={classes.container}>
        <div className={classes.inputBottom}>
          <div className={classes.innerDiv} onClick={this.onClick}>
            {this.renderOptions()}
          </div>
          <input
            ref={this.inputRef} // {(input) => { this.myRef = input }}
            type="tel"
            className={classes.inputHidden}
            style={{ width: '2px', height: '2px', opacity: 0 }}
            value={this.state.value}
            onChange={this.onChange}
          />
        </div>
      </div>
    )
  }
}

const styles = theme => ({
  doRow: {
    display: 'flex',
    position: 'relative',
    flexDirection: 'row',
    height: '100%'
  },
  container: {
    position: 'relative',
    display: 'flex',
    width: '100%',
    borderRadius: '6px',
    height: '81px',
    marginBottom: '20px'
  },
  inputHidden: {
    fontSize: '2px',
    border: '0px',
    marginLeft: '-20px',
    color: THEME.COLORS.WHITE
  },
  static: {
    fontSize: '24px',
    border: '1px solid ' + THEME.COLORS.OPACITY_WHITE_TWO,
    borderRadius: '6px',
    paddingTop: '10px',
    paddingBottom: '10px',
    paddingRight: '15px',
    paddingLeft: '15px',
    color: THEME.COLORS.WHITE
  },
  innerDiv: {
    flexDirection: 'row',
    position: 'relative',
    minWidth: '30px',
    fontSize: '50px',
    topMargin: '20px',
    height: '100%',
    color: THEME.COLORS.WHITE
  },
  inputBottom: {
    position: 'relative',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    width: '90%',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingLeft: '10px',
    paddingRight: '10px',
    fontSize: '21px'
  },
  dollar: {
    paddingTop: '10px',
    fontSize: '30px',
    height: '100%',
    marginRight: '3px'
  },
  inputWrapper: {
    fontSize: '50px',
    height: '100%'
  }
})

export default withStyles(styles)(SellAmountFiatBigInputContainer)
