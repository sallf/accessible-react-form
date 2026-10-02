import type { ChangeEvent, ComponentProps } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import {
  Checkbox,
  Date,
  FileUpload,
  Select,
  TagInput,
  Text,
  TextArea,
} from 'accessible-react-form'

type Values = {
  profile: {
    name: string
    birthDate: string
    country: string
    message: string
    consent: boolean
    attachment: FileList | string
    topics: string
    suggested: string
  }
}
type Context = { scope: string }
type Output = { displayName: string }
const ReusableText = (props: ComponentProps<typeof Text>) => <Text {...props} />

export const TypedExternalMethods = () => {
  const methods = useForm<Values, Context, Output>({
    context: { scope: 'contact' },
    resolver: (values) => ({
      values: { displayName: values.profile.name },
      errors: {},
    }),
  })
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit((output) => output.displayName)}>
        <Text id="profile.name" label="Name" formProps={methods} />
        <ReusableText
          id="profile.name"
          label="Wrapped name"
          formProps={methods}
        />
        <Date id="profile.birthDate" label="Date" formProps={methods} />
        <Checkbox id="profile.consent" label="Consent" formProps={methods} />
        <Select
          id="profile.country"
          label="Country"
          options={['Canada']}
          formProps={methods}
        />
        <TextArea id="profile.message" label="Message" formProps={methods} />
        <FileUpload
          id="profile.attachment"
          label="File"
          fileType="binary"
          formProps={methods}
        />
        <TagInput id="profile.topics" label="Topics" formProps={methods} />
        <TagInput
          id="profile.suggested"
          label="Suggested"
          onlySuggestions
          formProps={methods}
        />
      </form>
    </FormProvider>
  )
}

export const NativePropChecks = () => {
  const textareaChange = (_event: ChangeEvent<HTMLTextAreaElement>) => undefined
  // @ts-expect-error Text forwards input attributes, which do not include rows.
  const wrongInput = <Text id="name" label="Name" rows={4} />
  // @ts-expect-error A textarea change event cannot handle an input change.
  const wrongEvent = <Text id="e" label="E" onChange={textareaChange} />
  // @ts-expect-error Select requires options.
  const missingOptions = <Select id="country" label="Country" />
  // @ts-expect-error FileUpload retains its media/binary discriminant.
  const wrongFileType = <FileUpload id="file" label="File" fileType="text" />
  // @ts-expect-error TagInput does not accept link attributes.
  const wrongTagProps = <TagInput id="topics" label="Topics" href="/topics" />
  return (
    <>
      {wrongInput}
      {wrongEvent}
      {missingOptions}
      {wrongFileType}
      {wrongTagProps}
    </>
  )
}
