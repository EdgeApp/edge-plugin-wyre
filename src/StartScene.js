import PropTypes from 'prop-types'
import React from 'react'
import { withStyles } from 'material-ui/styles'
import Divider from 'material-ui/Divider'
import Typography from 'material-ui/Typography'
import logo from './logo.png'
import THEME from './constants/themeConstants.js'
import './inline.css'
import { ui } from 'edge-libplugin'
import { PrimaryButton, SecondaryButton, TertiaryButton, SupportLink } from './components'

console.log('THEME is: ', THEME)
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
  UNSAFE_componentWillMount = async () => {
    ui.title('Buy &amp; Sell with Wyre')
    window.scrollTo(0, 0)
    window.localStorage.removeItem('last_crypto_amount')
    window.localStorage.removeItem('last_fiat_amount')
  }
  _buy = () => {
    this.props.history.push('/buy/')
  }

  _sell = () => {
    this.props.history.push('/sell/')
  }
  _gotoEvents = () => {
    this.props.history.push('/payments/')
  }
  render () {
    const classes = this.props.classes
    return (
      <div className={classes.container}>
        <div style={{ textAlign: 'center' }}>
          <img src={logo} className='iconLogo' />
        </div>
        <div>
          <StartHeader text="Wyre" classes={classes} />
          <StartParagraph classes={classes}>
            Wyre is a secure and compliant bridge between fiat currencies and cryptocurrency. Exchange crypto safely and securely.
          </StartParagraph>
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
          <PrimaryButton onClick={this._buy}>Buy</PrimaryButton>
          <SecondaryButton onClick={this._sell}>Sell</SecondaryButton>
          <TertiaryButton onClick={this._gotoEvents}>Transactions</TertiaryButton>
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
