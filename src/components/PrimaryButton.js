// @flow
import Button from '@material-ui/core/Button'
import React from 'react'

import THEME from '../constants/themeConstants.js'
import { buttonStyle } from '../styles/styles'

type Props = {
  onClick(): void,
  children: any,
  disabled?: boolean
}

export const PrimaryButton = (props: Props) => {
  return (
    <Button
      variant="raised"
      onClick={props.onClick}
      disabled={props.disabled}
      style={{
        ...buttonStyle,
        backgroundColor: THEME.COLORS.SECONDARY,
        color: THEME.COLORS.WHITE
      }}
      fullWidth
    >
      {props.children}
    </Button>
  )
}
