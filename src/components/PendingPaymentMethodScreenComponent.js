// @flow
import React, { Component } from 'react'
import { StartHeader, StartParagraph } from '../scenes/components'

import { withStyles } from '@material-ui/core/styles'

type Props = {
  classes: Object
}
class PendingPaymentMethodScreenComponent extends Component<Props, {}> {
  render () {
    const classes = this.props.classes
    return (
      <div className={classes.container}>
        <div className="text-center">
          <div className="iconLogo" />
        </div>
        <div>
          <StartHeader text="Wyre Payment Method Approval Pending" classes={classes} />
          <StartParagraph classes={classes}>
          Initial payment method verification usually takes 1 business day but can take up to 3-5 business days.
          </StartParagraph>
        </div>
      </div>
    )
  }

}

const startStyles = (theme: Object) => ({
  container: {
    backgroundColor: '#FFF',
    padding: '20px',
    width: '100%',
    height: '100%'
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
export default withStyles(startStyles)(PendingPaymentMethodScreenComponent)
