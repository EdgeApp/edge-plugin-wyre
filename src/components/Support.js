// @flow
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import React from 'react'

import { SupportLink } from './SupportLink'
const supportThemes = theme => ({
  p: {
    textAlign: 'center',
    padding: '10px 0'
  }
})
type Props = {
  classes: Object
}
const Support = withStyles(supportThemes)((props: Props) => {
  return (
    <Typography component="p" className={props.classes.p}>
      For support, please contact <SupportLink />.
    </Typography>
  )
})

export { Support }
