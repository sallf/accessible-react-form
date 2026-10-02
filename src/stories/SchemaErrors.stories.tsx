import type { ComponentProps } from 'react'
import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { z } from 'zod'

import { ARForm } from '../components/ARForm/ARForm'
import { Text as BaseText } from '../components/Input/Text/Text'
import exampleSource from './SchemaErrors.stories.tsx?raw'

const Text = (props: ComponentProps<typeof BaseText>) => (
  <BaseText
    labelClassName="block text-sm font-medium"
    className="mt-2 block w-full rounded-lg border border-solid border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 aria-invalid:border-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
    {...props}
  />
)
const submitClasses =
  'justify-self-start cursor-pointer rounded-lg border-0 bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600'

const meta: Meta<typeof ARForm> = {
  component: ARForm,
  title: 'Examples/Validation',
  id: 'arform-schema-errors',
  args: { onSubmit: fn() },
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    tailwind: true,
    exampleShell: false,
    docs: { source: { code: exampleSource } },
  },
  decorators: [
    (Story) => (
      <section className="mx-auto my-6 max-w-lg rounded-2xl border border-solid border-slate-200 bg-white p-6 font-sans text-slate-900 shadow-sm sm:p-8 [&_*]:box-border">
        <h1 className="m-0 text-2xl font-semibold tracking-tight">
          Form validation
        </h1>
        <p className="mb-7 mt-2 text-sm leading-6 text-slate-600">
          Field feedback stays beside each input. Form-wide messages appear
          together below.
        </p>
        <div className="[&_form]:grid [&_form]:gap-5 [&_form+form]:mt-8 [&_[role=alert]]:mt-2 [&_[role=alert]]:text-sm [&_[role=alert]]:leading-6 [&_[role=alert]]:text-red-800 [&_form>[role=alert]]:m-0 [&_form>[role=alert]]:rounded-xl [&_form>[role=alert]]:border [&_form>[role=alert]]:border-solid [&_form>[role=alert]]:border-red-200 [&_form>[role=alert]]:bg-red-50 [&_form>[role=alert]]:p-4 [&_ul]:mb-0 [&_ul]:mt-2 [&_ul]:pl-5">
          <Story />
        </div>
      </section>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof ARForm>

const wholeFormSchema = z
  .object({ name: z.string() })
  .refine(({ name }) => name === 'ready', 'The whole form is not ready')

const absentPathSchema: StandardSchemaV1 = {
  '~standard': {
    version: 1,
    vendor: 'test-fixture',
    validate: () => ({ issues: [{ message: 'A pathless issue' }] }),
  },
}

export const WholeFormValidation: Story = {
  tags: ['schema-errors-scope'],
  render: ({ onSubmit }) => (
    <div>
      <ARForm validationSchema={wholeFormSchema} onSubmit={onSubmit}>
        <Text id="name" label="Name" />
        <button type="submit" className={submitClasses}>
          Check refinement
        </button>
      </ARForm>
      <ARForm validationSchema={absentPathSchema} onSubmit={onSubmit}>
        <Text id="other" label="Other" />
        <button type="submit" className={submitClasses}>
          Check absent path
        </button>
      </ARForm>
    </div>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const name = canvas.getByRole('textbox', { name: 'Name' })
    await userEvent.type(name, 'wrong')
    await userEvent.click(
      canvas.getByRole('button', { name: 'Check refinement' })
    )
    await expect(
      await canvas.findByText('The whole form is not ready')
    ).toBeVisible()
    await expect(name).toHaveAttribute('aria-invalid', 'false')
    await expect(args.onSubmit).not.toHaveBeenCalled()

    const other = canvas.getByRole('textbox', { name: 'Other' })
    await userEvent.type(other, 'value')
    await userEvent.click(
      canvas.getByRole('button', { name: 'Check absent path' })
    )
    await expect(await canvas.findByText('A pathless issue')).toBeVisible()
    await expect(other).toHaveAttribute('aria-invalid', 'false')
    await expect(args.onSubmit).not.toHaveBeenCalled()
  },
}

const mixedSchema: StandardSchemaV1 = {
  '~standard': {
    version: 1,
    vendor: 'test-fixture',
    validate: () => ({
      issues: [
        { message: 'The first form problem', path: [] },
        { message: 'Name needs attention', path: ['name'] },
        { message: 'The second form problem' },
      ],
    }),
  },
}

export const MixedSchemaErrors: Story = {
  tags: ['schema-errors-scope'],
  render: ({ onSubmit }) => (
    <ARForm validationSchema={mixedSchema} onSubmit={onSubmit}>
      <Text id="name" label="Name" />
      <Text id="root" label="Root field" />
      <button type="submit" className={submitClasses}>
        Check mixed errors
      </button>
    </ARForm>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const name = canvas.getByRole('textbox', { name: 'Name' })
    const root = canvas.getByRole('textbox', { name: 'Root field' })
    await userEvent.type(root, 'ordinary value')
    await userEvent.click(
      canvas.getByRole('button', { name: 'Check mixed errors' })
    )
    await expect(
      await canvas.findByText('The first form problem')
    ).toBeVisible()
    await expect(canvas.getByText('The second form problem')).toBeVisible()
    await expect(canvas.getByText('Name needs attention.')).toBeVisible()
    await expect(name).toHaveAccessibleDescription('Name needs attention.')
    await expect(name).toHaveAttribute('aria-invalid', 'true')
    await expect(root).toHaveAttribute('aria-invalid', 'false')
    await expect(canvas.getByText(/You have \(3\) errors/)).toBeVisible()
    await expect(args.onSubmit).not.toHaveBeenCalled()
  },
}

const asyncWholeFormSchema: StandardSchemaV1 = {
  '~standard': {
    version: 1,
    vendor: 'test-fixture',
    validate: async (value) => {
      const name = (value as { name: string }).name
      if (name !== 'ready') {
        return { issues: [{ message: 'Enter ready to continue', path: [] }] }
      }
      return { value: { name: 'READY' } }
    },
  },
}

export const AsyncWholeFormValidationRecovery: Story = {
  tags: ['schema-errors-scope', 'schema-errors-async'],
  render: ({ onSubmit }) => (
    <ARForm validationSchema={asyncWholeFormSchema} onSubmit={onSubmit}>
      <Text id="name" label="Name" />
      <button type="submit" className={submitClasses}>
        Save async
      </button>
    </ARForm>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const name = canvas.getByRole('textbox', { name: 'Name' })
    const save = canvas.getByRole('button', { name: 'Save async' })
    await userEvent.type(name, 'wrong')
    await userEvent.click(save)
    await expect(
      await canvas.findByText('Enter ready to continue')
    ).toBeVisible()
    await expect(args.onSubmit).not.toHaveBeenCalled()

    await userEvent.clear(name)
    await userEvent.type(name, 'ready')
    await userEvent.click(save)
    await expect(args.onSubmit).toHaveBeenCalledTimes(1)
    await expect(args.onSubmit).toHaveBeenCalledWith(
      { name: 'READY' },
      expect.anything()
    )
    await expect(
      canvas.queryByText('Enter ready to continue')
    ).not.toBeInTheDocument()
    await expect(canvas.queryByRole('alert')).not.toBeInTheDocument()
  },
}
