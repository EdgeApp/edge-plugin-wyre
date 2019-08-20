// @flow
import { buttonStyle, buttonStyleHollow } from '../styles/styles'

import Button from '@material-ui/core/Button'
import React from 'react'
import THEME from '../constants/themeConstants.js'

type Props = {
  onClick(): void,
  lineColor: string,
  children: any,
  disabled: boolean,
  isCustom?: boolean
}
const getStyle = (lineColor, isCustom = false, isDisabled = false) => {
  if (isCustom) {
    return {
      ...buttonStyleHollow,
      backgroundColor: THEME.COLORS.CLEAR,
      height: '50px',
      color: THEME.COLORS.ACCENT_MINT,
      border: `1px solid ${lineColor}`,
    }
  }
  if (isDisabled) {
    return {
      ...buttonStyle,
      backgroundColor: THEME.COLORS.CLEAR,
      height: '50px',
      color: THEME.COLORS.GRAY_2,
      border: `1px solid ${THEME.COLORS.GRAY_2}`,
    }
  }
  return {
    ...buttonStyle,
    backgroundColor: THEME.COLORS.CLEAR,
    color: THEME.COLORS.ACCENT_MINT,
    border: `1px solid ${lineColor}`,
    height: '50px',
    disabledButton: {
      border: `1px solid ${THEME.COLORS.GRAY_2}`,
      color: THEME.COLORS.GRAY_2,
    }
  }
}
export const TertiaryButton = (props: Props) => {
  return (
    <Button
      variant="raised"
      onClick={props.onClick}
      disabled={props.disabled}
      style={getStyle(props.lineColor, props.isCustom, props.disabled)}
      fullWidth>
      {props.children}
    </Button>
  )
}
