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

type StartSceneState = {
  wyreAccount: string | null
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
      wyreAccount: null
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
      const wyreAccount: string = await core.readData(key)
      if (wyreAccount) {
        this.setState({
          wyreAccount
        })
      } else {
        // this code may never get executed
        const accountId = genRandomString(32)
        const key = 'wyreAccountId'
        const value = accountId
        const success = await core.writeData(key, value)
        if (success) {
          this.setState({
            wyreAccount: accountId
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
          wyreAccount: accountId
        })
      } else {
        core.debugLevel(0, 'LOGGING Trouble setting wyre account after not existing')
      }
    }
  }

  _buy = () => {
    const { wyreAccount } = this.state
    core.debugLevel(0, 'LOGGING routing to /buy/ scene with wyreAccount: ', wyreAccount)
    let wyreAccountSyntax = wyreAccount ? wyreAccount : ''
    this.props.history.push(`/buy/${wyreAccountSyntax}`)
  }

  _sell = () => { // not implemented yet
    this.props.history.push('/sell/')
  }
  _gotoEvents = () => {
    const { wyreAccount } = this.state
    const widget = new window.Wyre.Widget({
      env: 'test',
      accountId: 'SK-XTEA2PLV-7MJX7P7A-PY296XEL-MB6DMYYL',
      auth: {
        type: 'secretKey',
        secretKey: wyreAccount
      },
      operation: {
        type: 'onramp'
      }
    })
    widget.open()
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
          <TertiaryButton onClick={this._gotoEvents}>Transactions</TertiaryButton>
        </div>
      </div>
    )
  }
}

export default withStyles(startStyles)(StartScene)
