import type { TextareaHTMLAttributes } from 'react'
import type { FieldValues, UseFormReturn } from 'react-hook-form'

import { FieldError } from '../FieldError/FieldError'
import { Label } from '../Label/Label'

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string
  label: string
  labelClassName?: string
  formProps?: UseFormReturn<FieldValues, unknown> // gets added via RHForm
}

export const TextArea = (props: Props) => {
  // --- PROPS ---  s
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

  // --- RENDER ---
  if (!formProps?.register || !id) return null // type help

  const error = formProps.formState.errors[id]
  const hasError = !!error?.message
  const errorId = `${id}-error`

  return (
    <Label label={label} isRequired={!!required} className={labelClassName}>
      <textarea
        {...formProps.register(id)}
        {...rest}
        aria-required={required ? true : undefined}
        aria-invalid={hasError ? 'true' : 'false'}
        aria-describedby={hasError ? errorId : undefined}
        className={`arform__textarea ${className}`}
        minLength={minLength}
        maxLength={maxLength}
      />
      <FieldError id={errorId} error={error} />
    </Label>
  )
}

TextArea.displayName = 'TextArea'
