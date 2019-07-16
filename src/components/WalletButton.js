// @flow
import Button from 'material-ui/Button'
import React from 'react'
import { buttonStyle } from '../styles/styles'

type Props = {
  textColor: string,
  backgroundColor: string,
  onClick(): void,
  children: any,
  disabled: boolean
}

export const WalletButton = (props: Props) => {
  return (
    <Button
      variant="raised"
      onClick={props.onClick}
      disabled={props.disabled}
      style={{
        ...buttonStyle,
        backgroundColor: props.backgroundColor,
        color: props.textColor,
        margin: '0',
        borderRadius: '0',
        borderTop: '1px solid #d8d6d8'
      }}
      fullWidth>
      {props.children}
    </Button>
  )
}


