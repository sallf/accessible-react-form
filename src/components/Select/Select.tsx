import { describedBy } from '../describedBy'
import type { OptionHTMLAttributes, SelectHTMLAttributes } from 'react'
import type { FieldValues, UseFormReturn } from 'react-hook-form'

import { FieldError } from '../FieldError/FieldError'
import { Label } from '../Label/Label'
import React from 'react'
import { useFieldForm } from '../../hooks/formContext'

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
    formProps: explicitFormProps,
    required,
    disabled: explicitlyDisabled,
    onChange,
    onBlur,
    ...rest
  } = props
  const formProps = useFieldForm(explicitFormProps)
  const disabled = explicitlyDisabled || formProps?.formState.disabled

  // --- RENDER ---
  if (!formProps?.register || !id) return null // type help

  const error = formProps.formState.errors[id]
  const hasError = !!error
  const errorId = `${id}-error`
  const {
    onChange: registeredOnChange,
    onBlur: registeredOnBlur,
    ...registration
  } = formProps.register(id, { required, disabled })

  return (
    <Label label={label} isRequired={!!required} className={labelClassName}>
      <select
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
