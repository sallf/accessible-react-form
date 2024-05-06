import Upload from '@shared-images/svgr/icons/upload.svg?react'
import type { DragEvent, FormEvent, InputHTMLAttributes } from 'react'
import { useEffect, useRef, useState } from 'react'
import type { FieldValues, UseFormReturn } from 'react-hook-form'

import { Label } from '../../Label/Label'
import { Input } from '../private/Input'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  id: string
  label: string
  fileType: 'media' | 'binary'
  className?: string
  formProps?: UseFormReturn<FieldValues, unknown> // gets added via RHForm
}

export const FileUpload = (props: Props) => {
  // --------------------- ===
  //  PROPS
  // ---------------------
  const {
    id, // must be unique in form
    label,
    className,
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
  return (
    <Label label={label} isRequired={!!required} className={className}>
      <div
        className={`relative flex flex-col gap-2 border-gray-500 border-dashed rounded ${
          isActive ? '!border-solid !bg-white/20' : ''
        } ${disabled ? '' : 'border py-16 px-4 items-center content-center'}`}
      >
        {!disabled && <Upload className="w-8 fill-white/75" />}
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
