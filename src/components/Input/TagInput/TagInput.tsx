import type { InputHTMLAttributes } from 'react'
import { useCallback } from 'react'
import { useEffect, useState } from 'react'
import { useRef } from 'react'
import type { FieldValues, UseFormReturn } from 'react-hook-form'

import { Label } from '../../Label/Label'
import { Input } from '../private/Input'
import { Tag } from './Tag'
import React from 'react'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  id: string
  label: string
  className?: string
  onlySuggestions?: boolean
  suggestions?: string[]
  formProps?: UseFormReturn<FieldValues, unknown> // gets added via RHForm
}

export const tagsToArr = (val: string | undefined) => val?.split(',') || []
export const tagsArrToStr = (val: string[]) => (val.length ? val.join(',') : '')
const removeSpaces = (v: string) => v.replace(/\s/g, '')
const isDuplicate = (v1: string, v2: string) =>
  removeSpaces(v1) === removeSpaces(v2)

export const TagInput = (props: Props) => {
  // --------------------- ===
  //  PROPS
  // ---------------------
  const {
    id, // must be unique in form
    label,
    className,
    onlySuggestions = false,
    suggestions = [],
    formProps,
    required,
    defaultValue,
    ...rest
  } = props

  // const suggestions = s.map((v) => v.replace(/ /g, '_')) // replace spaces with underscores

  // Note that currentVal will be a comma separated string e.x. 'tag1,tag 2,tag$' which would create three Tags ['tag1', 'tag 2', 'tag$']
  const currentVal: string | undefined = formProps?.watch(id) // Sent to form on submit

  // --------------------- ===
  //  STATE
  // ---------------------
  const [val, setVal] = useState('') // Visible input. Clears on Tab, Enter, and Comma
  const [isFocused, setIsFocused] = useState(false)

  // --------------------- ===
  //  REFS
  // ---------------------
  const visibleInput = useRef<HTMLInputElement>(null)

  // --------------------- ===
  //  HELPERS
  // ---------------------
  const setCurrentVal = (v: string | undefined) => {
    formProps?.setValue(id, v ?? '')
  }
  const currentValToArr = useCallback(() => tagsToArr(currentVal), [currentVal])
  const addVal = (nVal: string) => {
    // Ensure val isn't a comma && Check for duplicates. If so, don't add.
    if (nVal !== ',' && !currentValToArr()?.some((v) => isDuplicate(v, nVal))) {
      const fullVal = currentVal ? `${currentVal},${nVal}` : nVal
      setCurrentVal(fullVal)
    }
    setVal('') // reset
  }

  // --------------------- ===
  //  HANDLERS
  // ---------------------
  const handleClick = () => {
    visibleInput.current?.focus()
  }

  const handleRemove = (v: string) => {
    const newArr = currentValToArr()?.filter((cv) => cv !== v)
    if (newArr) {
      setCurrentVal(tagsArrToStr(newArr))
    }
  }

  const handleAdd = (v: string) => {
    addVal(v)
  }

  // --------------------- ===
  //  EFFECTS
  // ---------------------
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.code === 'Tab' || e.code === 'Enter' || e.code === 'Comma') &&
        val
      ) {
        // Add values on Tab, Enter, and Comma
        e.stopPropagation()
        e.preventDefault()
        addVal(val)
      }

      if (e.code === 'Backspace' && !val) {
        // Remove last tag on backspace
        const arr = currentValToArr()
        if (arr?.length) {
          const last = arr[arr.length - 1]
          handleRemove(last)
        }
      }
    }
    if (isFocused) {
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [val, currentValToArr, isFocused]) // Only val, currentValToArr and isFocused

  // --------------------- ===
  //  RENDER
  // ---------------------
  return (
    <Label label={label} isRequired={!!required} className={className}>
      <Input
        // Hidden comma separated input
        {...rest}
        id={id}
        label={label}
        type="text"
        className="hidden"
        required={!!required}
        formProps={formProps}
      />
      <div
        className={`bg-theme-surface border border-gray-500 px-2 py-2 rounded overflow-hidden min-h-[3.5rem] ${
          onlySuggestions ? '' : 'cursor-text'
        }`}
        onClick={handleClick}
      >
        <span>
          {currentValToArr()?.map(
            // visible tags in input
            (v) =>
              v && (
                <span className="mx-[2px] my-[4px] inline-block" key={v}>
                  <Tag label={v} onClick={() => handleRemove(v)} />
                </span>
              )
          )}
        </span>
        {!onlySuggestions && (
          <input
            // temp visible input as user types a tag
            value={val}
            onChange={(e) => {
              setVal(e.target.value)
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="min-w-[2rem] max-w-full bg-transparent text-theme-on-surface border-none outline-none"
            style={{ width: `${val.length + 4}ch` }}
            ref={visibleInput}
          />
        )}
      </div>
      <div role="group" aria-label="suggested tags">
        {suggestions.map((s) =>
          // Only show suggestions that aren't added
          currentValToArr()?.some((v) => v === s) ? null : (
            <span className="mx-[2px] my-[4px] inline-block" key={s}>
              <Tag
                // visible suggestions under input
                label={s}
                onClick={() => {
                  handleAdd(s)
                }}
                isAdd
              />
            </span>
          )
        )}
      </div>
    </Label>
  )
}

TagInput.displayName = 'TagInput'
