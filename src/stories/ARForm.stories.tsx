import type { Meta, StoryObj } from '@storybook/react-vite'
import { ARForm } from '../components/ARForm/ARForm'
import { Text } from '../components/Input/Text/Text'
import { AnyObjectSchema, object, string } from 'yup'
import { z } from 'zod'
import * as v from 'valibot'
import { userEvent, within, expect, fn } from 'storybook/test'
import { Checkbox } from '../components/Input/Checkbox/Checkbox'
import { Date } from '../components/Input/Date/Date'
import { Select } from '../components/Select/Select'
import { TextArea } from '../components/TextArea/TextArea'
import { FileUpload } from '../components/Input/FileUpload/FileUpload'

const meta: Meta<typeof ARForm> = {
  component: ARForm,
  title: 'ARForm',
  // title: 'ARForm/ARForm',
  args: {
    onSubmit: fn(),
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ARForm>

const basicValidationSchema: AnyObjectSchema = object({
  name: string().required(),
  email: string().email(),
})

const advancedValidationSchema: AnyObjectSchema = object({
  name: string().required(),
  user: string(),
  website: string().url(),
  terms: string().required(),
  dob: string().required(),
  country: string().required(),
  comments: string().required(),
  file: string().required(),
})

const BasicTemplate: Story = {
  render: ({ onSubmit }) => (
    <ARForm validationSchema={basicValidationSchema} onSubmit={onSubmit}>
      <Text id="name" label="Name" required />
      <Text id="email" label="Email" />
    </ARForm>
  ),
}

const WithSubmit: Story = {
  render: ({ onSubmit }) => (
    <ARForm validationSchema={basicValidationSchema} onSubmit={onSubmit}>
      <Text id="name" label="Name" required />
      <Text id="email" label="Email" />
      <button type="submit">Submit</button>
    </ARForm>
  ),
}

const WithDefaults: Story = {
  render: ({ onSubmit }) => (
    <ARForm
      validationSchema={basicValidationSchema}
      onSubmit={onSubmit}
      defaultValues={{
        name: 'Jill Doe',
        email: 'test@email.com',
      }}
    >
      <Text id="name" label="Name" required />
      <Text id="email" label="Email" />
    </ARForm>
  ),
}

const UsingCallback: Story = {
  render: ({ onSubmit }) => (
    <ARForm
      validationSchema={basicValidationSchema}
      onSubmit={onSubmit}
      onChangeCallback={(values, name, type, formProps) => {
        console.log('values', values)
        console.log('name', name)
        console.log('type', type)
        console.log('formProps', formProps)
      }}
    >
      <Text id="name" label="Name" required />
      <Text id="email" label="Email" />
    </ARForm>
  ),
}

const AdvancedTemplate: Story = {
  render: ({ onSubmit }) => (
    <ARForm validationSchema={advancedValidationSchema} onSubmit={onSubmit}>
      <Text id="name" label="Name" required />
      <Text id="user" label="User" prefix="@" />
      <Text id="website" label="Website" prefix="https://" />
      <Checkbox id="terms" label="I agree to the terms" required />
      <Date id="dob" label="Date of Birth" required />
      <Select
        id="country"
        label="Country"
        options={['USA', 'Canada', 'Mexico']}
        required
      />
      <TextArea id="comments" label="Comments" required />
      <FileUpload id="file" label="File" fileType="media" required />
    </ARForm>
  ),
}

const getBaseElements = (canvasElement: HTMLElement) => {
  const canvas = within(canvasElement)
  return {
    canvas,
    nameInput: canvas.getByRole('textbox', { name: /Name/i }),
    emailInput: canvas.getByRole('textbox', { name: /Email/i }),
    submitButton: canvas.getByRole('button'),
  }
}

const getAdvancedElements = (canvasElement: HTMLElement) => {
  const canvas = within(canvasElement)
  return {
    canvas,
    nameInput: canvas.getByRole('textbox', { name: /Name/i }),
    userInput: canvas.getByRole('textbox', { name: /User/i }),
    websiteInput: canvas.getByRole('textbox', { name: /Website/i }),
    termsCheckbox: canvas.getByRole('checkbox', {
      name: /I agree to the terms/i,
    }),
    dobInput: canvas.getByLabelText(/Date of Birth/i),
    // dobInput: canvas.getByRole('', { name: /dob/i }),
    countrySelect: canvas.getByRole('combobox', { name: /Country/i }),
    commentsTextarea: canvas.getByRole('textbox', { name: /Comments/i }),
    fileInput: canvas.getByLabelText(/File/i),
    // fileInput: canvas.getByRole('button', { name: /File/i }),
    submitButton: canvas.getByRole('button'),
  }
}

export const Base: Story = {
  ...BasicTemplate,
  play: async ({ canvasElement }) => {
    const nameInput = await within(canvasElement).findByLabelText('Name', {
      selector: 'input',
      exact: false,
    })
    const emailInput = await within(canvasElement).findByLabelText('Email', {
      selector: 'input',
      exact: false,
    })

    await expect(nameInput).toBeInTheDocument()
    await expect(emailInput).toBeInTheDocument()
    // await expect(submitButton).toBeInTheDocument()
  },
}

export const BaseWithSubmit: Story = {
  ...WithSubmit,
}

export const BaseWithDefaults: Story = {
  ...WithDefaults,
}

export const BaseUsingCallback: Story = {
  ...UsingCallback,
}

export const Advanced: Story = {
  ...AdvancedTemplate,
  play: async ({ canvasElement }) => {
    const {
      nameInput,
      userInput,
      websiteInput,
      termsCheckbox,
      dobInput,
      countrySelect,
      commentsTextarea,
      fileInput,
      submitButton,
    } = getAdvancedElements(canvasElement)

    await expect(nameInput).toBeInTheDocument()
    await expect(userInput).toBeInTheDocument()
    await expect(websiteInput).toBeInTheDocument()
    await expect(termsCheckbox).toBeInTheDocument()
    await expect(dobInput).toBeInTheDocument()
    await expect(countrySelect).toBeInTheDocument()
    await expect(commentsTextarea).toBeInTheDocument()
    await expect(fileInput).toBeInTheDocument()

    await userEvent.click(submitButton)
  },
}

export const Empty: Story = {
  ...BasicTemplate,
  play: async ({ canvasElement }) => {
    const { canvas, submitButton } = getBaseElements(canvasElement)

    await userEvent.click(submitButton)

    await expect(
      canvas.getByText(/name is a required field/)
    ).toBeInTheDocument()
  },
}

export const InvalidEmail: Story = {
  ...BasicTemplate,
  play: async ({ canvasElement, step }) => {
    const { canvas, nameInput, emailInput, submitButton } =
      getBaseElements(canvasElement)

    await step('Type name and email', async () => {
      await userEvent.type(nameInput, 'Jill Doe')
      await userEvent.type(emailInput, '123')
    })

    await userEvent.click(submitButton)

    await expect(
      canvas.getByText(/email must be a valid email/)
    ).toBeInTheDocument()
  },
}

export const Valid: Story = {
  ...BasicTemplate,
  play: async ({ args, canvasElement, step }) => {
    const { canvas, nameInput, emailInput, submitButton } =
      getBaseElements(canvasElement)

    await step('Type name and email', async () => {
      await userEvent.type(nameInput, 'Jill Doe')
      await userEvent.type(emailInput, 'test@email.com')
    })

    // await step('Submit form', async () => {
    //   await userEvent.keyboard('{enter}')
    // })

    await userEvent.click(submitButton)

    await expect(args.onSubmit).toHaveBeenCalled()
    await expect(canvas.queryByText(/enter your email/)).not.toBeInTheDocument()
    await expect(
      canvas.queryByText(/name is a required field/)
    ).not.toBeInTheDocument()
  },
}

const zodSchema = z.object({
  name: z.string().min(1, 'name is a required field'),
  email: z.email().optional().or(z.literal('')),
})

export const BaseZod: Story = {
  render: ({ onSubmit }) => (
    <ARForm validationSchema={zodSchema} onSubmit={onSubmit}>
      <Text id="name" label="Name" required />
      <Text id="email" label="Email" />
    </ARForm>
  ),
}

const valibotSchema = v.object({
  name: v.pipe(v.string(), v.minLength(1, 'name is a required field')),
  email: v.optional(v.union([v.pipe(v.string(), v.email()), v.literal('')])),
})

export const BaseValibot: Story = {
  render: ({ onSubmit }) => (
    <ARForm validationSchema={valibotSchema} onSubmit={onSubmit}>
      <Text id="name" label="Name" required />
      <Text id="email" label="Email" />
    </ARForm>
  ),
}
