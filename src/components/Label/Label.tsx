import type { ReactNode } from 'react'
import React from 'react'

interface Props {
  label: string
  isRequired: boolean
  isRow?: boolean
  className?: string
  children: ReactNode
}

export const Label = (props: Props) => {
  // --- PROPS ---
  const { label, isRequired, isRow, className, children } = props

  // --- RENDER ---
  return (
    <label
      className={`arform__label ${className || ''}`}
      data-arform-row={isRow ? '' : undefined}
    >
      <div className="arform__label-inner">
        {label}
        {isRequired && (
          <span aria-hidden="true" className="arform__label-required">
            *
          </span>
        )}
      </div>
      {children}
    </label>
  )
}
