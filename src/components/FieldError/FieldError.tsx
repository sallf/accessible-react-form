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
    <div role="alert" className="arform__error">
      {error.message}.
    </div>
  ) : null
}
