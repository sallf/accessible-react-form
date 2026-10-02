import type { FormHTMLAttributes, ReactNode } from 'react'
import { useEffect } from 'react'
import type { EventType, FieldValues, UseFormReturn } from 'react-hook-form'
import { FormProvider, useForm } from 'react-hook-form'
import type { StandardSchemaV1 } from '@standard-schema/spec'

import { useStandardSchemaResolver } from '../../hooks/standardSchema'
import { visuallyHidden } from '../visuallyHidden'
import { getErrorSummary } from '../fieldErrors'

interface Props extends FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode
  validationSchema?: StandardSchemaV1 | null
  onSubmit: (data: FieldValues) => void
  className?: string
  defaultValues?: FieldValues | null
  onChangeCallback?: (
    values: FieldValues,
    name: string | undefined,
    type: EventType | undefined,
    formProps: UseFormReturn<FieldValues>
  ) => void
}

export const ARForm = (props: Props) => {
  // --- PROPS ---
  const {
    children,
    validationSchema = null,
    onSubmit,
    // ctaLayout = 'modal',
    className = '',
    defaultValues = null, // can be passed as array here, or individually to each component
    onChangeCallback,
    ...rest
  } = props

  // --- HOOKS ---
  const resolver = useStandardSchemaResolver(validationSchema)
  const formProps = useForm<FieldValues>({
    ...(validationSchema && { resolver }),
  }) // only add resolver if there's a schema
  const { handleSubmit, formState, watch } = formProps

  useEffect(() => {
    if (defaultValues) {
      formProps.reset(defaultValues)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues]) // only default values

  useEffect(() => {
    if (!onChangeCallback) return
    const subscription = watch((value, { name, type }) => {
      onChangeCallback(value, name, type, formProps)
    })
    return () => subscription.unsubscribe()
  }, [watch, onChangeCallback, formProps])

  // --- RENDER ---
  const { errorsCount, formMessages } = getErrorSummary(formState.errors)

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`arform ${className}`}
      {...rest}
    >
      <FormProvider {...formProps}>{children}</FormProvider>
      {errorsCount > 0 && (
        <div role="alert">
          {`You have (${errorsCount}) error${errorsCount > 1 ? 's' : ''}`}
          {formMessages.length > 0 && (
            <ul>
              {formMessages.map((message, index) => (
                <li key={index}>{message}</li>
              ))}
            </ul>
          )}
        </div>
      )}
      <input
        type="submit"
        className="arform__submit"
        tabIndex={-1}
        aria-hidden="true"
        style={visuallyHidden}
      />
    </form>
  )
}
