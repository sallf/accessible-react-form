import type { InputHTMLAttributes } from 'react'
import type { FieldValues, UseFormReturn } from 'react-hook-form'

import { Label } from '../../Label/Label'
import { Input } from '../private/Input'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  id: string
  label: string
  labelClassName?: string
  className?: string
  formProps?: UseFormReturn<FieldValues, unknown> // gets added via RHForm
  prefix?: string
}

export const Text = (props: Props) => {
  // --------------------- ===
  //  PROPS
  // ---------------------
  const {
    id, // must be unique in form
    label,
    labelClassName,
    className = '',
    formProps,
    required,
    prefix,
    ...rest
  } = props

  // --------------------- ===
  //  RENDER
  // ---------------------
  return (
    <Label label={label} isRequired={!!required} className={className}>
      <Input
        id={id}
        label={label}
        className={`arform__text ${className}`}
        type="text"
        required={!!required}
        formProps={formProps}
        prefix={prefix}
        {...rest}
      />
    </Label>
  )
}

Text.displayName = 'Text'
