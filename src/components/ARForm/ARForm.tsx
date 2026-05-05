import type { FormHTMLAttributes, ReactNode } from 'react'
import { useEffect } from 'react'
import type { EventType, FieldValues, UseFormReturn } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import type { StandardSchemaV1 } from '@standard-schema/spec'

import { ChildrenLoop } from './ChildrenLoop'
import { useStandardSchemaResolver } from '../../hooks/standardSchema'

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
    formProps: UseFormReturn<FieldValues, any>
  ) => void
}

export const ARForm = (props: Props) => {
  // --------------------- ===
  //  PROPS
  // ---------------------
  const {
    children,
    validationSchema = null,
    onSubmit,
    // ctaLayout = 'modal',
    className = '',
    defaultValues = null, // can be passed as array here, or individually to each component
    onChangeCallback = () => null,
    ...rest
  } = props

  // --------------------- ===
  //  HOOKS
  // ---------------------
  const resolver = useStandardSchemaResolver(validationSchema)
  const formProps = useForm<FieldValues>({
    ...(validationSchema && { resolver }),
  }) // only add resolver if there's a schema
  const { handleSubmit, getValues, formState, watch } = formProps

  useEffect(() => {
    if (defaultValues) {
      formProps.reset(defaultValues)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues]) // only default values

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      onChangeCallback(value, name, type, formProps)
    })
    return () => subscription.unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch]) // only watch (could probably be a mountEffect)

  // --------------------- ===
  //  RENDER
  // ---------------------
  const errorsCount = formState.errors
    ? Object.keys(formState.errors).length
    : 0

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`arform ${className}`}
      {...rest}
    >
      <ChildrenLoop formProps={formProps}>{children}</ChildrenLoop>
      {errorsCount > 0 && (
        <div role="alert">{`You have (${errorsCount}) error${errorsCount > 1 ? 's' : ''}`}</div>
      )}
      <input type="submit" className="arform__submit" />
    </form>
  )
}
