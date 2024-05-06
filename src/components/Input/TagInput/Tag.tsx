import Close from '@shared-images/svgr/icons/close-square.svg?react'
import Add from '@shared-images/svgr/icons/plus.svg?react'

interface Props {
  label: string
  onClick: () => void
  isAdd?: boolean
}

export const Tag = (props: Props) => {
  // --------------------- ===
  //  PROPS
  // ---------------------
  const { label, onClick, isAdd = false } = props

  // --------------------- ===
  //  RENDER
  // ---------------------
  return (
    <button
      type="button"
      className={`${
        isAdd
          ? 'border border-theme-primary border-opacity-60  bg-theme-surface text-theme-on-surface text-xs'
          : 'bg-theme-primary text-theme-on-primary font-semibold text-sm'
      } rounded-full inline-flex items-center gap-1 pl-2 pr-1 py-1 hover:bg-theme-primary-alt hover:text-theme-on-primary`}
      onClick={onClick}
    >
      {label}
      <span className="p-px">
        {isAdd ? <Add className="w-5" /> : <Close className="w-5" />}
        <span className="sr-only">{`${isAdd ? 'add' : 'remove'} tag`}</span>
      </span>
    </button>
  )
}
