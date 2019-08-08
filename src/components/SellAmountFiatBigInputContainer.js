// @flow
import React, { Component } from 'react'

import THEME from '../constants/themeConstants.js'
import { withStyles } from 'material-ui/styles'

type Props = {
  history: Object,
  classes: Object,
  onChange(string): void
}
type State = {
  value: string,
  clicked: boolean

}

class SellAmountFiatBigInputContainer extends Component <Props, State> {
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
    if(this.inputRef.current) {
      this.inputRef.current.focus()
    }
  }
  onClick = () => {
   this.setState({
      clicked: true
    })
  }
  renderDollarSign = () => {
    if(this.state.clicked) {
      return '$'
    }
    return null
  }
  renderInput = () => {
    const { classes } = this.props
    const newWidth = 30 * this.state.value.length
    if(this.state.clicked) {
      const userAgent = navigator.userAgent
      const cn = userAgent.includes("iPhone") ? classes.input : classes.inputAndroid
      return <input
        ref={this.inputRef} // {(input) => { this.myRef = input }}
        type="tel"
        className={cn}
        style={{width: newWidth + 'px'}}
        value={this.state.value}
        onChange={this.onChange}
      />
    }
    return <div className={classes.static}>Enter Amount</div>
  }
  render () {
    const { classes } = this.props
    const newWidth = 30 * this.state.value.length
    return <div className={classes.container}>
        <div className={classes.inputBottom} >
          <div className={classes.innerDiv} onClick={this.onClick}>
            {this.renderDollarSign()}{this.renderInput()}
          </div>
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
  inputAndroid: {
    fontSize: '50px',
    border: '0px',
    marginLeft: '0px',
    color: THEME.COLORS.WHITE,
    backgroundColor: THEME.COLORS.TRANSPARENT
  },
  input: {
    fontSize: '50px',
    border: '0px',
    marginLeft: '-20px',
    color: THEME.COLORS.WHITE,
    backgroundColor: THEME.COLORS.TRANSPARENT
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
  }
})

export default withStyles(styles)(SellAmountFiatBigInputContainer)
