import type { ReactNode } from 'react'
import React from 'react'

interface Props {
  label: string
  isRequired: boolean
  isRow?: boolean
  className?: string
  children: ReactNode
  error?: ReactNode
}

export const Label = (props: Props) => {
  // --- PROPS ---
  const { label, isRequired, isRow, className, children, error } = props

  // --- RENDER ---
  return (
    <div className="arform__field">
      <label
        className={`arform__label ${className || ''}`}
        data-arform-row={isRow ? '' : undefined}
      >
        {isRow && children}
        <span className="arform__label-inner">
          {label}
          {isRequired && (
            <span aria-hidden="true" className="arform__label-required">
              *
            </span>
          )}
        </span>
        {!isRow && children}
      </label>
      {error}
    </div>
  )
}
