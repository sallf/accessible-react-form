import type { TextareaHTMLAttributes } from 'react'
import type { FieldValues, UseFormReturn } from 'react-hook-form'

import { FieldError } from '../FieldError/FieldError'
import { Label } from '../Label/Label'
import React from 'react'

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string
  label: string
  labelClassName?: string
  formProps?: UseFormReturn<FieldValues, unknown> // gets added via RHForm
}

export const TextArea = (props: Props) => {
  // --------------------- ===
  //  PROPS
  // ---------------------
  const {
    id,
    label,
    labelClassName,
    className = '',
    formProps,
    required,
    minLength,
    maxLength,
    ...rest
  } = props

  // --------------------- ===
  //  RENDER
  // ---------------------
  if (!formProps?.register || !id) return null // type help
  const error = formProps.formState.errors[id] || {}
  return (
    <Label label={label} isRequired={!!required} className={labelClassName}>
      <textarea
        {...formProps.register(id)}
        {...rest}
        aria-invalid={error ? 'true' : 'false'}
        className={`arform__textarea ${className}`}
        minLength={minLength}
        maxLength={maxLength}
        required={!!required}
      />
      <FieldError error={error} />
    </Label>
  )
}
