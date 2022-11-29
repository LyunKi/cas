import { Input, InputProps } from '@cloud-design/components'
import React from 'react'

interface Mobile {
  countryCode: string
  number?: string
}

export interface MobileInputProps extends Omit<InputProps, 'value'> {
  value: Mobile
}

export default function MobileInput(props: any) {
  const { value, onChange, onBlur, ...rest } = props
  const { countryCode, number } = value
  return (
    <Input
      {...rest}
      value={number}
      onChange={onChange('mobile.number')}
      onBlur={onBlur('mobile.number')}
    />
  )
}
