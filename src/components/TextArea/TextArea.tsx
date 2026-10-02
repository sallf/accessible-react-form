import { describedBy } from '../describedBy'
import type { TextareaHTMLAttributes } from 'react'
import type { FieldFormMethods } from '../../hooks/formContext'

import { FieldError } from '../FieldError/FieldError'
import { getFieldError } from '../fieldErrors'
import { Label } from '../Label/Label'
import { useFieldForm } from '../../hooks/formContext'

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string
  label: string
  labelClassName?: string
  formProps?: FieldFormMethods
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
    disabled: explicitlyDisabled,
    minLength,
    maxLength,
    onChange,
    onBlur,
    ...rest
  } = props
  const formProps = useFieldForm(explicitFormProps)
  const disabled = explicitlyDisabled || formProps?.formState.disabled

  // --- RENDER ---
  if (!formProps?.register || !id) return null // type help

  const error = getFieldError(formProps.formState.errors, id)
  const hasError = !!error
  const errorId = `${id}-error`
  const {
    onChange: registeredOnChange,
    onBlur: registeredOnBlur,
    ...registration
  } = formProps.register(id, { required, disabled })

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
