import type { ComponentProps } from 'react'
import { useForm } from 'react-hook-form'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fireEvent, fn, userEvent, within } from 'storybook/test'
import { boolean, mixed, object, string } from 'yup'
import { ARForm } from '../components/ARForm/ARForm'
import { Text } from '../components/Input/Text/Text'
import { Date } from '../components/Input/Date/Date'
import { Checkbox } from '../components/Input/Checkbox/Checkbox'
import { FileUpload } from '../components/Input/FileUpload/FileUpload'
import { Select } from '../components/Select/Select'
import { TextArea } from '../components/TextArea/TextArea'
import { TagInput } from '../components/Input/TagInput/TagInput'

const meta: Meta<typeof ARForm> = {
  title: 'Unstyled/Accessibility attributes',
  id: 'accessibility-attributes',
  component: ARForm,
  // The shared test runner checks axe after play. Avoid concurrent addon runs.
  parameters: { tailwind: false, a11y: { test: 'off' } },
  tags: ['attribute-regression'],
}
export default meta
type Story = StoryObj<typeof ARForm>
const submit = fn()
const WrappedText = (props: ComponentProps<typeof Text>) => <Text {...props} />
const fields = ['name', 'date', 'consent', 'attachment', 'country', 'message']
const labels = ['Name', 'Date', 'Consent', 'Attachment', 'Country', 'Message']
const NativeFields = ({ help = false }: { help?: boolean }) => {
  const descriptions = help ? ' first-help\nsecond-help first-help ' : undefined
  return (
    <ARForm
      onSubmit={submit}
      validationSchema={
        help
          ? object({
              name: string().required('Enter a name'),
              date: string().required('Enter a date'),
              consent: boolean().oneOf([true], 'Give consent'),
              attachment: mixed().test(
                'file',
                'Choose a file',
                (value) => !!(value as FileList)?.length
              ),
              country: string().required('Choose a country'),
              message: string().required('Enter a message'),
            })
          : undefined
      }
    >
      <span id="consumer-name">Name</span>
      <p id="first-help">Read these instructions.</p>
      <p id="second-help">Use the requested format.</p>
      <section>
        <WrappedText
          id="name"
          label="Name"
          aria-describedby={descriptions}
          aria-label="Name"
          aria-labelledby="consumer-name"
          data-source="consumer"
        />
        <Date id="date" label="Date" aria-describedby={descriptions} />
        <Checkbox
          id="consent"
          label="Consent"
          aria-describedby={descriptions}
        />
        <FileUpload
          id="attachment"
          label="Attachment"
          fileType="binary"
          aria-describedby={descriptions}
        />
        <Select
          id="country"
          label="Country"
          options={[{ label: 'Choose', value: '' }, 'Canada']}
          aria-describedby={descriptions}
        />
        <TextArea
          id="message"
          label="Message"
          aria-describedby={descriptions}
        />
      </section>
      <button type="submit">Send</button>
    </ARForm>
  )
}
const fillNative = async (canvas: ReturnType<typeof within>) => {
  await userEvent.type(canvas.getByLabelText(/^Name/), 'Ada')
  fireEvent.change(canvas.getByLabelText(/^Date/), {
    target: { value: '2000-01-02' },
  })
  await userEvent.click(canvas.getByLabelText(/^Consent/))
  await userEvent.upload(
    canvas.getByLabelText(/^Attachment/),
    new File(['hello'], 'note.txt', { type: 'text/plain' })
  )
  await userEvent.selectOptions(canvas.getByLabelText(/^Country/), 'Canada')
  await userEvent.type(canvas.getByLabelText(/^Message/), 'Hi')
}
const explicitSubmit = fn()
const ExplicitField = () => {
  const methods = useForm()
  return (
    <section>
      <Text id="explicit-name" label="Explicit name" formProps={methods} />
      <button type="button" onClick={methods.handleSubmit(explicitSubmit)}>
        Send explicit
      </button>
    </section>
  )
}
export const NativeControlIds: Story = {
  render: () => (
    <>
      <NativeFields />
      <ExplicitField />
    </>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    submit.mockClear()
    for (const [index, field] of fields.entries()) {
      const control = canvas.getByLabelText(new RegExp(`^${labels[index]}`))
      await expect(control).toHaveAttribute('id', field)
      await expect(canvasElement.ownerDocument.getElementById(field)).toBe(
        control
      )
    }
    await expect(canvas.getByLabelText(/^Name/)).toHaveAttribute(
      'data-source',
      'consumer'
    )
    await expect(canvas.getByLabelText(/^Name/)).toHaveAttribute(
      'aria-label',
      'Name'
    )
    await expect(canvas.getByLabelText(/^Name/)).toHaveAttribute(
      'aria-labelledby',
      'consumer-name'
    )
    const explicit = canvas.getByLabelText('Explicit name')
    await expect(explicit).toHaveAttribute('id', 'explicit-name')
    explicitSubmit.mockClear()
    await userEvent.type(explicit, 'Grace')
    await userEvent.click(canvas.getByRole('button', { name: 'Send explicit' }))
    await expect(explicitSubmit).toHaveBeenCalledWith(
      { 'explicit-name': 'Grace' },
      expect.anything()
    )
    await fillNative(canvas)
    await userEvent.click(canvas.getByRole('button', { name: 'Send' }))
    await expect(submit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Ada',
        date: '2000-01-02',
        consent: true,
        country: 'Canada',
        message: 'Hi',
      }),
      expect.anything()
    )
    await expect(submit.mock.calls[0][0].attachment[0].name).toBe('note.txt')
  },
}

export const FieldHelpAndErrors: Story = {
  render: () => <NativeFields help />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    submit.mockClear()
    for (const label of labels) {
      const control = canvas.getByLabelText(new RegExp(`^${label}`))
      await expect(control).toHaveAttribute(
        'aria-describedby',
        'first-help second-help'
      )
      await expect(control).toHaveAccessibleDescription(
        'Read these instructions. Use the requested format.'
      )
    }
    await userEvent.click(canvas.getByRole('button', { name: 'Send' }))
    const messages = [
      'Enter a name',
      'Enter a date',
      'Give consent',
      'Choose a file',
      'Choose a country',
      'Enter a message',
    ]
    for (const [index, field] of fields.entries()) {
      const error = await canvas.findByText(`${messages[index]}.`)
      const control = canvas.getByLabelText(new RegExp(`^${labels[index]}`))
      await expect(control).toHaveAttribute(
        'aria-describedby',
        `first-help second-help ${field}-error`
      )
      await expect(
        canvasElement.ownerDocument.getElementById(`${field}-error`)
      ).toBe(error)
      await expect(control).toHaveAccessibleDescription(
        expect.stringContaining(messages[index])
      )
      await expect(control).toHaveAccessibleDescription(
        expect.stringContaining(
          'Read these instructions. Use the requested format.'
        )
      )
    }
    await expect(submit).not.toHaveBeenCalled()
    await fillNative(canvas)
    await userEvent.click(canvas.getByRole('button', { name: 'Send' }))
    await expect(submit).toHaveBeenCalled()
    for (const label of labels) {
      await expect(
        canvas.getByLabelText(new RegExp(`^${label}`))
      ).toHaveAttribute('aria-describedby', 'first-help second-help')
      await expect(
        canvas.getByLabelText(new RegExp(`^${label}`))
      ).toHaveAccessibleDescription(
        'Read these instructions. Use the requested format.'
      )
    }
  },
}

const tokenCases = [
  { id: 'absent', description: undefined, expected: undefined },
  { id: 'empty', description: '', expected: undefined },
  { id: 'whitespace', description: ' \t\n ', expected: undefined },
  {
    id: 'repeated',
    description: 'token-help token-help',
    expected: 'token-help',
  },
  {
    id: 'multiple',
    description: 'token-help other-help token-help',
    expected: 'token-help other-help',
  },
  {
    id: 'explicit',
    description: 'token-help explicit-error explicit-error',
    expected: 'token-help explicit-error',
  },
]
export const DescriptionTokenHandling: Story = {
  render: () => (
    <ARForm
      onSubmit={submit}
      validationSchema={object(
        Object.fromEntries(
          tokenCases.map(({ id }) => [id, string().required(`Correct ${id}`)])
        )
      )}
    >
      <p id="token-help">First guidance.</p>
      <p id="other-help">Second guidance.</p>
      {tokenCases.map(({ id, description }) => (
        <Text key={id} id={id} label={id} aria-describedby={description} />
      ))}
      <TagInput
        id="token-tags"
        label="Token tags"
        aria-describedby="token-help token-help other-help"
      />
      <button type="submit">Validate tokens</button>
    </ARForm>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    submit.mockClear()
    for (const { id, expected } of tokenCases) {
      const control = canvas.getByRole('textbox', { name: id })
      if (expected)
        await expect(control).toHaveAttribute('aria-describedby', expected)
      else await expect(control).not.toHaveAttribute('aria-describedby')
    }
    await expect(
      canvas.getByRole('textbox', { name: 'Token tags' })
    ).toHaveAttribute('aria-describedby', 'token-help other-help')
    await userEvent.click(
      canvas.getByRole('button', { name: 'Validate tokens' })
    )
    for (const { id, expected } of tokenCases) {
      const error = await canvas.findByText(`Correct ${id}.`)
      const control = canvas.getByLabelText(new RegExp(`^${id}`))
      await expect(control).toHaveAttribute(
        'aria-describedby',
        id === 'explicit'
          ? 'token-help explicit-error'
          : `${expected ? expected + ' ' : ''}${id}-error`
      )
      await expect(control).toHaveAccessibleDescription(
        expect.stringContaining(`Correct ${id}.`)
      )
      await expect(
        canvasElement.ownerDocument.getElementById(`${id}-error`)
      ).toBe(error)
      await userEvent.type(control, 'valid')
    }
    await userEvent.click(
      canvas.getByRole('button', { name: 'Validate tokens' })
    )
    await expect(submit).toHaveBeenCalled()
    for (const { id, expected } of tokenCases) {
      const control = canvas.getByRole('textbox', { name: id })
      if (expected)
        await expect(control).toHaveAttribute('aria-describedby', expected)
      else await expect(control).not.toHaveAttribute('aria-describedby')
    }
  },
}

const TagFields = () => (
  <ARForm
    onSubmit={submit}
    validationSchema={object({
      textTopics: string().required('Add a text topic'),
      groupTopics: string().required('Choose a suggested topic'),
    })}
  >
    <p id="tag-help">Choose a useful topic.</p>
    <p id="tag-format">Use short topic names.</p>
    <TagInput
      id="textTopics"
      label="Text topics"
      required
      aria-describedby="tag-help tag-format tag-help"
      data-source="text-consumer"
    />
    <TagInput
      id="groupTopics"
      label="Suggested topics"
      onlySuggestions
      required
      suggestions={['React']}
      aria-describedby="tag-help tag-format tag-help"
      data-source="group-consumer"
    />
    <button type="submit">Save topics</button>
  </ARForm>
)
export const TagInputHelpAndErrors: Story = {
  render: () => <TagFields />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    submit.mockClear()
    const text = canvas.getByRole('textbox', { name: 'Text topics' })
    const group = canvas.getByRole('group', { name: 'Suggested topics' })
    await expect(text).toHaveAttribute(
      'aria-describedby',
      'tag-help tag-format'
    )
    const required = canvas.getByText('(required)')
    await expect(group).toHaveAttribute(
      'aria-describedby',
      `tag-help tag-format ${required.id}`
    )
    await expect(text).toHaveAccessibleDescription(
      'Choose a useful topic. Use short topic names.'
    )
    await expect(group).toHaveAccessibleDescription(
      'Choose a useful topic. Use short topic names. (required)'
    )
    await expect(text).toHaveAttribute('data-source', 'text-consumer')
    await expect(group).toHaveAttribute('data-source', 'group-consumer')
    await userEvent.click(canvas.getByRole('button', { name: 'Save topics' }))
    const textError = await canvas.findByText('Add a text topic.')
    const groupError = await canvas.findByText('Choose a suggested topic.')
    await expect(text).toHaveAttribute(
      'aria-describedby',
      `tag-help tag-format ${textError.id}`
    )
    await expect(group).toHaveAttribute(
      'aria-describedby',
      `tag-help tag-format ${required.id} ${groupError.id}`
    )
    await expect(text).toHaveAccessibleDescription(
      'Choose a useful topic. Use short topic names. Add a text topic.'
    )
    await expect(group).toHaveAccessibleDescription(
      'Choose a useful topic. Use short topic names. (required) Choose a suggested topic.'
    )
    await expect(submit).not.toHaveBeenCalled()
    await userEvent.type(text, 'design{enter}')
    await userEvent.click(
      within(group).getByRole('button', { name: 'Add tag React' })
    )
    await expect(
      within(group).getByRole('button', { name: 'Remove tag React' })
    ).toBeEnabled()
    await userEvent.click(canvas.getByRole('button', { name: 'Save topics' }))
    await expect(submit).toHaveBeenCalledWith(
      { textTopics: 'design', groupTopics: 'React' },
      expect.anything()
    )
    await expect(text).toHaveAttribute(
      'aria-describedby',
      'tag-help tag-format'
    )
    await expect(group).toHaveAttribute(
      'aria-describedby',
      `tag-help tag-format ${required.id}`
    )
  },
}

// These terminal states let the shared axe runner inspect help before validation
// and alongside errors, as well as the recovered states above.
export const NativeInitialAccessibility: Story = {
  render: () => <NativeFields help />,
}
export const NativeInvalidAccessibility: Story = {
  render: () => <NativeFields help />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Send' }))
    await expect(await canvas.findByText('Enter a message.')).toBeVisible()
  },
}
export const TagInputInitialAccessibility: Story = {
  render: () => <TagFields />,
}
export const TagInputInvalidAccessibility: Story = {
  render: () => <TagFields />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Save topics' }))
    await expect(
      await canvas.findByText('Choose a suggested topic.')
    ).toBeVisible()
  },
}

export const ConsumerAccessibleNames: Story = {
  render: () => (
    <ARForm onSubmit={submit}>
      <span id="custom-group-name">Referenced group custom name</span>
      <span id="custom-text-name">Referenced tags custom name</span>
      <TagInput
        id="referencedGroup"
        label="Referenced group"
        onlySuggestions
        suggestions={['React']}
        aria-labelledby="custom-group-name"
        aria-label="Ignored group name"
      />
      <TagInput
        id="namedGroup"
        label="Named group"
        onlySuggestions
        suggestions={['React']}
        aria-label="Named group custom name"
      />
      <TagInput
        id="fallbackGroup"
        label="Fallback group"
        onlySuggestions
        suggestions={['React']}
      />
      <TagInput
        id="referencedTags"
        label="Referenced tags"
        aria-labelledby="custom-text-name"
        aria-label="Ignored tags name"
      />
      <TagInput
        id="namedTags"
        label="Named tags"
        aria-label="Named tags custom name"
      />
      <TagInput id="fallbackTags" label="Fallback tags" />
      <span id="custom-native-name">Native text custom name</span>
      <Text
        id="namedNative"
        label="Native text"
        aria-labelledby="custom-native-name"
        aria-label="Ignored native name"
      />
      <Select
        id="namedSelect"
        label="Native select"
        options={['Canada']}
        aria-label="Native select custom name"
      />
      <TextArea
        id="namedArea"
        label="Native area"
        aria-label="Native area custom name"
      />
    </ARForm>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const referencedGroup = canvas.getByRole('group', {
      name: 'Referenced group custom name',
    })
    await expect(referencedGroup).toHaveAttribute(
      'aria-labelledby',
      'custom-group-name'
    )
    await expect(referencedGroup).toHaveAttribute(
      'aria-label',
      'Ignored group name'
    )
    const namedGroup = canvas.getByRole('group', {
      name: 'Named group custom name',
    })
    await expect(namedGroup).toHaveAttribute(
      'aria-label',
      'Named group custom name'
    )
    await expect(namedGroup).not.toHaveAttribute('aria-labelledby')
    const fallbackGroup = canvas.getByRole('group', { name: 'Fallback group' })
    const fallbackLabelId = fallbackGroup.getAttribute('aria-labelledby')
    await expect(fallbackLabelId).toBeTruthy()
    await expect(
      canvasElement.ownerDocument.getElementById(fallbackLabelId!)
    ).toHaveTextContent('Fallback group')
    const referencedTags = canvas.getByRole('textbox', {
      name: 'Referenced tags custom name',
    })
    await expect(referencedTags).toHaveAttribute(
      'aria-labelledby',
      'custom-text-name'
    )
    await expect(referencedTags).toHaveAttribute(
      'aria-label',
      'Ignored tags name'
    )
    const namedTags = canvas.getByRole('textbox', {
      name: 'Named tags custom name',
    })
    await expect(namedTags).toHaveAttribute(
      'aria-label',
      'Named tags custom name'
    )
    await expect(namedTags).not.toHaveAttribute('aria-labelledby')
    await expect(
      canvas.getByRole('textbox', { name: 'Fallback tags' })
    ).toBeInTheDocument()
    await expect(
      canvas.getByRole('textbox', { name: 'Native text custom name' })
    ).toHaveAttribute('aria-labelledby', 'custom-native-name')
    await expect(
      canvas.getByRole('combobox', { name: 'Native select custom name' })
    ).toHaveAttribute('aria-label', 'Native select custom name')
    await expect(
      canvas.getByRole('textbox', { name: 'Native area custom name' })
    ).toHaveAttribute('aria-label', 'Native area custom name')
  },
}

export const BlankConsumerAccessibleNames: Story = {
  render: () => (
    <ARForm onSubmit={submit}>
      <span id="blank-reference-name">Referenced blank label custom name</span>
      <TagInput
        id="emptyReference"
        label="Empty reference"
        onlySuggestions
        suggestions={['React']}
        aria-labelledby=""
      />
      <TagInput
        id="whitespaceReference"
        label="Whitespace reference"
        onlySuggestions
        suggestions={['React']}
        aria-labelledby={' \t\n '}
      />
      <TagInput
        id="emptyLabel"
        label="Empty label"
        onlySuggestions
        suggestions={['React']}
        aria-label=""
      />
      <TagInput
        id="whitespaceLabel"
        label="Whitespace label"
        onlySuggestions
        suggestions={['React']}
        aria-label={' \t\n '}
      />
      <TagInput
        id="spacesOnly"
        label="Spaces only"
        onlySuggestions
        suggestions={['React']}
        aria-labelledby="   "
        aria-label="   "
      />
      <TagInput
        id="bothBlank"
        label="Both blank"
        onlySuggestions
        suggestions={['React']}
        aria-labelledby={' \t '}
        aria-label=""
      />
      <TagInput
        id="blankReferenceNamed"
        label="Blank reference named"
        onlySuggestions
        suggestions={['React']}
        aria-labelledby={' \n '}
        aria-label=" Blank reference named custom name "
      />
      <TagInput
        id="referenceBlankLabel"
        label="Referenced blank label"
        onlySuggestions
        suggestions={['React']}
        aria-labelledby=" blank-reference-name "
        aria-label={' \t '}
      />
      <TagInput
        id="absentName"
        label="Absent name"
        onlySuggestions
        suggestions={['React']}
      />
    </ARForm>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    for (const name of [
      'Empty reference',
      'Whitespace reference',
      'Empty label',
      'Whitespace label',
      'Both blank',
      'Spaces only',
      'Absent name',
    ]) {
      const group = canvas.getByRole('group', { name })
      const labelId = group.getAttribute('aria-labelledby')
      await expect(labelId).toBeTruthy()
      await expect(
        canvasElement.ownerDocument.getElementById(labelId!)
      ).toHaveTextContent(name)
    }
    const named = canvas.getByRole('group', {
      name: 'Blank reference named custom name',
    })
    await expect(named).toHaveAttribute(
      'aria-label',
      ' Blank reference named custom name '
    )
    await expect(named).not.toHaveAttribute('aria-labelledby')
    await expect(
      canvas.getByRole('group', { name: 'Referenced blank label custom name' })
    ).toHaveAttribute('aria-labelledby', ' blank-reference-name ')
  },
}
