import type { InputHTMLAttributes } from 'react'
import type { FieldFormMethods } from '../../../hooks/formContext'

import { Label } from '../../Label/Label'
import { Input } from '../private/Input'
import { useFieldForm } from '../../../hooks/formContext'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  id: string
  label: string
  labelClassName?: string
  className?: string
  formProps?: FieldFormMethods
  prefix?: string
}

export const Text = (props: Props) => {
  // --- PROPS ---
  const {
    id, // must be unique in form
    label,
    labelClassName,
    className = '',
    formProps: explicitFormProps,
    required,
    prefix,
    ...rest
  } = props
  const formProps = useFieldForm(explicitFormProps)

  // --- RENDER ---
  return (
    <Label label={label} isRequired={!!required} className={labelClassName}>
      <Input
        id={id}
        label={label}
        className={`arform__text ${className}`}
        type="text"
        required={required}
        formProps={formProps}
        prefix={prefix}
        {...rest}
      />
    </Label>
  )
}
