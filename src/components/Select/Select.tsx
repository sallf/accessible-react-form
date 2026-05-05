import type { OptionHTMLAttributes, SelectHTMLAttributes } from 'react'
import type { FieldValues, UseFormReturn } from 'react-hook-form'

import { FieldError } from '../FieldError/FieldError'
import { Label } from '../Label/Label'
import React from 'react'

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  labelClassName?: string
  options: (
    | string
    | (OptionHTMLAttributes<HTMLOptionElement> & {
        label: string
        value: string
      })
  )[] // can be a simple string or more complex option obj
  formProps?: UseFormReturn<FieldValues, unknown> // gets added via RHForm
}

export const Select = (props: Props) => {
  // --- PROPS ---
  const {
    id,
    label,
    labelClassName,
    className = '',
    options,
    formProps,
    required,
    ...rest
  } = props

  // --- RENDER ---
  if (!formProps?.register || !id) return null // type help

  const error = formProps.formState.errors[id]
  const hasError = !!error?.message
  const errorId = `${id}-error`

  return (
    <Label label={label} isRequired={!!required} className={labelClassName}>
      <select
        {...formProps.register(id)}
        {...rest}
        aria-required={required ? true : undefined}
        aria-invalid={hasError ? 'true' : 'false'}
        aria-describedby={hasError ? errorId : undefined}
        className={`arform__select ${className}`}
      >
        {options.map((opt) => {
          const isStr = typeof opt === 'string'
          let label, value, more
          if (isStr) {
            label = value = opt
            more = {}
          } else {
            ;({ label, value, ...more } = opt)
          }
          return (
            <option key={label} value={value} {...more}>
              {label}
            </option>
          )
        })}
      </select>
      <FieldError id={errorId} error={error} />
    </Label>
  )
}

Select.displayName = 'Select'
