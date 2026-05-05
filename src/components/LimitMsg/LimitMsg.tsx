import type { Control } from 'react-hook-form'
import { useWatch } from 'react-hook-form'

interface Props {
  id: string
  minLength?: number
  maxLength?: number
  control?: Control
}

export const LimitMsg = (prop: Props) => {
  // --------------------- ===
  //  PROPS
  // ---------------------
  const { id, minLength, maxLength, control } = prop

  const value = useWatch({ name: id, control: control })

  // --------------------- ===
  //  RENDER
  // ---------------------
  if (!minLength && !maxLength) return null
  return (
    <div>
      {minLength && value < minLength && (
        <p className="text-xs text-theme-on-surface opacity-60 mb-1">
          {minLength && `(min ${minLength} characters)`}
        </p>
      )}
      {maxLength && (
        <p
          className={`text-xs opacity-60 ${
            value?.length > maxLength
              ? 'text-theme-error'
              : 'text-theme-on-surface'
          }`}
        >
          {`${value ? value.length : 0}/${maxLength} characters`}
        </p>
      )}
    </div>
  )
}
