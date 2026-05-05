import type { ReactElement, ReactNode } from 'react'
import { Children, cloneElement, isValidElement } from 'react'
import type { FieldValues, UseFormReturn } from 'react-hook-form'

import { Text } from '../Input/Text/Text'
import { Checkbox } from '../Input/Checkbox/Checkbox'
import { Date } from '../Input/Date/Date'
import { FileUpload } from '../Input/FileUpload/FileUpload'
import { TagInput } from '../Input/TagInput/TagInput'
import { Select } from '../Select/Select'
import { TextArea } from '../TextArea/TextArea'

interface Props {
  formProps: UseFormReturn<FieldValues, any>
  children: ReactNode
}

const inputs = [Checkbox, FileUpload, TagInput, Text, Date, Select, TextArea]

// The point of this component is to loop through ALL children and
// find the inputs. This allows us to wrap inputs in other components and elements
export const ChildrenLoop = (props: Props) => {
  const { formProps, children } = props

  const loopChildren = (_children: ReactNode): ReactNode =>
    Children.map(_children, (child: ReactNode) => {
      if (!isValidElement(child)) return child

      const name =
        // @ts-ignore - displayName can exist
        typeof child.type !== 'string' ? child.type?.displayName : undefined
      const isInput = inputs.some((input) => input.displayName === name)
      const childProps = child.props as { children?: ReactNode }

      if (isInput) {
        return cloneElement(child as ReactElement<any>, { formProps })
      }
      if (childProps.children) {
        return cloneElement(child as ReactElement<any>, {
          children: loopChildren(childProps.children),
        })
      }
      return child
    })

  return loopChildren(children)
}
