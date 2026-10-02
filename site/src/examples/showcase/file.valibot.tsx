import { ARForm, FileUpload } from 'accessible-react-form'
import * as v from 'valibot'

const schema = v.object({ file: v.optional(v.instance(FileList)) })

export default function Example() {
  return (
    <ARForm
      className="space-y-4 [&_[role=alert]]:mt-1 [&_[role=alert]]:text-sm [&_[role=alert]]:text-red-600 dark:[&_[role=alert]]:text-red-400"
      validationSchema={schema}
      onSubmit={() => {}}
    >
      <FileUpload
        id="file"
        label="Upload a file"
        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-violet-400 file:mr-3 file:rounded file:border-0 file:bg-violet-100 file:px-2 file:py-1 file:text-violet-800 dark:file:bg-violet-900 dark:file:text-violet-100"
        labelClassName="flex flex-col gap-1.5 text-sm font-medium text-slate-900 dark:text-slate-100 [&_[aria-hidden=true]]:text-violet-600 dark:[&_[aria-hidden=true]]:text-violet-400 [&>div]:flex [&>div]:flex-col [&>div]:items-start [&>div]:gap-2 [&>div>svg]:h-6 [&>div>svg]:w-6 [&>div>svg]:text-slate-500 dark:[&>div>svg]:text-slate-400 [&>div>img]:max-h-32 [&>div>img]:max-w-full [&>div>img]:object-contain"
        fileType="media"
      />
      <button
        type="submit"
        className="rounded-md bg-violet-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-violet-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
      >
        Validate
      </button>
    </ARForm>
  )
}
