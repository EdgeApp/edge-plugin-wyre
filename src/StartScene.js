// @flow

import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { withStyles } from 'material-ui/styles'
import Divider from 'material-ui/Divider'
import Typography from 'material-ui/Typography'
import { genRandomString } from './utils.js'
import './inline.css'
import { ui, core } from 'edge-libplugin'
import { PrimaryButton, TertiaryButton, SupportLink } from './components'
import { API_URL, KEY } from './env.js'

type StartSceneState = {
  wyreAccountId: string | null
}

type StartSceneProps = {
  history: Object,
  classes: Object
}

const startStyles = (theme: Object) => ({
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

type HeaderProps = {
  classes: Object,
  text?: string
}

const StartHeader = (props: HeaderProps) => {
  return (
    <Typography variant="headline" component="h3" className={props.classes.h3}>
      {props.text}
    </Typography>
  )
}

type ParagraphProps = {
  classes: Object,
  children: any
}

const StartParagraph = (props: ParagraphProps) => {
  return (
    <Typography component="p" className={props.classes.p}>
      {props.children}
    </Typography>
  )
}


class StartScene extends Component<StartSceneProps, StartSceneState> {
  constructor (props: StartSceneProps) {
    super(props)
    this.state = {
      wyreAccountId: null
    }
  }

  UNSAFE_componentWillMount = async () => {
    ui.title('Buy with Wyre')
    window.scrollTo(0, 0)
    window.localStorage.removeItem('last_crypto_amount')
    window.localStorage.removeItem('last_fiat_amount')
  }

  componentDidMount = async () => {
    try {
      const key = 'wyreAccountId'
      const wyreAccountId: string = await core.readData(key)
      if (wyreAccountId) { // if an account exists
        this.setState({
          wyreAccountId
        })
        const getAccountResponse = await fetch(`${API_URL}account/${wyreAccountId}`, {
          header: {
            'Authorization': `Bearer ${KEY}`
          }
        })
        const getAccountData = await getAccountResponse.json()
        core.debugLevel(0, 'LOGGING getAccountData is: ', getAccountData)
      } else {
        // this code may never get executed
        const accountId = genRandomString(32)
        const key = 'wyreAccountId'
        const value = accountId
        const success = await core.writeData(key, value)
        if (success) {
          this.setState({
            wyreAccountId: accountId
          })
        } else {
          core.debugLevel(0, 'LOGGING Trouble setting wyre account')
        }
      }
    } catch (e) {
      core.debugLevel(0, 'LOGGING Trouble getting wyre account (does not exist?)')
      const accountId = genRandomString(32)
      const key = 'wyreAccountId'
      const value = accountId
      const success = await core.writeData(key, value)
      if (success) {
        this.setState({
          wyreAccountId: accountId
        })
      } else {
        core.debugLevel(0, 'LOGGING Trouble setting wyre account after not existing')
      }
    }
  }

  // io.console.info

  _buy = () => {
    const { wyreAccountId } = this.state
    core.debugLevel(0, 'LOGGING routing to /buy/ scene with wyreAccountId: ', wyreAccountId)
    let wyreAccountSyntax = wyreAccountId ? wyreAccountId : ''
    this.props.history.push(`/buy/${wyreAccountSyntax}`)
  }

  _sell = () => { // not implemented yet
    this.props.history.push('/sell/')
  }

  render () {
    const classes = this.props.classes
    return (
      <div className={classes.container}>
        <div className="text-center">
          <div className="iconLogo" />
        </div>
        <div>
          <StartHeader text="Wyre" classes={classes} />
          <StartParagraph classes={classes}>
            Wyre is a compliant fiat to crypto exchange allowing user to safely buy and sell cryptocurrency with a bank account directly from Edge.
          </StartParagraph>
        </div>
        <Divider className={classes.divider} />
        <div>
          <StartHeader text="Fee" classes={classes} />
          <StartParagraph classes={classes}>
          The following fees are applied for buying and selling cryptocurrency with Wyre:
            <ul className={classes.feeList}>
              <li>Edge Wallet 0.5%</li>
              <li>Wyre 0.5%</li>
            </ul>
          </StartParagraph>
        </div>
        <Divider className={classes.divider} />
        <div>
          <StartHeader text="Time" classes={classes} />
          <StartParagraph classes={classes}>
            Initial account verification usually takes 1 business day and transactions settle in 3-5 business days.
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
        </div>
      </div>
    )
  }
}

export default withStyles(startStyles)(StartScene)
