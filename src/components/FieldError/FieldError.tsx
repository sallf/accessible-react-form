import type { GlobalError } from 'react-hook-form'

interface Props {
  id?: string
  error: GlobalError | undefined
}

export const FieldError = (props: Props) => {
  // --- PROPS ---
  const { id, error } = props

  // --- RENDER ---
  return error?.message ? (
    <div id={id} role="alert" className="arform__error">
      {error.message}.
    </div>
  ) : null
}
