import type { InputHTMLAttributes } from 'react'
import type { FieldValues, UseFormReturn } from 'react-hook-form'

import { Label } from '../../Label/Label'
import { Input } from '../private/Input'
import React from 'react'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  id: string
  label: string
  labelClassName?: string
  formProps?: UseFormReturn<FieldValues, unknown> // gets added via RHForm
}

export const Date = (props: Props) => {
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
    ...rest
  } = props

  // --------------------- ===
  //  RENDER
  // ---------------------
  return (
    <Label label={label} isRequired={!!required} className={labelClassName}>
      <Input
        id={id}
        label={label}
        className={`arform__date ${className}`}
        type="date"
        required={!!required}
        formProps={formProps}
        {...rest}
      />
    </Label>
  )
}
