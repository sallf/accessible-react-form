import type { FieldValues } from 'react-hook-form'

import type { PrimaryBtn } from '../../buttons'

export interface FormCtas {
  submit: Omit<PrimaryBtn, 'onClick'> & {
    hide?: boolean // need a submit action for "enter" keypresses, but can hide the button
    onClick: (data: FieldValues) => void
  }
  cancel?: Omit<PrimaryBtn, 'onClick'> & {
    onClick: (data: FieldValues) => void
  }
}
