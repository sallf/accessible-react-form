import { memo } from 'react'
import type { ComponentProps } from 'react'
import { useForm } from 'react-hook-form'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fireEvent, fn, userEvent, within } from 'storybook/test'

import { ARForm } from '../components/ARForm/ARForm'
import { Checkbox } from '../components/Input/Checkbox/Checkbox'
import { Date } from '../components/Input/Date/Date'
import { FileUpload } from '../components/Input/FileUpload/FileUpload'
import { Text } from '../components/Input/Text/Text'
import { Select } from '../components/Select/Select'
import { TextArea } from '../components/TextArea/TextArea'

const meta: Meta<typeof ARForm> = {
  title: 'Unstyled/Event handlers',
  id: 'eventhandlers',
  component: ARForm,
  parameters: { tailwind: false },
  tags: ['event-handlers-regression'],
}

export default meta
type Story = StoryObj<typeof ARForm>

const submit = fn()
const notify = fn()
const textChange = fn((event: React.ChangeEvent<HTMLInputElement>) => {
  event.preventDefault()
})
const textBlur = fn()
const dateChange = fn()
const dateBlur = fn()
const checkboxChange = fn()
const checkboxBlur = fn()
const selectChange = fn()
const selectBlur = fn()
const areaChange = fn()
const areaBlur = fn()

const WrappedText = memo(function WrappedText(
  props: ComponentProps<typeof Text>
) {
  return <Text {...props} />
})

export const ComposedFieldHandlers: Story = {
  render: () => (
    <ARForm onSubmit={submit} onChangeCallback={notify}>
      <WrappedText
        id="name"
        label="Name"
        onChange={textChange}
        onBlur={textBlur}
      />
      <Date id="date" label="Date" onChange={dateChange} onBlur={dateBlur} />
      <Checkbox
        id="consent"
        label="Consent"
        onChange={checkboxChange}
        onBlur={checkboxBlur}
      />
      <Select
        id="country"
        label="Country"
        options={['USA', 'Canada']}
        onChange={selectChange}
        onBlur={selectBlur}
      />
      <TextArea
        id="message"
        label="Message"
        onChange={areaChange}
        onBlur={areaBlur}
      />
      <button type="submit">Send</button>
    </ARForm>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    for (const callback of [
      submit,
      notify,
      textChange,
      textBlur,
      dateChange,
      dateBlur,
      checkboxChange,
      checkboxBlur,
      selectChange,
      selectBlur,
      areaChange,
      areaBlur,
    ])
      callback.mockClear()

    const name = canvas.getByRole('textbox', { name: 'Name' })
    const date = canvas.getByLabelText('Date')
    const consent = canvas.getByRole('checkbox', { name: 'Consent' })
    const country = canvas.getByRole('combobox', { name: 'Country' })
    const message = canvas.getByRole('textbox', { name: 'Message' })
    fireEvent.change(name, { target: { value: 'Ada' } })
    await expect(textChange).toHaveBeenCalledTimes(1)
    await expect(textChange.mock.calls[0][0].target).toBe(name)
    await expect(textChange.mock.calls[0][0].target.value).toBe('Ada')
    await expect(notify).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Ada' }),
      'name',
      'change',
      expect.anything()
    )
    await userEvent.click(canvas.getByRole('button', { name: 'Send' }))
    await expect(submit).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Ada' }),
      expect.anything()
    )

    fireEvent.focusOut(name)
    fireEvent.change(date, { target: { value: '2000-01-02' } })
    fireEvent.focusOut(date)
    fireEvent.click(consent)
    fireEvent.focusOut(consent)
    fireEvent.change(country, { target: { value: 'Canada' } })
    fireEvent.focusOut(country)
    fireEvent.change(message, { target: { value: 'Hello' } })
    fireEvent.focusOut(message)

    for (const [label, callback, target] of [
      ['text blur', textBlur, name],
      ['date blur', dateBlur, date],
      ['checkbox blur', checkboxBlur, consent],
      ['select blur', selectBlur, country],
      ['area blur', areaBlur, message],
    ] as const) {
      await expect(callback.mock.calls.length, label).toBe(1)
      await expect(callback.mock.calls[0][0].target).toBe(target)
    }
    for (const [label, callback] of [
      ['date change', dateChange],
      ['checkbox change', checkboxChange],
      ['select change', selectChange],
      ['area change', areaChange],
    ] as const)
      await expect(callback.mock.calls.length, label).toBe(1)
    await expect(dateChange.mock.calls[0][0].target.value).toBe('2000-01-02')
    await expect(checkboxChange.mock.calls[0][0].target.checked).toBe(true)
    await expect(selectChange.mock.calls[0][0].target.value).toBe('Canada')
    await expect(areaChange.mock.calls[0][0].target.value).toBe('Hello')
    for (const [field, value] of [
      ['date', '2000-01-02'],
      ['consent', true],
      ['country', 'Canada'],
      ['message', 'Hello'],
    ] as const) {
      await expect(notify).toHaveBeenCalledWith(
        expect.objectContaining({ [field]: value }),
        field,
        'change',
        expect.anything()
      )
    }

    await userEvent.click(canvas.getByRole('button', { name: 'Send' }))
    await expect(submit).toHaveBeenCalledTimes(2)
    await expect(submit.mock.calls[1][0]).toEqual(
      expect.objectContaining({
        name: 'Ada',
        date: '2000-01-02',
        consent: true,
        country: 'Canada',
        message: 'Hello',
      })
    )
  },
}

const touchedBlur = fn()
const TouchedForm = () => {
  const methods = useForm()
  return (
    <form>
      <Text id="name" label="Name" formProps={methods} onBlur={touchedBlur} />
      <output data-testid="touched-state">
        {methods.formState.touchedFields.name ? 'touched' : 'untouched'}
      </output>
    </form>
  )
}

export const ComposedBlurValidation: Story = {
  render: () => <TouchedForm />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    touchedBlur.mockClear()
    const name = canvas.getByRole('textbox', { name: 'Name' })
    await expect(canvas.getByTestId('touched-state')).toHaveTextContent(
      /^untouched$/
    )
    fireEvent.focusOut(name)
    await expect(touchedBlur).toHaveBeenCalledTimes(1)
    await expect(touchedBlur.mock.calls[0][0].target).toBe(name)
    await expect(canvas.getByTestId('touched-state')).toHaveTextContent(
      /^touched$/
    )
  },
}

const fileSubmit = fn()
const fileChange = fn()
const fileBlur = fn()
const fileCapture = fn()

export const ComposedFileHandlers: Story = {
  render: () => (
    <ARForm onSubmit={fileSubmit}>
      <FileUpload
        id="attachment"
        label="Attachment"
        fileType="binary"
        onChange={fileChange}
        onBlur={fileBlur}
        onChangeCapture={fileCapture}
      />
      <button type="submit">Send</button>
    </ARForm>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    for (const callback of [fileSubmit, fileChange, fileBlur, fileCapture])
      callback.mockClear()
    const input = canvas.getByLabelText('Attachment') as HTMLInputElement
    const file = new File(['hello'], 'note.txt', { type: 'text/plain' })
    await userEvent.upload(input, file)
    await expect(fileCapture.mock.calls.length, 'file capture').toBe(1)
    await expect(fileChange.mock.calls.length, 'file change').toBe(1)
    await expect(fileCapture.mock.calls[0][0].target).toBe(input)
    await expect(fileChange.mock.calls[0][0].target.files?.[0]).toBe(file)
    await expect(canvas.getByText('note.txt')).toBeInTheDocument()
    await expect(fileBlur.mock.calls.length, 'file blur').toBe(1)
    await expect(fileBlur.mock.calls[0][0].target).toBe(input)
    await userEvent.click(canvas.getByRole('button', { name: 'Send' }))
    await expect(fileSubmit.mock.calls.length, 'file submit').toBe(1)
    await expect(fileSubmit.mock.calls[0][0].attachment[0]).toBe(file)
  },
}
