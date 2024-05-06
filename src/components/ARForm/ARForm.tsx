import React from 'react'

// import { useYupValidationResolver } from '@shared/hooks'
import type { FormHTMLAttributes, ReactNode } from 'react'
import { useEffect } from 'react'
import type { EventType, FieldValues, UseFormReturn } from 'react-hook-form'
import { useForm } from 'react-hook-form'
// import type { AnyObject } from 'yup'

// import { Btn } from '../../buttons'
import { ChildrenLoop } from './ChildrenLoop'
import type { FormCtas } from '../types'

interface Props extends FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode
  // validationSchema?: AnyObject | null
  validationSchema?: any // TODO
  formCtas: FormCtas
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
    formCtas,
    // ctaLayout = 'modal',
    className = 'flex flex-wrap gap-4',
    defaultValues = null, // can be passed as array here, or individually to each component
    onChangeCallback = () => null,
    ...rest
  } = props

  // --------------------- ===
  //  HOOKS
  // ---------------------
  // const resolver = useYupValidationResolver(validationSchema)
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
      onSubmit={handleSubmit(formCtas.submit.onClick)}
      className={className}
      {...rest}
    >
      {validationSchema && (
        <ChildrenLoop validationSchema={validationSchema} formProps={formProps}>
          {children}
        </ChildrenLoop>
      )}
      {/* <div className="mt-2 flex gap-2 justify-end w-full col-span-full">
        {!formCtas.submit.hide && (
          <div className={`order-1 ${ctaLayout === 'modal' ? '' : 'ml-auto'}`}>
            <Btn
              {...formCtas.submit}
              onClick={() => null} // handled by form's onSubmit
              btnType="submit"
            />
          </div>
        )}
        {formCtas.cancel && (
          <div className="order-0">
            <Btn
              {...formCtas.cancel}
              onClick={() => formCtas?.cancel?.onClick(getValues())}
            />
          </div>
        )}
      </div> */}
      {errorsCount > 0 && (
        <div
          role="alert"
          // className={`text-theme-error text-sm basis-full ${
          //   ctaLayout === 'progress' ? 'text-right' : ''
          // }`}
        >{`You have (${errorsCount}) error${errorsCount > 1 ? 's' : ''}`}</div>
      )}
      <input type="submit" className="hidden" />
    </form>
  )
}
