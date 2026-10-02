import { describedBy } from '../../describedBy'
import type {
  HTMLAttributes,
  InputHTMLAttributes,
  KeyboardEvent,
  ReactElement,
} from 'react'
import { useId, useState } from 'react'
import type { FieldFormMethods } from '../../../hooks/formContext'

import { FieldError } from '../../FieldError/FieldError'
import { getFieldError } from '../../fieldErrors'
import { Tag } from './Tag'
import { useFieldForm } from '../../../hooks/formContext'

interface CommonProps {
  id: string
  label: string
  suggestions?: string[]
  formProps?: FieldFormMethods
  required?: boolean
  disabled?: boolean
}

type TextProps = CommonProps &
  InputHTMLAttributes<HTMLInputElement> & { onlySuggestions?: false }

type SuggestionsProps = CommonProps &
  HTMLAttributes<HTMLDivElement> & { onlySuggestions: true; type?: never }

type DynamicProps = CommonProps &
  InputHTMLAttributes<HTMLInputElement | HTMLDivElement> & {
    onlySuggestions: boolean
  }

type Props = TextProps | SuggestionsProps | DynamicProps

const textAttributes = (props: TextProps | DynamicProps) => {
  const {
    id: _id,
    label: _label,
    onlySuggestions: _onlySuggestions,
    suggestions: _suggestions,
    formProps: _formProps,
    required: _required,
    disabled: _disabled,
    defaultValue: _defaultValue,
    type: _type,
    className: _className,
    style: _style,
    ...attributes
  } = props
  return attributes
}

const groupAttributes = (props: SuggestionsProps | DynamicProps) => {
  const {
    id: _id,
    label: _label,
    onlySuggestions: _onlySuggestions,
    suggestions: _suggestions,
    formProps: _formProps,
    required: _required,
    disabled: _disabled,
    defaultValue: _defaultValue,
    type: _type,
    className: _className,
    style: _style,
    ...attributes
  } = props
  return attributes
}

export const tagsToArr = (val: string | undefined) => val?.split(',') || []
export const tagsArrToStr = (val: string[]) => (val.length ? val.join(',') : '')
const removeSpaces = (v: string) => v.replace(/\s/g, '')
const isDuplicate = (v1: string, v2: string) =>
  removeSpaces(v1) === removeSpaces(v2)

export function TagInput(props: SuggestionsProps): ReactElement | null
export function TagInput(props: TextProps): ReactElement | null
export function TagInput(props: DynamicProps): ReactElement | null
export function TagInput(props: Props): ReactElement | null
export function TagInput(props: Props) {
  const {
    id,
    label,
    className = '',
    style,
    onlySuggestions = false,
    suggestions = [],
    formProps: explicitFormProps,
    required,
    disabled: explicitlyDisabled,
  } = props
  const formProps = useFieldForm(explicitFormProps)
  const disabled = explicitlyDisabled || formProps?.formState.disabled
  const inputAttributes = props.onlySuggestions
    ? undefined
    : textAttributes(props)
  const suggestionAttributes = props.onlySuggestions
    ? groupAttributes(props)
    : undefined

  const domId = useId()
  const labelId = `${domId}-label`
  const controlId = `${domId}-control`
  const errorId = `${domId}-error`
  const requiredId = `${domId}-required`
  const currentVal = (formProps?.watch(id) as string | undefined) ?? ''
  const tags = tagsToArr(currentVal).filter(Boolean)
  const [entry, setEntry] = useState('')
  const error = formProps && getFieldError(formProps.formState.errors, id)
  const hasError = !!error

  if (!formProps?.register) return null

  const setTags = (next: string[]) => {
    if (disabled) return
    formProps.setValue(id, tagsArrToStr(next), {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    })
  }

  const addTag = (value: string) => {
    const next = value.trim()
    if (
      !disabled &&
      next &&
      next !== ',' &&
      !tags.some((tag) => isDuplicate(tag, next))
    ) {
      setTags([...tags, next])
    }
    setEntry('')
  }

  const removeTag = (value: string) =>
    setTags(tags.filter((tag) => tag !== value))

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      addTag(entry)
    } else if ((event.key === 'Tab' || event.key === ',') && entry) {
      if (event.key === ',') event.preventDefault()
      addTag(entry)
    } else if (event.key === 'Backspace' && !entry && tags.length) {
      removeTag(tags[tags.length - 1])
    }
    inputAttributes?.onKeyDown?.(event)
  }

  const tagList = tags.length > 0 && (
    <span className="arform__tag-list">
      {tags.map((tag) => (
        <Tag
          key={tag}
          label={tag}
          disabled={disabled}
          onClick={() => removeTag(tag)}
        />
      ))}
    </span>
  )

  const availableSuggestions = suggestions.filter(
    (suggestion) => !tags.includes(suggestion)
  )
  const suggestionList = (
    <span className="arform__tag-suggestions">
      {availableSuggestions.map((suggestion) => (
        <Tag
          key={suggestion}
          label={suggestion}
          isAdd
          disabled={disabled}
          onClick={() => addTag(suggestion)}
        />
      ))}
    </span>
  )

  return (
    <div
      {...suggestionAttributes}
      className={`arform__field arform__tag-input ${onlySuggestions ? className : ''}`}
      style={onlySuggestions ? style : undefined}
      role={onlySuggestions ? 'group' : undefined}
      aria-labelledby={
        onlySuggestions
          ? props['aria-labelledby']?.trim()
            ? props['aria-labelledby']
            : props['aria-label']?.trim()
              ? undefined
              : labelId
          : undefined
      }
      aria-invalid={onlySuggestions && hasError ? true : undefined}
      aria-describedby={
        onlySuggestions
          ? describedBy(
              props['aria-describedby'],
              required ? requiredId : undefined,
              hasError ? errorId : undefined
            )
          : undefined
      }
      data-arform-disabled={disabled ? '' : undefined}
      data-arform-invalid={hasError ? '' : undefined}
    >
      {onlySuggestions ? (
        <span className="arform__label">
          <span id={labelId} className="arform__label-inner">
            {label}
          </span>
          {required && (
            <span id={requiredId} className="arform__label-required">
              {' '}
              (required)
            </span>
          )}
        </span>
      ) : (
        <label id={labelId} htmlFor={controlId} className="arform__label">
          <span className="arform__label-inner">
            {label}
            {required && (
              <span className="arform__label-required" aria-hidden="true">
                {' '}
                *
              </span>
            )}
          </span>
        </label>
      )}
      <input
        type="hidden"
        {...formProps.register(id, { required, disabled })}
      />
      {onlySuggestions ? (
        <>
          {tagList}
          {suggestionList}
        </>
      ) : (
        <>
          {tagList}
          <input
            {...inputAttributes}
            id={controlId}
            type="text"
            value={entry}
            onChange={(event) => {
              setEntry(event.target.value)
              inputAttributes?.onChange?.(event)
            }}
            onKeyDown={handleKeyDown}
            aria-required={required ? true : undefined}
            aria-invalid={hasError ? true : false}
            aria-describedby={describedBy(
              props['aria-describedby'],
              hasError ? errorId : undefined
            )}
            disabled={disabled}
            className={`arform__input arform__tag-input-control ${className}`}
            style={style}
          />
          {suggestionList}
        </>
      )}
      <FieldError id={errorId} error={error} />
    </div>
  )
}
