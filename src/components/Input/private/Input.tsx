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
  // --------------------- ===
  //  PROPS
  // ---------------------
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

  // --------------------- ===
  //  RENDER
  // ---------------------
  if (!formProps?.register || !id) {
    console.log('input error', formProps, id)
    return null // type help
  }
  const error = formProps.formState.errors[id] || {}
  const input = (
    <input
      {...formProps.register(id, { required })}
      {...rest}
      type={type}
      aria-invalid={error ? 'true' : 'false'}
      className={`arform__input ${!!prefix ? 'arform__input--has-prefix' : ''} ${className}`}
      // required={!!required} removing required from input so validation can be done by yup
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
      <FieldError error={error} />
    </>
  )
}
