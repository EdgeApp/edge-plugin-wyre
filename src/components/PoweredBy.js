// @flow
import React from 'react'
import THEME from '../constants/themeConstants.js'
import Typography from 'material-ui/Typography'
import { withStyles } from 'material-ui/styles'
const powerThemes = theme => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: '5%'
  },
  logo: {
    height: '30px',
    padding: 0,
    margin: 0
  },
  logoWrapper: {
    borderRadius: '6px',
    backgroundColor: THEME.COLORS.WHITE,
    padding: '4px',
    marginRight: '5%',
  },
  shim: {
    width: '20px'
  },
  p: {
    color: THEME.COLORS.WHITE,
    textAlign: 'center',
    padding: '20px 0'
  }
})
type Props = {
  classes: Object
}
const PoweredBy = withStyles(powerThemes)((props: Props) => {
  return (
    <div className={props.classes.container}>
      <Typography component="p" className={props.classes.p}>
        Powered by Wyre
      </Typography>
      <div className={props.classes.shim} />
      <div className={props.classes.logoWrapper} >
        <div className={`iconLogo ${props.classes.logo}`} />
      </div>
    </div>
  )
})

export { PoweredBy }
