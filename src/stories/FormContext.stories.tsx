import { Fragment, memo } from 'react'
import type { ComponentProps } from 'react'
import { useForm } from 'react-hook-form'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fireEvent, fn, userEvent, within } from 'storybook/test'
import { object, string } from 'yup'

import { ARForm } from '../components/ARForm/ARForm'
import { Text } from '../components/Input/Text/Text'
import { Date } from '../components/Input/Date/Date'
import { Checkbox } from '../components/Input/Checkbox/Checkbox'
import { Select } from '../components/Select/Select'
import { TextArea } from '../components/TextArea/TextArea'
import { FileUpload } from '../components/Input/FileUpload/FileUpload'
import { TagInput } from '../components/Input/TagInput/TagInput'

const meta: Meta<typeof ARForm> = {
  title: 'Unstyled/Form context',
  id: 'formcontext',
  component: ARForm,
  parameters: { tailwind: false },
}

export default meta
type Story = StoryObj<typeof ARForm>

const ContactText = memo(function ContactText(
  props: ComponentProps<typeof Text>
) {
  return <Text {...props} />
})
const FieldsPanel = () => (
  <Fragment>
    <Date id="date" label="Date" />
    <Checkbox id="consent" label="Consent" />
    <div>
      <Select id="country" label="Country" options={['USA', 'Canada']} />
      <TextArea id="message" label="Message" />
      <FileUpload id="attachment" label="Attachment" fileType="binary" />
      <TagInput id="topics" label="Topics" />
    </div>
  </Fragment>
)
const wrappedSubmit = fn()

export const WrappedFields: Story = {
  render: () => {
    return (
      <ARForm onSubmit={wrappedSubmit}>
        <section>
          <ContactText id="name" label="Name" />
          <FieldsPanel />
        </section>
        <button type="submit">Send</button>
      </ARForm>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    wrappedSubmit.mockClear()
    await userEvent.type(canvas.getByRole('textbox', { name: 'Name' }), 'Ada')
    fireEvent.change(canvas.getByLabelText('Date'), {
      target: { value: '2000-01-02' },
    })
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Consent' }))
    await userEvent.selectOptions(
      canvas.getByRole('combobox', { name: 'Country' }),
      'Canada'
    )
    await userEvent.type(canvas.getByRole('textbox', { name: 'Message' }), 'Hi')
    const file = new File(['hello'], 'note.txt', { type: 'text/plain' })
    await userEvent.upload(canvas.getByLabelText('Attachment'), file)
    await userEvent.type(
      canvas.getByRole('textbox', { name: 'Topics' }),
      'design{enter}'
    )
    await userEvent.click(canvas.getByRole('button', { name: 'Send' }))
    await expect(wrappedSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Ada',
        date: '2000-01-02',
        consent: true,
        country: 'Canada',
        message: 'Hi',
        topics: 'design',
      }),
      expect.anything()
    )
    const submitted = wrappedSubmit.mock.calls[0][0]
    await expect(submitted.attachment[0].name).toBe('note.txt')
  },
}

const validationSubmit = fn()
const schema = object({ name: string().required('Name is required') })

export const WrappedFieldValidation: Story = {
  render: () => (
    <ARForm validationSchema={schema} onSubmit={validationSubmit}>
      <section>
        <ContactText id="name" label="Name" />
        <ContactText
          id="readonly-message"
          label="Readonly message"
          disabled
          className="custom-input"
          style={{ borderWidth: 3 }}
        />
      </section>
      <button type="submit">Send</button>
    </ARForm>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    validationSubmit.mockClear()
    const name = canvas.getByRole('textbox', { name: 'Name' })
    await userEvent.click(canvas.getByRole('button', { name: 'Send' }))
    await expect(validationSubmit).not.toHaveBeenCalled()
    const error = await canvas.findByText(/Name is required/)
    await expect(name).toHaveAttribute('aria-describedby', error.id)
    await expect(name).toHaveAttribute('aria-invalid', 'true')
    const disabled = canvas.getByRole('textbox', { name: 'Readonly message' })
    await expect(disabled).toBeDisabled()
    await expect(disabled).toHaveClass('custom-input')
    await expect(disabled).toHaveStyle({ borderWidth: '3px' })
    await userEvent.type(name, 'Ada')
    await userEvent.click(canvas.getByRole('button', { name: 'Send' }))
    await expect(validationSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Ada' }),
      expect.anything()
    )
  },
}

const leftSubmit = fn()
const rightSubmit = fn()
export const FormContextIsolation: Story = {
  render: () => (
    <div>
      <ARForm onSubmit={leftSubmit} aria-label="Left form">
        <ContactText id="name" label="Left name" />
        <button type="submit">Send left</button>
      </ARForm>
      <ARForm onSubmit={rightSubmit} aria-label="Right form">
        <ContactText id="name" label="Right name" />
        <button type="submit">Send right</button>
      </ARForm>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    leftSubmit.mockClear()
    rightSubmit.mockClear()
    await userEvent.type(
      canvas.getByRole('textbox', { name: 'Left name' }),
      'Ada'
    )
    await userEvent.type(
      canvas.getByRole('textbox', { name: 'Right name' }),
      'Grace'
    )
    await userEvent.click(canvas.getByRole('button', { name: 'Send left' }))
    await expect(leftSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Ada' }),
      expect.anything()
    )
    await expect(rightSubmit).not.toHaveBeenCalled()
    await userEvent.click(canvas.getByRole('button', { name: 'Send right' }))
    await expect(rightSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Grace' }),
      expect.anything()
    )
  },
}

const explicitSubmit = fn()
const inheritedSubmit = fn()
const ExplicitMethods = () => {
  const explicit = useForm()
  return (
    <ARForm onSubmit={inheritedSubmit}>
      <Text id="name" label="Name" formProps={explicit} />
      <button type="button" onClick={explicit.handleSubmit(explicitSubmit)}>
        Submit explicit
      </button>
      <button type="submit">Submit inherited</button>
    </ARForm>
  )
}

export const ExplicitFormProps: Story = {
  render: () => <ExplicitMethods />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    explicitSubmit.mockClear()
    inheritedSubmit.mockClear()
    await userEvent.type(canvas.getByRole('textbox', { name: 'Name' }), 'Ada')
    await userEvent.click(
      canvas.getByRole('button', { name: 'Submit explicit' })
    )
    await expect(explicitSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Ada' }),
      expect.anything()
    )
    await userEvent.click(
      canvas.getByRole('button', { name: 'Submit inherited' })
    )
    await expect(inheritedSubmit).toHaveBeenCalledWith(
      expect.not.objectContaining({ name: 'Ada' }),
      expect.anything()
    )
  },
}
