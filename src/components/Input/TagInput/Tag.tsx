import { visuallyHidden } from '../../visuallyHidden'

interface Props {
  label: string
  onClick: () => void
  isAdd?: boolean
  disabled?: boolean
}

export const Tag = ({ label, onClick, isAdd = false, disabled }: Props) => (
  <button
    type="button"
    className={isAdd ? 'arform__tag' : 'arform__tag arform__tag-remove'}
    data-arform-suggestion={isAdd ? '' : undefined}
    disabled={disabled}
    onClick={onClick}
  >
    <span style={visuallyHidden}>{isAdd ? 'Add tag ' : 'Remove tag '}</span>
    {label}
    <span aria-hidden="true">{isAdd ? ' +' : ' ×'}</span>
  </button>
)
