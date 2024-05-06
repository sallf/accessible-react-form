import type { GlobalError } from 'react-hook-form'

interface Props {
  error: GlobalError | undefined
}

export const FieldError = (props: Props) => {
  // --------------------- ===
  //  PROPS
  // ---------------------
  const { error } = props

  // --------------------- ===
  //  RENDER
  // ---------------------
  return error?.message ? (
    <div
      role="alert"
      className="text-theme-error text-sm first-letter:capitalize"
    >
      {error.message}.
    </div>
  ) : null
}
