import type { TextareaHTMLAttributes } from 'react'
import type { FieldValues, UseFormReturn } from 'react-hook-form'

import { FieldError } from '../FieldError/FieldError'
import { Label } from '../Label/Label'

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string
  label: string
  formProps?: UseFormReturn<FieldValues, unknown> // gets added via RHForm
}

export const TextArea = (props: Props) => {
  // --------------------- ===
  //  PROPS
  // ---------------------
  const { id, label, formProps, required, minLength, maxLength, ...rest } =
    props

  // --------------------- ===
  //  RENDER
  // ---------------------
  if (!formProps?.register || !id) return null // type help
  const error = formProps.formState.errors[id] || {}
  return (
    <Label label={label} isRequired={!!required}>
      <textarea
        {...formProps.register(id)}
        {...rest}
        aria-invalid={error ? 'true' : 'false'}
        className="bg-theme-surface border border-gray-500 px-2 py-3 rounded"
        minLength={minLength}
        maxLength={maxLength}
        required={!!required}
      />
      <FieldError error={error} />
    </Label>
  )
}
