// @flow
import React from 'react'
import Typography from 'material-ui/Typography'
import { withStyles } from 'material-ui/styles'

const powerThemes = theme => ({
  container: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#d9e3ec'
  },
  logo: {
    height: '30px',
    padding: 0,
    margin: 0
  },
  p: {
    fontColor: theme.palette.primary.main,
    textAlign: 'center',
    padding: '20px 0',
    marginLeft: '10%'
  }
})
type Props = {
  classes: Object
}
const PoweredBy = withStyles(powerThemes)((props: Props) => {
  return (
    <div className={props.classes.container}>
      <div className={`iconLogo ${props.classes.logo}`} />
      <Typography component="p" className={props.classes.p}>
        Powered by Wyre
      </Typography>
    </div>
  )
})

export { PoweredBy }
