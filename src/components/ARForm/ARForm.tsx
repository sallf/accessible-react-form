import type { FormHTMLAttributes, ReactNode } from 'react'
import { useEffect } from 'react'
import type { EventType, FieldValues, UseFormReturn } from 'react-hook-form'
import { useForm } from 'react-hook-form'

import { ChildrenLoop } from './ChildrenLoop'
import { useYupValidationResolver } from '../../hooks/yup'
import { AnyObjectSchema } from 'yup'

interface Props extends FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode
  // validationSchema?: AnyObject | null
  validationSchema?: AnyObjectSchema | null
  onSubmit: (data: FieldValues) => void
  // ctaLayout?: 'modal' | 'progress' // could have more options?
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
  const resolver = useYupValidationResolver(validationSchema)
  const formProps = useForm({
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
      {validationSchema && (
        <ChildrenLoop validationSchema={validationSchema} formProps={formProps}>
          {children}
        </ChildrenLoop>
      )}
      {errorsCount > 0 && (
        <div role="alert">{`You have (${errorsCount}) error${errorsCount > 1 ? 's' : ''}`}</div>
      )}
      <input type="submit" className="arform__submit" />
    </form>
  )
}
