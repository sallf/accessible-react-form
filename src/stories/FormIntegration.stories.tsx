import type { StandardSchemaV1 } from '@standard-schema/spec'
import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { z } from 'zod'
import { FormProvider, useForm, useFormContext } from 'react-hook-form'
import type { FieldPath } from 'react-hook-form'
import {
  ARForm,
  Checkbox,
  Date,
  FileUpload,
  Select,
  TagInput,
  Text,
  TextArea,
} from '..'

const meta: Meta<typeof ARForm> = {
  title: 'Unstyled/Form integration',
  id: 'form-integration',
  component: ARForm,
  parameters: { tailwind: false, a11y: { test: 'off' } },
  tags: ['form-integration-regression'],
}
export default meta
type Story = StoryObj<typeof ARForm>
const submit = fn()

const nestedSchema: StandardSchemaV1 = {
  '~standard': {
    version: 1,
    vendor: 'consumer-test',
    validate: (value) => {
      const name = (value as { account?: { name?: string } }).account?.name
      return name && name.length >= 3
        ? { value }
        : {
            issues: [
              {
                path: ['account', 'name'],
                message: name ? 'Name too short' : 'Enter a name',
              },
            ],
          }
    },
  },
}

export const NestedSchemaErrorsRecover: Story = {
  tags: ['nested-recovery'],
  render: () => (
    <ARForm validationSchema={nestedSchema} onSubmit={submit}>
      <p id="name-help">Use at least three characters.</p>
      <Text id="account.name" label="Name" aria-describedby="name-help" />
      <button type="submit">Save name</button>
    </ARForm>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    submit.mockClear()
    const name = canvas.getByRole('textbox', { name: 'Name' })
    await userEvent.click(canvas.getByRole('button', { name: 'Save name' }))
    await expect(await canvas.findByText('Enter a name.')).toBeVisible()
    await expect(name).toHaveAccessibleDescription(
      'Use at least three characters. Enter a name.'
    )
    await expect(canvas.getByText('You have (1) error')).toBeVisible()
    await userEvent.type(name, 'X')
    await expect(await canvas.findByText('Name too short.')).toBeVisible()
    await expect(canvas.queryByText('Enter a name.')).not.toBeInTheDocument()
    await expect(canvas.getByText('You have (1) error')).toBeVisible()
    await expect(name).toHaveAttribute('aria-invalid', 'true')
    await expect(name).toHaveAccessibleDescription(
      'Use at least three characters. Name too short.'
    )
    await expect(submit).not.toHaveBeenCalled()
    await userEvent.clear(name)
    await userEvent.type(name, 'Ada')
    await userEvent.click(canvas.getByRole('button', { name: 'Save name' }))
    await expect(submit).toHaveBeenCalledTimes(1)
    await expect(submit).toHaveBeenCalledWith(
      { account: { name: 'Ada' } },
      expect.anything()
    )
    await expect(name).toHaveAttribute('aria-invalid', 'false')
    await expect(name).toHaveAccessibleDescription(
      'Use at least three characters.'
    )
    await expect(canvas.queryByRole('alert')).not.toBeInTheDocument()
  },
}

const arraySchema = z.object({
  people: z.array(z.object({ name: z.string().min(1, 'Enter this name') })),
  profile: z.object({
    type: z.string().min(1, 'Enter a type'),
    message: z.string().min(1, 'Enter a message'),
    ref: z.string().min(1, 'Enter a reference'),
    types: z.string().min(1, 'Enter available types'),
  }),
})
const ArrayFields = () => (
  <ARForm validationSchema={arraySchema} onSubmit={submit}>
    <Text id="people.0.name" label="First person" />
    <Text id="people[1].name" label="Second person" />
    <Text id="profile.type" label="Type" />
    <Text id="profile.message" label="Message" />
    <Text id="profile.ref" label="Reference" />
    <Text id="profile.types" label="Available types" />
    <button type="submit">Save profile</button>
  </ARForm>
)
export const ArrayAndMetadataErrors: Story = {
  tags: ['array-metadata'],
  render: () => <ArrayFields />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    submit.mockClear()
    await userEvent.click(canvas.getByRole('button', { name: 'Save profile' }))
    await expect(await canvas.findByText('You have (6) errors')).toBeVisible()
    for (const [label, message] of [
      ['First person', 'Enter this name.'],
      ['Second person', 'Enter this name.'],
      ['Type', 'Enter a type.'],
      ['Message', 'Enter a message.'],
      ['Reference', 'Enter a reference.'],
      ['Available types', 'Enter available types.'],
    ]) {
      const control = canvas.getByRole('textbox', {
        name: new RegExp(`^${label}`),
      })
      await expect(control).toHaveAttribute('aria-invalid', 'true')
      await expect(control).toHaveAccessibleDescription(message)
    }
    await expect(submit).not.toHaveBeenCalled()
    await userEvent.type(
      canvas.getByRole('textbox', { name: /^First person/ }),
      'Ada'
    )
    await expect(await canvas.findByText('You have (5) errors')).toBeVisible()
    for (const label of [
      'Second person',
      'Type',
      'Message',
      'Reference',
      'Available types',
    ])
      await userEvent.type(
        canvas.getByRole('textbox', { name: new RegExp(`^${label}`) }),
        'Ready'
      )
    await userEvent.click(canvas.getByRole('button', { name: 'Save profile' }))
    await expect(submit).toHaveBeenCalledTimes(1)
    await expect(submit).toHaveBeenCalledWith(
      {
        people: [{ name: 'Ada' }, { name: 'Ready' }],
        profile: {
          type: 'Ready',
          message: 'Ready',
          ref: 'Ready',
          types: 'Ready',
        },
      },
      expect.anything()
    )
    await expect(canvas.queryByRole('alert')).not.toBeInTheDocument()
  },
}

export const NestedErrorsInitial: Story = {
  render: () => <ArrayFields />,
}
export const NestedErrorsInvalid: Story = {
  render: () => <ArrayFields />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Save profile' }))
    await expect(await canvas.findByText('You have (6) errors')).toBeVisible()
  },
}

const parentIssues: StandardSchemaV1.Issue[] = [
  { path: ['account'], message: 'Review the account' },
  { path: ['account', 'name'], message: 'Review the name' },
]
const issuesSchema = (
  issues: readonly StandardSchemaV1.Issue[]
): StandardSchemaV1 => ({
  '~standard': {
    version: 1,
    vendor: 'consumer-test',
    validate: () => ({ issues }),
  },
})
const prefixedParentIssues = (prefix: string) =>
  parentIssues.map((issue) => ({
    ...issue,
    path: [prefix, ...(issue.path ?? [])],
  }))
export const ParentAndChildSchemaErrors: Story = {
  tags: ['parent-child'],
  render: () => (
    <>
      <ARForm
        aria-label="Parent first"
        validationSchema={issuesSchema(prefixedParentIssues('forward'))}
        onSubmit={submit}
      >
        <Text id="forward.account.name" label="Parent first name" />
        <button type="submit">Check parent first</button>
      </ARForm>
      <ARForm
        aria-label="Child first"
        validationSchema={issuesSchema(
          prefixedParentIssues('reverse').reverse()
        )}
        onSubmit={submit}
      >
        <Text id="reverse.account.name" label="Child first name" />
        <button type="submit">Check child first</button>
      </ARForm>
    </>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    submit.mockClear()
    for (const name of ['Parent first', 'Child first']) {
      const form = within(canvas.getByRole('form', { name }))
      await userEvent.click(form.getByRole('button'))
      await expect(await form.findByText('Review the account')).toBeVisible()
      await expect(form.getByText('Review the name.')).toBeVisible()
      await expect(form.getByRole('textbox')).toHaveAccessibleDescription(
        'Review the name.'
      )
      await expect(form.getByText('You have (2) errors')).toBeVisible()
    }
    await expect(submit).not.toHaveBeenCalled()
  },
}

const unsafeIssues: StandardSchemaV1.Issue[] = [
  {
    path: ['account', { key: '__proto__' }, 'integrationPolluted'],
    message: 'Unsafe prototype path',
  },
  {
    path: ['constructor', 'prototype', 'integrationPolluted'],
    message: 'Unsafe constructor path',
  },
  {
    path: ['prototype', 'integrationPolluted'],
    message: 'Unsafe direct prototype path',
  },
  {
    path: ['account', 'literal.dot'],
    message: 'Unrepresentable dotted segment',
  },
  {
    path: ['account', Symbol('native-field')],
    message: 'Unrepresentable symbol segment',
  },
]
export const UnsafeSchemaPathsRemainBlocking: Story = {
  tags: ['unsafe-paths'],
  render: () => (
    <ARForm validationSchema={issuesSchema(unsafeIssues)} onSubmit={submit}>
      <Text id="account.name" label="Ordinary name" />
      <button type="submit">Check unsafe paths</button>
    </ARForm>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    submit.mockClear()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Check unsafe paths' })
    )
    for (const message of [
      'Unsafe prototype path',
      'Unsafe constructor path',
      'Unsafe direct prototype path',
      'Unrepresentable dotted segment',
      'Unrepresentable symbol segment',
    ])
      await expect(await canvas.findByText(message)).toBeVisible()
    await expect(canvas.getByText('You have (5) errors')).toBeVisible()
    await expect(
      canvas.getByRole('textbox', { name: 'Ordinary name' })
    ).toHaveAttribute('aria-invalid', 'false')
    await expect(Object.prototype).not.toHaveProperty('integrationPolluted')
    await expect(submit).not.toHaveBeenCalled()
  },
}

const pipePaths = ['|', '__pro|to__', 'constr|uctor', 'proto|type', 'a|b']
export const PipePathsRemainBlocking: Story = {
  tags: ['pipe-paths'],
  render: () => (
    <>
      {pipePaths.map((path, index) => (
        <ARForm
          key={path}
          aria-label={`Pipe case ${index + 1}`}
          validationSchema={issuesSchema([
            { path: [path], message: 'Review this pipe path' },
          ])}
          onSubmit={submit}
        >
          <Text id={`case${index}.ab`} label="Ordinary field" />
          <button type="submit">Check pipe path</button>
        </ARForm>
      ))}
    </>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    submit.mockClear()
    for (const name of [
      'Pipe case 1',
      'Pipe case 2',
      'Pipe case 3',
      'Pipe case 4',
      'Pipe case 5',
    ]) {
      const form = within(canvas.getByRole('form', { name }))
      await userEvent.click(form.getByRole('button'))
      await expect(await form.findByText('Review this pipe path')).toBeVisible()
      await expect(form.getByText('You have (1) error')).toBeVisible()
      await expect(form.getByRole('textbox')).toHaveAttribute(
        'aria-invalid',
        'false'
      )
      await expect(submit).not.toHaveBeenCalled()
    }
    await expect(Object.prototype).not.toHaveProperty('integrationPolluted')
  },
}

export const ReservedRootSchemaErrorsRemainBlocking: Story = {
  tags: ['reserved-root-paths'],
  render: () => (
    <>
      <ARForm
        aria-label="Exact root issue"
        defaultValues={{ __arform_form_errors__: 'Saved marker value' }}
        validationSchema={issuesSchema([
          { path: ['root'], message: 'Review the reserved root' },
        ])}
        onSubmit={submit}
      >
        <Text id="root" label="Root value" />
        <Text id="__arform_form_errors__" label="Existing marker value" />
        <button type="submit">Check exact root</button>
      </ARForm>
      <ARForm
        aria-label="Nested root issue"
        validationSchema={issuesSchema([
          { path: ['root', 'name'], message: 'Review the reserved root name' },
        ])}
        onSubmit={submit}
      >
        <Text id="root.name" label="Root name" />
        <button type="submit">Check nested root</button>
      </ARForm>
      <ARForm
        aria-label="Ordinary nested root"
        validationSchema={issuesSchema([
          { path: ['ordinary', 'root'], message: 'Review ordinary root' },
        ])}
        onSubmit={submit}
      >
        <Text id="ordinary.root" label="Ordinary root" />
        <button type="submit">Check ordinary root</button>
      </ARForm>
    </>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    submit.mockClear()
    for (const [name, message] of [
      ['Exact root issue', 'Review the reserved root'],
      ['Nested root issue', 'Review the reserved root name'],
    ]) {
      const form = within(canvas.getByRole('form', { name }))
      await userEvent.click(form.getByRole('button'))
      await expect(await form.findByText(message)).toBeVisible()
      await expect(form.getByText('You have (1) error')).toBeVisible()
      await expect(submit).not.toHaveBeenCalled()
    }
    await expect(
      canvas.getByRole('textbox', { name: 'Existing marker value' })
    ).toHaveValue('Saved marker value')
    const form = within(
      canvas.getByRole('form', { name: 'Ordinary nested root' })
    )
    await userEvent.click(form.getByRole('button'))
    await expect(await form.findByText('Review ordinary root.')).toBeVisible()
    await expect(
      form.getByRole('textbox', { name: /^Ordinary root/ })
    ).toHaveAccessibleDescription('Review ordinary root.')
    await expect(submit).not.toHaveBeenCalled()
  },
}

const lengthIssues = (
  prefix: string,
  index: number | string
): StandardSchemaV1.Issue[] => [
  { path: [prefix, 'entries', index, 'name'], message: 'Review this item' },
  { path: [prefix, 'entries', 'length'], message: 'Review array length' },
  { path: [prefix, 'metadata', 'length'], message: 'Review record length' },
]
export const ArrayLengthPathsRemainBlocking: Story = {
  tags: ['array-length-paths'],
  render: () => (
    <>
      {(['forwardLength', 'reverseLength'] as const).map((prefix, index) => (
        <ARForm
          key={prefix}
          aria-label={index ? 'Length first' : 'Index first'}
          validationSchema={issuesSchema(
            index
              ? lengthIssues(prefix, '0').reverse()
              : lengthIssues(prefix, 0)
          )}
          onSubmit={submit}
        >
          <Text id={`${prefix}.entries.0.name`} label="Item" />
          <Text id={`${prefix}.metadata.length`} label="Record length" />
          <button type="submit">Check array length</button>
        </ARForm>
      ))}
      <ARForm
        aria-label="Array length only"
        validationSchema={issuesSchema([
          {
            path: ['onlyLength', 'entries', 'length'],
            message: 'Review array length',
          },
        ])}
        onSubmit={submit}
      >
        <Text id="onlyLength.entries.0.name" label="Only item" />
        <button type="submit">Check length alone</button>
      </ARForm>
    </>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    submit.mockClear()
    for (const name of ['Index first', 'Length first']) {
      const form = within(canvas.getByRole('form', { name }))
      await userEvent.click(form.getByRole('button'))
      await expect(await form.findByText('Review array length')).toBeVisible()
      await expect(form.getByText('Review this item.')).toBeVisible()
      await expect(form.getByText('Review record length.')).toBeVisible()
      await expect(form.getByText('You have (3) errors')).toBeVisible()
      await expect(
        form.getByRole('textbox', { name: /^Item/ })
      ).toHaveAccessibleDescription('Review this item.')
      await expect(
        form.getByRole('textbox', { name: /^Record length/ })
      ).toHaveAccessibleDescription('Review record length.')
      await expect(submit).not.toHaveBeenCalled()
    }
    const form = within(canvas.getByRole('form', { name: 'Array length only' }))
    await userEvent.click(form.getByRole('button'))
    await expect(await form.findByText('Review array length')).toBeVisible()
    await expect(form.getByText('You have (1) error')).toBeVisible()
    await expect(submit).not.toHaveBeenCalled()
  },
}

type ExternalProfile = {
  name: string
  date: string
  consent: boolean
  attachment: FileList
  country: string
  message: string
  topics: string
  suggested: string
}
type ExternalValues = { context: ExternalProfile; explicit: ExternalProfile }
const ExternalFields = ({ mode }: { mode: 'context' | 'explicit' }) => {
  const methods = useForm<ExternalValues>()
  const formProps = mode === 'explicit' ? methods : undefined
  const helpId = `${mode}-help`
  const shared = { formProps, 'aria-describedby': helpId }
  const names: FieldPath<ExternalValues>[] = [
    `${mode}.name`,
    `${mode}.date`,
    `${mode}.consent`,
    `${mode}.attachment`,
    `${mode}.country`,
    `${mode}.message`,
    `${mode}.topics`,
    `${mode}.suggested`,
  ]
  const fields = (
    <>
      <p id={helpId}>External help.</p>
      <Text {...shared} id={`${mode}.name`} label="Name" />
      <Date {...shared} id={`${mode}.date`} label="Date" />
      <Checkbox {...shared} id={`${mode}.consent`} label="Consent" />
      <FileUpload
        {...shared}
        id={`${mode}.attachment`}
        label="Attachment"
        fileType="binary"
      />
      <Select
        {...shared}
        id={`${mode}.country`}
        label="Country"
        options={['Canada']}
      />
      <TextArea {...shared} id={`${mode}.message`} label="Message" />
      <TagInput {...shared} id={`${mode}.topics`} label="Topics" />
      <TagInput
        {...shared}
        id={`${mode}.suggested`}
        label="Suggested topics"
        onlySuggestions
        suggestions={['React']}
      />
      <button
        type="button"
        onClick={() =>
          names.forEach((name) =>
            methods.setError(name, {
              type: 'manual',
              message: 'Nested field feedback',
            })
          )
        }
      >
        Set nested errors
      </button>
      <button type="button" onClick={() => methods.clearErrors()}>
        Clear nested errors
      </button>
    </>
  )
  return mode === 'context' ? (
    <FormProvider {...methods}>
      <form aria-label="External context">{fields}</form>
    </FormProvider>
  ) : (
    <ARForm aria-label="Explicit methods" onSubmit={submit}>
      {fields}
    </ARForm>
  )
}
export const ExternalNestedErrors: Story = {
  tags: ['external-nested'],
  render: () => (
    <>
      <ExternalFields mode="context" />
      <ExternalFields mode="explicit" />
    </>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    for (const name of ['External context', 'Explicit methods']) {
      const form = within(canvas.getByRole('form', { name }))
      const controls = [
        ...[
          'Name',
          'Date',
          'Consent',
          'Attachment',
          'Country',
          'Message',
          'Topics',
        ].map((label) => form.getByLabelText(new RegExp(`^${label}`))),
        form.getByRole('group', { name: 'Suggested topics' }),
      ]
      await userEvent.click(
        form.getByRole('button', { name: 'Set nested errors' })
      )
      for (const control of controls) {
        await expect(control).toHaveAttribute('aria-invalid', 'true')
        await expect(control).toHaveAccessibleDescription(
          'External help. Nested field feedback.'
        )
      }
      await expect(form.getAllByText('Nested field feedback.')).toHaveLength(8)
      await userEvent.click(
        form.getByRole('button', { name: 'Clear nested errors' })
      )
      for (const control of controls) {
        await expect(control).not.toHaveAttribute('aria-invalid', 'true')
        await expect(control).toHaveAccessibleDescription('External help.')
      }
      await expect(form.queryByRole('alert')).not.toBeInTheDocument()
    }
  },
}

const BranchErrorActions = () => {
  const methods = useFormContext()
  const setErrors = (childFirst: boolean) => {
    methods.clearErrors()
    const errors = [
      { name: 'branch', message: 'Review the branch' },
      { name: 'branch.name', message: 'Review the child field' },
      { name: 'branch.types', message: 'Review the types child' },
    ]
    for (const error of childFirst ? errors.reverse() : errors) {
      methods.setError(error.name, { type: 'manual', message: error.message })
    }
  }
  return (
    <>
      <button type="button" onClick={() => setErrors(false)}>
        Set parent first
      </button>
      <button type="button" onClick={() => setErrors(true)}>
        Set child first
      </button>
      <button type="button" onClick={() => methods.clearErrors()}>
        Clear branch errors
      </button>
      <button
        type="button"
        onClick={() => {
          methods.clearErrors()
          methods.setError('branch', {
            type: 'manual',
            message: 'Review the branch',
            types: {
              validator: ['A criterion message'],
              type: 'A type criterion',
              message: 'A message criterion',
              ref: ['A reference criterion'],
            },
          })
        }}
      >
        Set criteria metadata
      </button>
    </>
  )
}
export const ExternalParentAndChildErrorCount: Story = {
  tags: ['external-parent-child'],
  render: () => (
    <ARForm onSubmit={submit}>
      <p id="branch-help">Branch help.</p>
      <Text
        id="branch.name"
        label="Child field"
        aria-describedby="branch-help"
      />
      <Text
        id="branch.types"
        label="Types child"
        aria-describedby="branch-help"
      />
      <Text
        id="branch.types.validator"
        label="Criterion array"
        aria-describedby="branch-help"
      />
      <BranchErrorActions />
    </ARForm>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const field = canvas.getByRole('textbox', { name: 'Child field' })
    const typesChild = canvas.getByRole('textbox', { name: 'Types child' })
    for (const name of ['Set parent first', 'Set child first']) {
      await userEvent.click(canvas.getByRole('button', { name }))
      await expect(await canvas.findByText('You have (3) errors')).toBeVisible()
      await expect(canvas.getByText('Review the child field.')).toBeVisible()
      await expect(field).toHaveAccessibleDescription(
        'Branch help. Review the child field.'
      )
      await expect(typesChild).toHaveAccessibleDescription(
        'Branch help. Review the types child.'
      )
      await userEvent.click(
        canvas.getByRole('button', { name: 'Clear branch errors' })
      )
      await expect(canvas.queryByRole('alert')).not.toBeInTheDocument()
      await expect(field).toHaveAttribute('aria-invalid', 'false')
      await expect(field).toHaveAccessibleDescription('Branch help.')
      await expect(typesChild).toHaveAttribute('aria-invalid', 'false')
      await expect(typesChild).toHaveAccessibleDescription('Branch help.')
    }
    await userEvent.click(
      canvas.getByRole('button', { name: 'Set criteria metadata' })
    )
    await expect(await canvas.findByText('You have (1) error')).toBeVisible()
    await expect(field).toHaveAttribute('aria-invalid', 'false')
    await expect(typesChild).toHaveAttribute('aria-invalid', 'false')
    await expect(
      canvas.getByRole('textbox', { name: 'Criterion array' })
    ).toHaveAttribute('aria-invalid', 'false')
    await userEvent.click(
      canvas.getByRole('button', { name: 'Clear branch errors' })
    )
    await expect(canvas.queryByRole('alert')).not.toBeInTheDocument()
  },
}

const ContainerErrorActions = () => {
  const methods = useFormContext()
  return (
    <>
      <button
        type="button"
        onClick={() =>
          methods.setError('profile.account.message', {
            type: 'manual',
            message: 'Review the message child',
          })
        }
      >
        Set container error
      </button>
      <button
        type="button"
        onClick={() => {
          methods.clearErrors()
          methods.setError('profile.account', {
            type: 'manual',
            message: 'Review the parent',
          })
          methods.setError('profile.account.message', {
            type: 'manual',
            message: 'Review the message child',
          })
        }}
      >
        Set parent and message child
      </button>
    </>
  )
}
export const ErrorContainersAreNotFieldErrors: Story = {
  tags: ['error-containers'],
  render: () => (
    <ARForm onSubmit={submit}>
      <p id="container-help">Container help.</p>
      <Text
        id="profile.account"
        label="Account parent"
        aria-describedby="container-help"
      />
      <Text id="profile.account.message" label="Message child" />
      <ContainerErrorActions />
    </ARForm>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      canvas.getByRole('button', { name: 'Set container error' })
    )
    await expect(await canvas.findByText('You have (1) error')).toBeVisible()
    await expect(
      canvas.getByRole('textbox', { name: 'Account parent' })
    ).toHaveAttribute('aria-invalid', 'false')
    await expect(
      canvas.getByRole('textbox', { name: 'Account parent' })
    ).toHaveAccessibleDescription('Container help.')
    await expect(
      canvas.getByRole('textbox', { name: /^Message child/ })
    ).toHaveAccessibleDescription('Review the message child.')
    await userEvent.click(
      canvas.getByRole('button', { name: 'Set parent and message child' })
    )
    await expect(await canvas.findByText('You have (2) errors')).toBeVisible()
    await expect(
      canvas.getByRole('textbox', { name: /^Account parent/ })
    ).toHaveAccessibleDescription('Container help. Please check this field.')
    await expect(
      canvas.getByRole('textbox', { name: /^Message child/ })
    ).toHaveAccessibleDescription('Review the message child.')
  },
}

const MetadataDescendantActions = () => {
  const methods = useFormContext()
  const setErrors = (childFirst: boolean, withCriteria = false) => {
    methods.clearErrors()
    const setParent = () =>
      methods.setError('branch', {
        type: 'manual',
        message: 'Review the branch',
        ...(withCriteria
          ? {
              types: {
                type: 'Type criterion',
                message: 'Message criterion',
                ref: ['Reference criterion'],
                validator: ['Validator criterion'],
              },
            }
          : {}),
      })
    const setChild = () =>
      methods.setError('branch.types.name', {
        type: 'manual',
        message: 'Review the descendant',
      })
    if (childFirst) {
      setChild()
      setParent()
    } else {
      setParent()
      setChild()
    }
  }
  return (
    <>
      <button type="button" onClick={() => setErrors(false)}>
        Set descendant parent first
      </button>
      <button type="button" onClick={() => setErrors(true)}>
        Set descendant child first
      </button>
      <button type="button" onClick={() => setErrors(false, true)}>
        Mix criteria and descendant
      </button>
      <button type="button" onClick={() => methods.clearErrors()}>
        Clear descendant errors
      </button>
    </>
  )
}
export const MetadataDescendantErrors: Story = {
  tags: ['metadata-descendants'],
  render: () => (
    <ARForm onSubmit={submit}>
      <p id="descendant-help">Descendant help.</p>
      <Text
        id="branch.types.name"
        label="Types descendant"
        aria-describedby="descendant-help"
      />
      <Text
        id="branch.types"
        label="Types container"
        aria-describedby="descendant-help"
      />
      <Text
        id="branch.types.validator"
        label="Criteria array"
        aria-describedby="descendant-help"
      />
      <MetadataDescendantActions />
    </ARForm>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const child = canvas.getByRole('textbox', { name: 'Types descendant' })
    const container = canvas.getByRole('textbox', { name: 'Types container' })
    const criterion = canvas.getByRole('textbox', { name: 'Criteria array' })
    for (const name of [
      'Set descendant parent first',
      'Set descendant child first',
      'Mix criteria and descendant',
    ]) {
      await userEvent.click(canvas.getByRole('button', { name }))
      await expect(await canvas.findByText('You have (2) errors')).toBeVisible()
      await expect(child).toHaveAccessibleDescription(
        'Descendant help. Review the descendant.'
      )
      await expect(container).toHaveAttribute('aria-invalid', 'false')
      await expect(container).toHaveAccessibleDescription('Descendant help.')
      await expect(criterion).toHaveAttribute('aria-invalid', 'false')
      await userEvent.click(
        canvas.getByRole('button', { name: 'Clear descendant errors' })
      )
      await expect(canvas.queryByRole('alert')).not.toBeInTheDocument()
      await expect(child).toHaveAttribute('aria-invalid', 'false')
      await expect(child).toHaveAccessibleDescription('Descendant help.')
    }
  },
}

const initialChange = fn()
const replacementChange = fn()
const CallbackForm = () => {
  const [generation, setGeneration] = useState<number | undefined>(1)
  return (
    <>
      <button type="button" onClick={() => setGeneration(2)}>
        Replace callback
      </button>
      <button type="button" onClick={() => setGeneration(undefined)}>
        Remove callback
      </button>
      <ARForm
        onSubmit={submit}
        onChangeCallback={
          generation === undefined
            ? undefined
            : (values) =>
                (generation === 1 ? initialChange : replacementChange)(
                  generation,
                  values
                )
        }
      >
        <Text id="name" label="Callback name" />
      </ARForm>
    </>
  )
}
export const UpdatedChangeCallback: Story = {
  tags: ['callback-replacement'],
  render: () => <CallbackForm />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    initialChange.mockClear()
    replacementChange.mockClear()
    const name = canvas.getByRole('textbox', { name: 'Callback name' })
    await userEvent.type(name, 'A')
    await expect(initialChange).toHaveBeenCalledTimes(1)
    await expect(initialChange).toHaveBeenCalledWith(1, { name: 'A' })
    await userEvent.click(
      canvas.getByRole('button', { name: 'Replace callback' })
    )
    await userEvent.type(name, 'B')
    await expect(replacementChange).toHaveBeenCalledTimes(1)
    await expect(replacementChange).toHaveBeenCalledWith(2, { name: 'AB' })
    await expect(initialChange).toHaveBeenCalledTimes(1)
    await userEvent.click(
      canvas.getByRole('button', { name: 'Remove callback' })
    )
    await userEvent.type(name, 'C')
    await expect(initialChange).toHaveBeenCalledTimes(1)
    await expect(replacementChange).toHaveBeenCalledTimes(1)
  },
}
