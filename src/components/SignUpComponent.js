// @flow
import { PrimaryButton, StartHeader, StartParagraph, SupportLink } from '../scenes/components'
import React, { Component } from 'react'

import Divider from 'material-ui/Divider'
import { withStyles } from 'material-ui/styles'

type Props = {
  classes: Object,
  onPress(): void
}
class SignUpComponent extends Component<Props, {}> {
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
          <PrimaryButton onClick={this.props.onPress}>Create Account</PrimaryButton>
        </div>
      </div>
    )
  }

}

const startStyles = (theme: Object) => ({
  container: {
    backgroundColor: '#FFF',
    padding: '20px'
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
export default withStyles(startStyles)(SignUpComponent)
