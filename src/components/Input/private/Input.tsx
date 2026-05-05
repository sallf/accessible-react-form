import type { InputHTMLAttributes } from 'react'
import type { FieldValues, UseFormReturn } from 'react-hook-form'

import { FieldError } from '../../FieldError/FieldError'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  id: string
  label: string
  className: string
  formProps?: UseFormReturn<FieldValues, unknown> // gets added via RHForm
  prefix?: string
}

export const Input = (props: Props) => {
  // --- PROPS ---
  const {
    id, // must be unique in form
    label,
    className,
    type = 'text',
    required,
    formProps,
    prefix,
    ...rest
  } = props

  // --- RENDER ---
  if (!formProps?.register || !id) {
    console.log('input error', formProps, id)
    return null // type help
  }

  const error = formProps.formState.errors[id]
  const hasError = !!error?.message
  const errorId = `${id}-error`

  const input = (
    <input
      {...formProps.register(id, { required })}
      {...rest}
      type={type}
      aria-required={required ? true : undefined}
      aria-invalid={hasError ? 'true' : 'false'}
      aria-describedby={hasError ? errorId : undefined}
      className={`arform__input ${!!prefix ? 'arform__input--has-prefix' : ''} ${className}`}
      // HTML required intentionally omitted — schema validation drives behavior;
      // aria-required announces the state to assistive tech.
    />
  )
  // TODO prefix styling. Need to generalize it
  return (
    <>
      {prefix ? (
        <span className="arform__prefix">
          <span className="arform__prefix-inner">
            <span>{prefix}</span>
          </span>
          <span className="arform__prefix-input">{input}</span>
        </span>
      ) : (
        input
      )}
      <FieldError id={errorId} error={error} />
    </>
  )
}
