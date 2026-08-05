import type { DragEvent, FormEvent, InputHTMLAttributes } from 'react'
import { useEffect, useState } from 'react'
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
  // --- PROPS ---
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

  // --- STATE ---
  const [isActive, setIsActive] = useState(false)
  const [pickedFile, setPickedFile] = useState<File | null>(null)
  // Object URL for media previews; set asynchronously once the image loads
  const [mediaPreviewUrl, setMediaPreviewUrl] = useState('')

  const defaultValue = formProps?.formState?.defaultValues?.[id] as
    | string
    | File

  // A file the user picked wins over a File default value
  const file =
    pickedFile ?? (defaultValue instanceof File ? defaultValue : null)

  // --- HANDLERS ---
  const handleDrag = (evt: DragEvent<HTMLInputElement>, isEnter: boolean) => {
    setIsActive(isEnter)
  }

  const handleChange = (evt: FormEvent<HTMLInputElement>) => {
    setPickedFile((evt.target as HTMLInputElement).files?.[0] ?? null)
    setMediaPreviewUrl('') // drop any object URL from a previous pick
  }

  // --- EFFECTS ---
  useEffect(() => {
    // Media previews need an async round-trip: create an object URL and wait
    // for the image to load before showing it
    if (!file || fileType !== 'media') return
    const img = new Image()
    img.src = URL.createObjectURL(file)
    img.onload = () => {
      setMediaPreviewUrl(img.src)
    }
  }, [file, fileType])

  // --- RENDER ---
  const previewUrl = file
    ? fileType === 'media'
      ? mediaPreviewUrl
      : file.name
    : typeof defaultValue === 'string'
      ? defaultValue
      : ''

  // TODO this has another layer of complexity. Not sure how to pass className
  return (
    <Label label={label} isRequired={!!required} className={labelClassName}>
      <div
        className="arform__upload-wrapper"
        data-arform-active={isActive ? '' : undefined}
      >
        {!disabled && (
          <svg
            viewBox="0 0 21.5 17.62"
            style={{
              width: '2rem',
              fill: 'rgb(149 155 165)',
              opacity: 0.75,
            }}
          >
            <path d="m11.28,7.22s-.02,0-.02-.02c-.06-.06-.14-.11-.22-.15,0,0,0,0,0,0,0,0-.01,0-.02,0-.08-.03-.16-.04-.24-.05-.03,0-.05,0-.08,0-.06,0-.12.02-.18.04-.03,0-.05.02-.07.03-.08.04-.16.08-.22.15l-2,2c-.29.29-.29.77,0,1.06s.77.29,1.06,0l.72-.72v4.19c0,.41.34.75.75.75s.75-.34.75-.75v-4.19l.72.72c.29.29.77.29,1.06,0s.29-.77,0-1.06l-2-2Z" />
            <path d="m16.87,5.63c-.5-2.25-1.69-3.82-3.23-4.72C12.01-.05,10.06-.21,8.3.25s-3.38,1.56-4.34,3.2c-.85,1.45-1.15,3.28-.62,5.34-4.74,1.14-4.42,8.46.87,8.84.02,0,.04,0,.05,0h11.12c1.54.01,3.02-.57,4.15-1.59,3.63-3.18,1.91-9.38-2.67-10.4Zm1.68,9.27h-.01c-.87.8-1.99,1.23-3.14,1.22H4.3c-3.74-.29-3.72-5.68,0-5.97.09,0,.18-.01.27-.04.39-.14.59-.57.45-.96-.74-2.05-.49-3.71.23-4.94.73-1.25,2-2.13,3.43-2.5,1.43-.37,2.96-.23,4.21.5,1.23.72,2.25,2.05,2.61,4.2.05.33.32.58.65.62,3.7.47,5.22,5.43,2.41,7.88Z" />
          </svg>
        )}

        {previewUrl &&
          (fileType === 'media' ? (
            <img className="arform__upload-preview" src={previewUrl} alt="" />
          ) : (
            <span className="arform__upload-preview-label">{previewUrl}</span>
          ))}
        {!disabled && (
          <>
            <span className={`arform__upload-text`}>
              Drag and drop files here <br /> or
            </span>
            <span className="arform__upload-button">
              {file ? 'Change File' : 'Choose File'}
            </span>
          </>
        )}

        {/* NOTE
        We can't manually set the value of a file input, so in the case that a
        defaultValue exists, we need to disable the required attribute.
        There's no way around this since we're using the form's onSubmit, thus
        required inputs will fail via the browser's native validation before
        it gets to yup. */}
        <Input
          id={id}
          label={label}
          className={`arform__upload ${className || ''}`}
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
    </Label>
  )
}

FileUpload.displayName = 'FileUpload'
