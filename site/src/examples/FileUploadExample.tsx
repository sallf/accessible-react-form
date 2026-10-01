import { useState } from 'react'
import { ARForm, FileUpload } from 'accessible-react-form'
import type { FieldValues } from 'react-hook-form'

export default function FileUploadExample({
  onSubmit = () => {},
}: {
  onSubmit?: (values: FieldValues) => void
}) {
  const [filename, setFilename] = useState('')

  return (
    <ARForm onSubmit={onSubmit} className="w-full max-w-md space-y-5">
      <div className="relative">
        <FileUpload
          id="avatar"
          label="Avatar"
          fileType="media"
          accept="image/*"
          onChange={(event) =>
            setFilename(event.currentTarget.files?.[0]?.name ?? '')
          }
          labelClassName="block text-sm font-medium text-slate-900 dark:text-slate-100 [&>div]:relative [&>div]:mt-2 [&>div]:flex [&>div]:min-h-52 [&>div]:flex-col [&>div]:items-center [&>div]:justify-center [&>div]:rounded-xl [&>div]:border-2 [&>div]:border-dashed [&>div]:border-slate-300 [&>div]:bg-slate-50 [&>div]:px-6 [&>div]:pb-24 [&>div]:pt-8 [&>div:hover]:border-violet-500 [&>div:focus-within]:outline-2 [&>div:focus-within]:outline-offset-2 [&>div:focus-within]:outline-violet-600 [&>div[data-arform-active]]:border-violet-600 [&>div[data-arform-active]]:bg-violet-50 dark:[&>div]:border-slate-600 dark:[&>div]:bg-slate-900 dark:[&>div[data-arform-active]]:bg-violet-950 [&_svg]:size-9 [&_svg]:text-slate-400 [&_img]:max-h-24 [&_img]:rounded [&>div:has(img)>svg]:hidden"
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
        <div className="pointer-events-none absolute inset-x-4 bottom-7 text-center text-sm">
          <p className="m-0 break-words text-slate-600 dark:text-slate-300">
            {filename || (
              <>
                <span className="font-semibold text-violet-700 dark:text-violet-300">
                  Choose an image
                </span>{' '}
                or drag it here
              </>
            )}
          </p>
          <p className="mb-0 mt-1 text-xs text-slate-500 dark:text-slate-400">
            {filename ? 'Choose another image to replace it' : 'Image files'}
          </p>
        </div>
      </div>
    </ARForm>
  )
}
