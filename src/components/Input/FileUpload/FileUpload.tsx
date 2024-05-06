import type { DragEvent, FormEvent, InputHTMLAttributes } from 'react'
import { useEffect, useRef, useState } from 'react'
import type { FieldValues, UseFormReturn } from 'react-hook-form'

import { Label } from '../../Label/Label'
import { Input } from '../private/Input'
import React from 'react'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  id: string
  label: string
  labelClassName?: string
  fileType: 'media' | 'binary'
  formProps?: UseFormReturn<FieldValues, unknown> // gets added via RHForm
}

export const FileUpload = (props: Props) => {
  // --------------------- ===
  //  PROPS
  // ---------------------
  const {
    id, // must be unique in form
    label,
    labelClassName,
    className = '',
    fileType = 'binary',
    formProps,
    required,
    disabled,
    ...rest
  } = props

  // --------------------- ===
  //  STATE
  // ---------------------
  const [isActive, setIsActive] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')

  // --------------------- ===
  //  REFS
  // ---------------------
  const inputRefWrapper = useRef<HTMLInputElement>(null)

  // --------------------- ===
  //  HANDLERS
  // ---------------------
  const handleDrag = (evt: DragEvent<HTMLInputElement>, isEnter: boolean) => {
    setIsActive(isEnter)
  }

  const handleChange = (evt: FormEvent<HTMLInputElement>) => {
    const files = (evt.target as HTMLInputElement).files
    if (files) {
      setFile(files[0])
    }
  }

  // --------------------- ===
  //  EFFECTS
  // ---------------------
  const defaultValue = formProps?.formState?.defaultValues?.[id] as
    | string
    | File
  useEffect(() => {
    if (defaultValue instanceof File) {
      setFile(defaultValue)
      return
    }
    if (defaultValue) {
      setPreviewUrl(defaultValue)
    }
  }, [defaultValue])

  useEffect(() => {
    // If file, see if it's an image file and if so, set it as the preview.
    // Otherwise make the preview url be the file name.
    if (!file) return
    if (fileType === 'media') {
      const img = new Image()
      img.src = URL.createObjectURL(file)
      img.onload = () => {
        setPreviewUrl(img.src)
      }
    } else {
      setPreviewUrl(file.name)
    }
  }, [file, fileType])

  useEffect(() => {
    // If file is removed, remove the preview & clear the input
    if (file) return
    setPreviewUrl('')
    if (!inputRefWrapper.current) return
    const input = Array.from(inputRefWrapper.current.children).find(
      (el) => el.tagName === 'INPUT'
    ) as HTMLInputElement | undefined
    if (input && input.value) {
      input.value = ''
    }
  }, [file])

  // --------------------- ===
  //  RENDER
  // ---------------------
  // TODO this has another layer of complexity. Not sure how to pass className
  return (
    <Label label={label} isRequired={!!required} className={labelClassName}>
      <div
        className={`arform__upload ${
          isActive ? 'arform__upload--is-active' : ''
        } ${className}`}
      >
        {!disabled && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 21.5 17.62"
            style={{
              width: '2rem',
              fill: 'white',
              opacity: 0.75,
            }}
          >
            <path d="m11.28,7.22s-.02,0-.02-.02c-.06-.06-.14-.11-.22-.15,0,0,0,0,0,0,0,0-.01,0-.02,0-.08-.03-.16-.04-.24-.05-.03,0-.05,0-.08,0-.06,0-.12.02-.18.04-.03,0-.05.02-.07.03-.08.04-.16.08-.22.15l-2,2c-.29.29-.29.77,0,1.06s.77.29,1.06,0l.72-.72v4.19c0,.41.34.75.75.75s.75-.34.75-.75v-4.19l.72.72c.29.29.77.29,1.06,0s.29-.77,0-1.06l-2-2Z" />
            <path d="m16.87,5.63c-.5-2.25-1.69-3.82-3.23-4.72C12.01-.05,10.06-.21,8.3.25s-3.38,1.56-4.34,3.2c-.85,1.45-1.15,3.28-.62,5.34-4.74,1.14-4.42,8.46.87,8.84.02,0,.04,0,.05,0h11.12c1.54.01,3.02-.57,4.15-1.59,3.63-3.18,1.91-9.38-2.67-10.4Zm1.68,9.27h-.01c-.87.8-1.99,1.23-3.14,1.22H4.3c-3.74-.29-3.72-5.68,0-5.97.09,0,.18-.01.27-.04.39-.14.59-.57.45-.96-.74-2.05-.49-3.71.23-4.94.73-1.25,2-2.13,3.43-2.5,1.43-.37,2.96-.23,4.21.5,1.23.72,2.25,2.05,2.61,4.2.05.33.32.58.65.62,3.7.47,5.22,5.43,2.41,7.88Z" />
          </svg>
        )}
        <span className={`${file ? 'text-sm' : 'text-xs'} text-center`}>
          {previewUrl && (
            <div className="my-2">
              {fileType === 'media' ? (
                <img
                  className="max-h-[14rem] w-auto inline"
                  src={previewUrl}
                  alt=""
                />
              ) : (
                <span className="font-bold text-lg">{previewUrl}</span>
              )}
            </div>
          )}
          {!disabled && 'Drag and drop files here'}
        </span>
        {!disabled && (
          <>
            <span className="text-sm">or</span>
            <span className="bg-white/5 py-2 px-4 border border-white/20 rounded text-xs uppercase hover:bg-white/20 hover:border-white/60">
              {file ? 'Change File' : 'Choose File'}
            </span>
          </>
        )}
        <div ref={inputRefWrapper}>
          {/* NOTE
          We can't manually set the value of a file input, so in the case that a
          defaultValue exists, we need to disable the required attribute.
          There's no way around this since we're using the form's onSubmit, thus
          required inputs will fail via the browser's native validation before
          it gets to yup. */}
          <Input
            id={id}
            label={label}
            className={`absolute inset-0 opacity-0 ${
              disabled ? '' : 'cursor-pointer'
            }`}
            type="file"
            required={!!required && !defaultValue}
            disabled={disabled}
            formProps={formProps}
            onDragEnter={(evt) => {
              handleDrag(evt, true)
            }}
            onDragLeave={(evt) => {
              handleDrag(evt, false)
            }}
            onDrop={(evt) => {
              handleDrag(evt, false)
            }}
            onChangeCapture={handleChange}
            {...rest}
          />
        </div>
      </div>
    </Label>
  )
}
