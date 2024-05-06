import type { ReactNode } from 'react'

interface Props {
  label: string
  isRequired: boolean
  className?: string
  children: ReactNode
}

export const Label = (props: Props) => {
  // --------------------- ===
  //  PROPS
  // ---------------------
  const { label, isRequired, className, children } = props

  // --------------------- ===
  //  RENDER
  // ---------------------
  return (
    <label
      className={
        className
          ? className
          : 'w-full flex flex-col gap-2 text-sm text-theme-on-surface'
      }
    >
      <span className="opacity-60">{`${label}${isRequired ? '*' : ''}`}</span>
      {children}
    </label>
  )
}
