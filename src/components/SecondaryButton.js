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

export const SecondaryButton = (props: Props) => {
  return (
    <Button
      onClick={props.onClick}
      disabled={props.disabled}
      style={{
        ...buttonStyle,
        backgroundColor: THEME.COLORS.GRAY_2,
        color: THEME.COLORS.WHITE
      }}
      fullWidth
    >
      {props.children}
    </Button>
  )
}
