import type { InputHTMLAttributes } from 'react'
import type { FieldValues, UseFormReturn } from 'react-hook-form'

import { Label } from '../../Label/Label'
import { Input } from '../private/Input'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  id: string
  label: string
  className?: string
  formProps?: UseFormReturn<FieldValues, unknown> // gets added via RHForm
}

export const Checkbox = (props: Props) => {
  // --------------------- ===
  //  PROPS
  // ---------------------
  const {
    id, // must be unique in form
    label,
    className,
    formProps,
    required,
    ...rest
  } = props

  // --------------------- ===
  //  RENDER
  // ---------------------
  return (
    <Label
      label={label}
      isRequired={!!required}
      className={
        className ||
        'w-full flex flex-wrap items-center gap-4 text-theme-on-surface'
      }
    >
      <Input
        id={id}
        label={label}
        className="bg-theme-surface border border-gray-500 px-2 py-2 rounded order-first"
        type="checkbox"
        required={!!required}
        formProps={formProps}
        {...rest}
      />
    </Label>
  )
}
