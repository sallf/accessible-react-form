import type { GlobalError } from 'react-hook-form'

interface Props {
  id?: string
  error: GlobalError | undefined
}

export const FieldError = (props: Props) => {
  // --- PROPS ---
  const { id, error } = props

  const message = error?.message?.trim()
    ? error.message
    : error
      ? error.type === 'required'
        ? 'This field is required'
        : 'Please check this field'
      : undefined

  // --- RENDER ---
  return message ? (
    <div id={id} role="alert" className="arform__error">
      {message}.
    </div>
  ) : null
}
