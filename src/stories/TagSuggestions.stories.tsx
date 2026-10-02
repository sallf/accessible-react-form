import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { ARForm } from '../components/ARForm/ARForm'
import { TagInput } from '../components/Input/TagInput/TagInput'

const meta: Meta<typeof ARForm> = {
  title: 'Unstyled/Tag suggestions',
  id: 'tag-suggestions',
  component: ARForm,
  parameters: { tailwind: false, a11y: { test: 'off' } },
  tags: ['tag-suggestions-regression'],
}
export default meta
type Story = StoryObj<typeof ARForm>
const submit = fn()
const modes = ['Textbox suggestions', 'Suggestions only']
const SuggestionFields = ({
  suggestions,
  defaults,
}: {
  suggestions: string[]
  defaults?: string
}) => (
  <ARForm
    onSubmit={submit}
    defaultValues={
      defaults ? { textTopics: defaults, groupTopics: defaults } : undefined
    }
  >
    <section aria-label="Textbox suggestions">
      <TagInput
        id="textTopics"
        label="Textbox topics"
        suggestions={suggestions}
      />
    </section>
    <section aria-label="Suggestions only">
      <TagInput
        id="groupTopics"
        label="Group topics"
        onlySuggestions
        suggestions={suggestions}
      />
    </section>
    <button type="submit">Save topics</button>
  </ARForm>
)
export const PaddedSuggestions: Story = {
  render: () => <SuggestionFields suggestions={[' React ']} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    submit.mockClear()
    for (const name of modes) {
      const field = within(canvas.getByRole('region', { name }))
      await userEvent.click(
        field.getByRole('button', { name: 'Add tag React' })
      )
      await expect(
        field.getByRole('button', { name: 'Remove tag React' })
      ).toBeVisible()
      await expect(
        field.queryByRole('button', { name: 'Add tag React' })
      ).not.toBeInTheDocument()
      await userEvent.click(
        field.getByRole('button', { name: 'Remove tag React' })
      )
      await expect(
        field.getAllByRole('button', { name: 'Add tag React' })
      ).toHaveLength(1)
      await userEvent.click(
        field.getByRole('button', { name: 'Add tag React' })
      )
    }
    await userEvent.click(canvas.getByRole('button', { name: 'Save topics' }))
    await expect(submit).toHaveBeenCalledWith(
      { textTopics: 'React', groupTopics: 'React' },
      expect.anything()
    )
  },
}

const assertAddNames = async (
  field: ReturnType<typeof within>,
  names: string[]
) => {
  const buttons = field.queryAllByRole('button', { name: /^Add tag\b/ })
  await expect(buttons).toHaveLength(names.length)
  for (const [index, name] of names.entries())
    await expect(buttons[index]).toHaveAccessibleName(name)
}
export const EmptyAndDuplicateSuggestions: Story = {
  render: () => (
    <SuggestionFields
      suggestions={[
        ' Vue ',
        '',
        ' \t\n ',
        ',',
        ' , ',
        'V u e',
        'Vue',
        ' React ',
        'React',
        'react',
      ]}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    submit.mockClear()
    for (const name of modes) {
      const field = within(canvas.getByRole('region', { name }))
      await assertAddNames(field, [
        'Add tag Vue',
        'Add tag React',
        'Add tag react',
      ])
      await userEvent.click(field.getByRole('button', { name: 'Add tag Vue' }))
      await assertAddNames(field, ['Add tag React', 'Add tag react'])
      await userEvent.click(
        field.getByRole('button', { name: 'Remove tag Vue' })
      )
      await assertAddNames(field, [
        'Add tag Vue',
        'Add tag React',
        'Add tag react',
      ])
      await userEvent.click(
        field.getByRole('button', { name: 'Add tag React' })
      )
      await userEvent.click(
        field.getByRole('button', { name: 'Add tag react' })
      )
      await expect(
        field.getByRole('button', { name: 'Remove tag React' })
      ).toBeVisible()
      await expect(
        field.getByRole('button', { name: 'Remove tag react' })
      ).toBeVisible()
      await userEvent.click(field.getByRole('button', { name: 'Add tag Vue' }))
      await assertAddNames(field, [])
    }
    await userEvent.click(canvas.getByRole('button', { name: 'Save topics' }))
    await expect(submit).toHaveBeenCalledWith(
      { textTopics: 'React,react,Vue', groupTopics: 'React,react,Vue' },
      expect.anything()
    )
  },
}

export const TypedWhitespaceEquivalent: Story = {
  render: () => (
    <SuggestionFields
      suggestions={[' React ', 'R e a c t', ' Vue ']}
      defaults="R e a c t"
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    submit.mockClear()
    for (const name of modes) {
      const field = within(canvas.getByRole('region', { name }))
      await expect(
        await field.findByRole('button', { name: 'Remove tag R e a c t' })
      ).toBeVisible()
      await assertAddNames(field, ['Add tag Vue'])
      await userEvent.click(
        field.getByRole('button', { name: 'Remove tag R e a c t' })
      )
      await assertAddNames(field, ['Add tag React', 'Add tag Vue'])
    }
    const textField = within(
      canvas.getByRole('region', { name: 'Textbox suggestions' })
    )
    await userEvent.type(
      textField.getByRole('textbox', { name: 'Textbox topics' }),
      '  R e a c t  {enter}'
    )
    await expect(
      textField.getByRole('button', { name: 'Remove tag R e a c t' })
    ).toBeVisible()
    await assertAddNames(textField, ['Add tag Vue'])
    const groupField = within(
      canvas.getByRole('region', { name: 'Suggestions only' })
    )
    await userEvent.click(
      groupField.getByRole('button', { name: 'Add tag React' })
    )
    await assertAddNames(groupField, ['Add tag Vue'])
    await userEvent.click(canvas.getByRole('button', { name: 'Save topics' }))
    await expect(submit).toHaveBeenCalledWith(
      { textTopics: 'R e a c t', groupTopics: 'React' },
      expect.anything()
    )
    await userEvent.click(
      textField.getByRole('button', { name: 'Remove tag R e a c t' })
    )
    await assertAddNames(textField, ['Add tag React', 'Add tag Vue'])
  },
}
