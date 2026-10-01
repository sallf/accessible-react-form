import { ARForm, TagInput } from 'accessible-react-form'
import { object, string } from 'yup'

const schema = object({ tags: string() })

export default function Example() {
  return (
    <ARForm
      className="space-y-4 [&_[role=alert]]:mt-1 [&_[role=alert]]:text-sm [&_[role=alert]]:text-red-600 dark:[&_[role=alert]]:text-red-400 [&>div]:flex [&>div]:min-w-0 [&>div]:flex-col [&>div]:gap-2 [&>div>label]:text-sm [&>div>label]:font-medium [&>div>label]:text-slate-900 dark:[&>div>label]:text-slate-100 [&>div>span]:flex [&>div>span]:flex-wrap [&>div>span]:gap-1.5 [&>div>span>button]:rounded-full [&>div>span>button]:border [&>div>span>button]:border-violet-400 [&>div>span>button]:bg-violet-50 [&>div>span>button]:px-2.5 [&>div>span>button]:py-1 [&>div>span>button]:text-xs [&>div>span>button]:text-violet-800 dark:[&>div>span>button]:bg-violet-950 dark:[&>div>span>button]:text-violet-200"
      validationSchema={schema}
      onSubmit={() => {}}
    >
      <TagInput
        id="tags"
        label="Tags"
        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-violet-400"
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
