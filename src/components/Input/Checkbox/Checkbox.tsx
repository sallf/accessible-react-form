import type { InputHTMLAttributes } from 'react'
import type { FieldValues, UseFormReturn } from 'react-hook-form'

import { Label } from '../../Label/Label'
import { Input } from '../private/Input'
import { FieldError } from '../../FieldError/FieldError'
import React from 'react'
import { useFieldForm } from '../../../hooks/formContext'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  id: string
  label: string
  labelClassName?: string
  formProps?: UseFormReturn<FieldValues, unknown> // gets added via RHForm
}

export const Checkbox = (props: Props) => {
  // --- PROPS ---
  const {
    id, // must be unique in form
    label,
    labelClassName,
    className = '',
    formProps: explicitFormProps,
    required,
    ...rest
  } = props
  const formProps = useFieldForm(explicitFormProps)

  // --- RENDER ---
  return (
    <Label
      label={label}
      isRequired={!!required}
      className={labelClassName}
      isRow
      error={
        <FieldError
          id={`${id}-error`}
          error={formProps?.formState.errors[id]}
        />
      }
    >
      <Input
        id={id}
        label={label}
        className={`arform__checkbox ${className}`}
        type="checkbox"
        required={!!required}
        formProps={formProps}
        {...rest}
        showError={false}
      />
    </Label>
  )
}
