// @flow
import React from 'react'
import {SupportLink} from './SupportLink'
import Typography from 'material-ui/Typography'
import { withStyles } from 'material-ui/styles'
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
