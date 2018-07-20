import PropTypes from 'prop-types'
import React from 'react'
import { withStyles } from 'material-ui/styles'
import Divider from 'material-ui/Divider'
import Typography from 'material-ui/Typography'

import './inline.css'

import { ui } from 'edge-libplugin'
import { EdgeButton, SupportLink } from './components'

const startStyles = (theme) => ({
  container: {
    backgroundColor: '#FFF',
    padding: '20px'
  },
  h3: {
    color: theme.palette.primary.main,
    fontSize: '17pt',
    padding: '5px 0'
  },
  p: {
    fontSize: '14pt'
  },
  divider: {
    margin: '15px 0',
    height: '2px'
  },
  feeList: {
    listStyleType: '-'
  }
})

const StartHeader = (props) => {
  return (
    <Typography variant="headline" component="h3" className={props.classes.h3}>
      {props.text}
    </Typography>
  )
}

StartHeader.propTypes = {
  classes: PropTypes.object,
  text: PropTypes.string
}

const StartParagraph = (props) => {
  return (
    <Typography component="p" className={props.classes.p}>
      {props.children}
    </Typography>
  )
}

StartParagraph.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired
}

class StartScene extends React.Component {
  componentWillMount () {
    ui.title('Buy with Simplex')
    window.scrollTo(0, 0)
    window.localStorage.removeItem('last_crypto_amount')
    window.localStorage.removeItem('last_fiat_amount')
  }
  _start = () => {
    this.props.history.push('/buy/')
  }
  _gotoEvents = () => {
    this.props.history.push('/payments/')
  }
  render () {
    const classes = this.props.classes
    return (
      <div className={classes.container}>
        <div className="text-center">
          <div className="iconLogo" />
        </div>
        <div>
          <StartHeader text="Simplex" classes={classes} />
          <StartParagraph classes={classes}>
            Simplex is an Edge Wallet bank card processing partner. It is the
            service which allows you to purchase Bitcoin, Bitcoin Cash and
            Ethereum safely and quickly in just a few short minutes.
          </StartParagraph>
        </div>
        <Divider className={classes.divider} />
        <div>
          <StartHeader text="Fee" classes={classes} />
          <StartParagraph classes={classes}>
            Please note that additional fees will be charged, on top of the
            above rate at checkout. Those fees are as follows:
          </StartParagraph>
          <ul className={classes.feeList}>
            <li>Edge Wallet 1%</li>
            <li>Credit Card processing by Simplex 5% ($10 min)</li>
          </ul>
        </div>
        <Divider className={classes.divider} />
        <div>
          <StartHeader text="Time" classes={classes} />
          <StartParagraph classes={classes}>
            Estimated transaction time is about 10-30min.
          </StartParagraph>
        </div>
        <Divider className={classes.divider} />
        <div>
          <StartHeader text="Support" classes={classes} />
          <StartParagraph classes={classes}>
            For support, please contact <SupportLink />.
          </StartParagraph>
        </div>
        <Divider className={classes.divider} />
        <div>
          <EdgeButton color="primary" onClick={this._start}>Next</EdgeButton>
          <EdgeButton color="default" onClick={this._gotoEvents}>Transactions</EdgeButton>
        </div>
      </div>
    )
  }
}

StartScene.propTypes = {
  history: PropTypes.object,
  classes: PropTypes.object
}

export default withStyles(startStyles)(StartScene)
