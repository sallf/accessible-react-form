import type { InputHTMLAttributes } from 'react'
import type { FieldValues, UseFormReturn } from 'react-hook-form'

import { FieldError } from '../../FieldError/FieldError'
import React from 'react'

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
      className={`arform__input ${className}`}
      // required={!!required} removing required from input so validation can be done by yup
    />
  )
  // TODO prefix styling. Need to generalize it
  return (
    <>
      {prefix ? (
        <span className="flex w-full">
          <span className="text-sm text-kap-black flex-grow-0 px-4 bg-gray-500 rounded -mr-4 pr-6 flex items-center">
            <span>{prefix}</span>
          </span>
          <span className="flex-grow flex flex-col">{input}</span>
        </span>
      ) : (
        input
      )}
      <FieldError error={error} />
    </>
  )
}
