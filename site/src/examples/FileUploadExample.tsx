import { ARForm, FileUpload } from 'accessible-react-form'
import type { FieldValues } from 'react-hook-form'

export default function FileUploadExample({
  onSubmit = () => {},
}: {
  onSubmit?: (values: FieldValues) => void
}) {
  return (
    <ARForm onSubmit={onSubmit} className="w-full max-w-md space-y-5">
      <FileUpload
        id="avatar"
        label="Avatar"
        fileType="media"
        accept="image/*"
        labelClassName="block text-sm font-medium text-slate-900 dark:text-slate-100 [&_svg]:my-2 [&_svg]:size-6 [&_img]:max-h-40"
        className="mt-2 block w-full rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-900 focus:outline-2 focus:outline-violet-500 dark:bg-white/5 dark:text-white file:mr-3 file:rounded file:bg-violet-600 file:px-3 file:py-1 file:text-white"
      />
    </ARForm>
  )
}
