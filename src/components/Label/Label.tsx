import type { ReactNode } from 'react'
import React from 'react'

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
    <label className={`arform__label ${className || ''}`}>
      <span>{`${label}${isRequired ? '*' : ''}`}</span>
      {children}
    </label>
  )
}
