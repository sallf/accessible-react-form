import { useId } from 'react'
import type { InputHTMLAttributes } from 'react'
import type { FieldFormMethods } from '../../../hooks/formContext'

import { Label } from '../../Label/Label'
import { Input } from '../private/Input'
import { FieldError } from '../../FieldError/FieldError'
import { getFieldError } from '../../fieldErrors'
import React from 'react'
import { useFieldForm } from '../../../hooks/formContext'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  id: string
  label: string
  labelClassName?: string
  formProps?: FieldFormMethods
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
  const formProps = useFieldForm(explicitFormProps, id)
  const errorId = `${useId()}-error`

  // --- RENDER ---
  return (
    <Label
      label={label}
      isRequired={!!required}
      className={labelClassName}
      isRow
      error={
        <FieldError
          id={errorId}
          error={formProps && getFieldError(formProps.formState.errors, id)}
        />
      }
    >
      <Input
        id={id}
        label={label}
        errorId={errorId}
        className={`arform__checkbox ${className}`}
        type="checkbox"
        required={required}
        formProps={formProps}
        {...rest}
      />
    </Label>
  )
}
