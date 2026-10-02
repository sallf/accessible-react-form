import { describedBy } from '../describedBy'
import type { TextareaHTMLAttributes } from 'react'
import type { FieldValues, UseFormReturn } from 'react-hook-form'

import { FieldError } from '../FieldError/FieldError'
import { Label } from '../Label/Label'
import { useFieldForm } from '../../hooks/formContext'

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string
  label: string
  labelClassName?: string
  formProps?: UseFormReturn<FieldValues, unknown> // gets added via RHForm
}

export const TextArea = (props: Props) => {
  // --- PROPS ---
  const {
    id,
    label,
    labelClassName,
    className = '',
    formProps: explicitFormProps,
    required,
    minLength,
    maxLength,
    onChange,
    onBlur,
    ...rest
  } = props
  const formProps = useFieldForm(explicitFormProps)

  // --- RENDER ---
  if (!formProps?.register || !id) return null // type help

  const error = formProps.formState.errors[id]
  const hasError = !!error?.message
  const errorId = `${id}-error`
  const {
    onChange: registeredOnChange,
    onBlur: registeredOnBlur,
    ...registration
  } = formProps.register(id)

  return (
    <Label label={label} isRequired={!!required} className={labelClassName}>
      <textarea
        {...rest}
        {...registration}
        id={id}
        onChange={(event) => {
          void registeredOnChange(event)
          onChange?.(event)
        }}
        onBlur={(event) => {
          void registeredOnBlur(event)
          onBlur?.(event)
        }}
        aria-required={required ? true : undefined}
        aria-invalid={hasError ? 'true' : 'false'}
        aria-describedby={describedBy(
          props['aria-describedby'],
          hasError ? errorId : undefined
        )}
        className={`arform__textarea ${className}`}
        minLength={minLength}
        maxLength={maxLength}
      />
      <FieldError id={errorId} error={error} />
    </Label>
  )
}
