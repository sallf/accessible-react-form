import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ComponentProps } from 'react'
import { expect, fn, userEvent, within } from 'storybook/test'
import { object, string } from 'yup'

import { ARForm } from '../components/ARForm/ARForm'
import { TagInput } from '../components/Input/TagInput/TagInput'

const meta: Meta<typeof ARForm> = {
  title: 'TagInput/Props',
  component: ARForm,
  args: { onSubmit: fn() },
}

export default meta
type Story = StoryObj<typeof ARForm>

const onGroupClick = fn()
const onGroupKeyDown = fn()

export const SuggestionsGroupProps: Story = {
  tags: ['tag-props-regression'],
  render: ({ onSubmit }) => (
    <ARForm
      onSubmit={onSubmit}
      validationSchema={object({
        topics: string().required('Choose a topic.'),
      })}
    >
      <p id="topics-help">Choose from the suggested topics.</p>
      <TagInput
        id="topics"
        label="Topics"
        onlySuggestions
        required
        suggestions={['React']}
        title="Topic choices"
        data-testid="topics-group"
        aria-describedby="topics-help"
        onClick={(event) => {
          const group: HTMLDivElement = event.currentTarget
          onGroupClick(group)
        }}
        onKeyDown={(event) => {
          const group: HTMLDivElement = event.currentTarget
          onGroupKeyDown(group)
        }}
      />
      <button type="submit">Save</button>
    </ARForm>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const group = canvas.getByRole('group', { name: 'Topics' })
    await expect(group).toHaveAttribute('title', 'Topic choices')
    await expect(group).toHaveAttribute('data-testid', 'topics-group')
    await expect(group).toHaveAccessibleDescription(
      expect.stringContaining('Choose from the suggested topics.')
    )

    await userEvent.click(canvas.getByRole('button', { name: 'Save' }))
    await expect(await canvas.findByText(/Choose a topic/)).toBeVisible()
    await expect(group).toHaveAccessibleDescription(
      expect.stringContaining('Choose a topic')
    )

    const add = within(group).getByRole('button', { name: 'Add tag React' })
    add.focus()
    await userEvent.keyboard('{ArrowDown}')
    await userEvent.click(add)
    await expect(onGroupKeyDown).toHaveBeenCalled()
    await expect(onGroupClick).toHaveBeenCalled()
    await expect(
      within(group).getByRole('button', { name: 'Remove tag React' })
    ).toBeEnabled()
  },
}

const runtimeSuggestionMode: boolean = Boolean(1)
const ordinaryTagInputProps: ComponentProps<typeof TagInput> = {
  id: 'freeTopics',
  label: 'Free topics',
}

export const RuntimeBooleanMode: Story = {
  tags: ['tag-props-regression'],
  render: ({ onSubmit }) => (
    <ARForm onSubmit={onSubmit}>
      <TagInput {...ordinaryTagInputProps} />
      <TagInput
        id="runtimeTopics"
        label="Runtime topics"
        onlySuggestions={runtimeSuggestionMode}
        suggestions={['React']}
        onClick={(event) => {
          const target: HTMLInputElement | HTMLDivElement = event.currentTarget
          expect(target.tagName).toBe('DIV')
        }}
      />
    </ARForm>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('textbox', { name: 'Free topics' })
    ).toBeInTheDocument()
    const group = within(canvasElement).getByRole('group', {
      name: 'Runtime topics',
    })
    await userEvent.click(
      within(group).getByRole('button', { name: 'Add tag React' })
    )
    await expect(
      within(group).getByRole('button', { name: 'Remove tag React' })
    ).toBeEnabled()
  },
}
