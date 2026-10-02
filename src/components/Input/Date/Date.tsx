import type { InputHTMLAttributes } from 'react'
import type { FieldFormMethods } from '../../../hooks/formContext'

import { Label } from '../../Label/Label'
import { Input } from '../private/Input'
import React from 'react'
import { useFieldForm } from '../../../hooks/formContext'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  id: string
  label: string
  labelClassName?: string
  formProps?: FieldFormMethods
}

export const Date = (props: Props) => {
  // --- PROPS ---
  const {
    id, // must be unique in form
    label,
    labelClassName,
    className = '',
    formProps: explicitFormProps,
    required,
    ...rest
  } = props
  const formProps = useFieldForm(explicitFormProps)

  // --- RENDER ---
  return (
    <Label label={label} isRequired={!!required} className={labelClassName}>
      <Input
        id={id}
        label={label}
        className={`arform__date ${className}`}
        type="date"
        required={required}
        formProps={formProps}
        {...rest}
      />
    </Label>
  )
}
