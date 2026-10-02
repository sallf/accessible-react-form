import { describedBy } from '../../describedBy'
import type { InputHTMLAttributes } from 'react'
import type { FieldValues, RegisterOptions } from 'react-hook-form'
import type { FieldFormMethods } from '../../../hooks/formContext'

import { FieldError } from '../../FieldError/FieldError'
import { getFieldError } from '../../fieldErrors'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  id: string
  label: string
  className: string
  formProps?: FieldFormMethods
  prefix?: string
  showError?: boolean
  registrationOptions?: Pick<
    RegisterOptions<FieldValues>,
    'required' | 'validate'
  >
}

export const Input = (props: Props) => {
  // --- PROPS ---
  const {
    id, // must be unique in form
    label: _label, // consumed by the Label wrapper; kept out of the input's DOM props
    className,
    type = 'text',
    required,
    disabled: explicitlyDisabled,
    formProps,
    prefix,
    showError = true,
    registrationOptions,
    onChange,
    onBlur,
    ...rest
  } = props

  // --- RENDER ---
  if (!formProps?.register || !id) {
    console.log('input error', formProps, id)
    return null // type help
  }

  const disabled = explicitlyDisabled || formProps.formState.disabled
  const error = getFieldError(formProps.formState.errors, id)
  const hasError = !!error
  const errorId = `${id}-error`
  const {
    onChange: registeredOnChange,
    onBlur: registeredOnBlur,
    ...registration
  } = formProps.register(id, { required, ...registrationOptions, disabled })

  const input = (
    <input
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
      type={type}
      aria-required={required ? true : undefined}
      aria-invalid={hasError ? 'true' : 'false'}
      aria-describedby={describedBy(
        props['aria-describedby'],
        hasError ? errorId : undefined
      )}
      data-arform-has-prefix={prefix ? '' : undefined}
      className={`arform__input ${className}`}
      // HTML required is omitted so form validation controls submission.
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
      {showError && <FieldError id={errorId} error={error} />}
    </>
  )
}
