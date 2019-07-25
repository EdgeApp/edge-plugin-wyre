// @flow
import React from 'react'
import THEME from '../constants/themeConstants.js'
import { withStyles } from 'material-ui/styles'
const powerThemes = theme => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: '5%',
    paddingTop: '10px'
  },
  containerInner: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end'
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
    width: '10px'
  },
  p: {
    color: THEME.COLORS.WHITE,
    textAlign: 'right',
    fontSize: 11
  },
  p2: {
    color: THEME.COLORS.OPACITY_WHITE_TWO,
    textAlign: 'right',
  }
})
type Props = {
  classes: Object
}
const PoweredBy = withStyles(powerThemes)((props: Props) => {
  return (
    <div className={props.classes.container}>
      <div className={props.classes.containerInner} >
        <div className={props.classes.p} >
          Powered by
        </div>
        <div className={props.classes.p} >
          support: support@sendwyre.com
        </div>

      </div>
      <div className={props.classes.shim} />
      <div className={props.classes.logoWrapper} >
        <div className={`iconLogo ${props.classes.logo}`} />
      </div>
    </div>
  )
})

export { PoweredBy }
