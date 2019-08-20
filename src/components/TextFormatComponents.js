// @flow
import React from 'react'
import Typography from '@material-ui/core/Typography'

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

export { StartParagraph }
export { StartHeader }
