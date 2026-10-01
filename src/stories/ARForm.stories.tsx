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
import { TagInput } from '../components/Input/TagInput/TagInput'

const meta: Meta<typeof ARForm> = {
  component: ARForm,
  title: 'Unstyled/ARForm',
  id: 'arform',
  parameters: { tailwind: false },
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
  const nameInput = canvas.getByRole('textbox', { name: /Name/i })
  return {
    canvas,
    nameInput,
    emailInput: canvas.getByRole('textbox', { name: /Email/i }),
    // Submit the way a user does; the default submit button is hidden.
    submit: () => userEvent.type(nameInput, '{Enter}'),
  }
}

const getAdvancedElements = (canvasElement: HTMLElement) => {
  const canvas = within(canvasElement)
  const nameInput = canvas.getByRole('textbox', { name: /Name/i })
  return {
    canvas,
    nameInput,
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
    submit: () => userEvent.type(nameInput, '{Enter}'),
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
      submit,
    } = getAdvancedElements(canvasElement)

    await expect(nameInput).toBeInTheDocument()
    await expect(userInput).toBeInTheDocument()
    await expect(websiteInput).toBeInTheDocument()
    await expect(termsCheckbox).toBeInTheDocument()
    await expect(dobInput).toBeInTheDocument()
    await expect(countrySelect).toBeInTheDocument()
    await expect(commentsTextarea).toBeInTheDocument()
    await expect(fileInput).toBeInTheDocument()

    await submit()
  },
}

export const Empty: Story = {
  ...BasicTemplate,
  play: async ({ canvasElement }) => {
    const { canvas, submit } = getBaseElements(canvasElement)

    await submit()

    await expect(
      canvas.getByText(/name is a required field/)
    ).toBeInTheDocument()
  },
}

export const InvalidEmail: Story = {
  ...BasicTemplate,
  play: async ({ canvasElement, step }) => {
    const { canvas, nameInput, emailInput, submit } =
      getBaseElements(canvasElement)

    await step('Type name and email', async () => {
      await userEvent.type(nameInput, 'Jill Doe')
      await userEvent.type(emailInput, '123')
    })

    await submit()

    await expect(
      canvas.getByText(/email must be a valid email/)
    ).toBeInTheDocument()
  },
}

export const Valid: Story = {
  ...BasicTemplate,
  play: async ({ args, canvasElement, step }) => {
    const { canvas, nameInput, emailInput, submit } =
      getBaseElements(canvasElement)

    await step('Type name and email', async () => {
      await userEvent.type(nameInput, 'Jill Doe')
      await userEvent.type(emailInput, 'test@email.com')
    })

    // await step('Submit form', async () => {
    //   await userEvent.keyboard('{enter}')
    // })

    await submit()

    await expect(args.onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Jill Doe', email: 'test@email.com' }),
      expect.anything()
    )
    await expect(canvas.queryByText(/enter your email/)).not.toBeInTheDocument()
    await expect(
      canvas.queryByText(/name is a required field/)
    ).not.toBeInTheDocument()
  },
}

export const FileUploadPreview: Story = {
  tags: ['zero-css'],
  render: ({ onSubmit }) => (
    <ARForm onSubmit={onSubmit}>
      <FileUpload id="doc" label="Document" fileType="binary" />
    </ARForm>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    const fileInput = canvas.getByLabelText(/Document/i) as HTMLInputElement
    const icon = canvasElement.querySelector('.arform__upload-icon')

    await step('Shows the file name as the preview after upload', async () => {
      await expect(fileInput).toBeVisible()
      await expect(icon).toHaveAttribute('aria-hidden', 'true')
      await expect(icon).toHaveAttribute('fill', 'currentColor')
      await expect(icon).toHaveAttribute('width', '32')
      await expect(icon).toHaveAttribute('height', '32')
      await expect(canvas.queryByText('Choose File')).not.toBeInTheDocument()

      const file = new File(['contents'], 'report.pdf', {
        type: 'application/pdf',
      })
      await userEvent.upload(fileInput, file)

      await expect(canvas.getByText('report.pdf')).toBeInTheDocument()
      await expect(canvas.queryByText('Change File')).not.toBeInTheDocument()
    })
  },
}

export const SubmitOnEnter: Story = {
  tags: ['zero-css'],
  render: ({ onSubmit }) => (
    <div>
      <ARForm onSubmit={onSubmit}>
        <Text id="first" label="First" />
        <Text id="second" label="Second" />
      </ARForm>
      <ARForm onSubmit={onSubmit}>
        <Text id="third" label="Third" />
        <Text id="fourth" label="Fourth" />
        <button type="submit">Send</button>
      </ARForm>
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const first = canvas.getByRole('textbox', { name: 'First' })
    const second = canvas.getByRole('textbox', { name: 'Second' })
    const third = canvas.getByRole('textbox', { name: 'Third' })
    const fourth = canvas.getByRole('textbox', { name: 'Fourth' })
    const hiddenSubmits = canvasElement.querySelectorAll('input[type="submit"]')
    await expect(hiddenSubmits).toHaveLength(2)
    for (const submit of hiddenSubmits) {
      await expect(submit).toHaveAttribute('tabindex', '-1')
    }
    await userEvent.tab()
    await expect(first).toHaveFocus()
    await userEvent.tab()
    await expect(second).toHaveFocus()
    await userEvent.tab()
    await expect(third).toHaveFocus()
    await userEvent.tab()
    await expect(fourth).toHaveFocus()
    await userEvent.tab()
    await expect(canvas.getByRole('button', { name: 'Send' })).toHaveFocus()
    await userEvent.type(first, 'A{enter}')
    await expect(args.onSubmit).toHaveBeenCalledTimes(1)
    await userEvent.type(third, 'B{enter}')
    await expect(args.onSubmit).toHaveBeenCalledTimes(2)
  },
}

export const CheckboxOrder: Story = {
  tags: ['zero-css'],
  render: ({ onSubmit }) => (
    <ARForm
      onSubmit={onSubmit}
      validationSchema={z.object({ agree: z.literal(true, 'Please agree') })}
    >
      <Checkbox id="agree" label="I agree" />
      <button type="submit">Confirm agreement</button>
    </ARForm>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const checkbox = canvas.getByRole('checkbox', {
      name: 'I agree',
    })
    await expect(checkbox.parentElement?.firstElementChild).toBe(checkbox)
    await userEvent.click(
      canvas.getByRole('button', { name: 'Confirm agreement' })
    )
    await expect(await canvas.findByText('Please agree.')).toBeVisible()
    await expect(checkbox).toHaveAccessibleName('I agree')
    await expect(checkbox).toHaveAccessibleDescription('Please agree.')
    const labelText = canvas.getByText('I agree').getBoundingClientRect()
    const control = checkbox.getBoundingClientRect()
    await expect(labelText.top).toBeLessThan(control.bottom)
    await expect(labelText.bottom).toBeGreaterThan(control.top)
    await userEvent.click(checkbox)
    await userEvent.click(
      canvas.getByRole('button', { name: 'Confirm agreement' })
    )
    await expect(canvas.queryByRole('alert')).not.toBeInTheDocument()
  },
}

export const TagInputBasic: Story = {
  tags: ['zero-css'],
  render: ({ onSubmit }) => (
    <ARForm onSubmit={onSubmit}>
      <TagInput id="topics" label="Topics" />
      <button type="submit">Send tags</button>
    </ARForm>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const textbox = canvas.getByRole('textbox', { name: 'Topics' })
    await expect(
      canvasElement.querySelector('input[name="topics"]')
    ).toHaveAttribute('type', 'hidden')
    await userEvent.type(textbox, 'alpha{enter}')
    await expect(textbox).toHaveAccessibleName('Topics')
    await expect(args.onSubmit).not.toHaveBeenCalled()
    const remove = canvas.getByRole('button', { name: 'Remove tag alpha' })
    await expect(remove.closest('label')).toBeNull()
    await userEvent.type(textbox, 'beta{enter}')
    await expect(textbox).toHaveAccessibleName('Topics')
    await userEvent.click(remove)
    await expect(textbox).toHaveAccessibleName('Topics')
    await userEvent.click(canvas.getByRole('button', { name: 'Send tags' }))
    await expect(args.onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ topics: 'beta' }),
      expect.anything()
    )
  },
}

export const TagInputStates: Story = {
  tags: ['zero-css'],
  render: ({ onSubmit }) => (
    <ARForm
      onSubmit={onSubmit}
      defaultValues={{ locked: 'alpha', lockedChoices: 'red' }}
    >
      <TagInput
        id="choices"
        label="Choices"
        onlySuggestions
        suggestions={['red', 'blue']}
      />
      <TagInput id="locked" label="Locked" disabled suggestions={['beta']} />
      <TagInput
        id="lockedChoices"
        label="Locked choices"
        onlySuggestions
        disabled
        suggestions={['blue']}
      />
    </ARForm>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const choices = canvas.getByRole('group', { name: 'Choices' })
    await expect(within(choices).queryByRole('textbox')).toBeNull()
    await userEvent.click(
      within(choices).getByRole('button', { name: 'Add tag red' })
    )
    await expect(
      within(choices).getByRole('button', { name: 'Remove tag red' })
    ).toBeEnabled()
    await userEvent.click(
      within(choices).getByRole('button', { name: 'Remove tag red' })
    )
    await expect(
      within(choices).getByRole('button', { name: 'Add tag red' })
    ).toBeInTheDocument()

    const locked = canvas.getByRole('textbox', { name: 'Locked' })
    await expect(locked).toBeDisabled()
    await userEvent.type(locked, 'ignored{enter}')
    await expect(locked).toHaveValue('')
    await expect(
      canvas.getByRole('button', { name: 'Remove tag alpha' })
    ).toBeDisabled()
    await expect(
      canvas.getByRole('button', { name: 'Add tag beta' })
    ).toBeDisabled()
    const lockedChoices = canvas.getByRole('group', { name: 'Locked choices' })
    await expect(
      within(lockedChoices).getByRole('button', { name: 'Remove tag red' })
    ).toBeDisabled()
    await expect(
      within(lockedChoices).getByRole('button', { name: 'Add tag blue' })
    ).toBeDisabled()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Remove tag alpha' })
    )
    await userEvent.click(
      within(lockedChoices).getByRole('button', { name: 'Add tag blue' })
    )
    await expect(
      canvas.getByRole('button', { name: 'Remove tag alpha' })
    ).toBeInTheDocument()
    await expect(
      within(lockedChoices).queryByRole('button', { name: 'Remove tag blue' })
    ).toBeNull()
    await expect(locked.closest('[data-arform-disabled]')).toBeInTheDocument()
    await expect(
      lockedChoices.closest('[data-arform-disabled]')
    ).toBeInTheDocument()
  },
}

const tagSchema = z.object({
  freeTags: z.string().min(1, 'Choose at least one free tag'),
  suggestedTags: z.string().min(1, 'Choose at least one suggested tag'),
})

export const TagInputValidation: Story = {
  tags: ['zero-css'],
  render: ({ onSubmit }) => (
    <ARForm onSubmit={onSubmit} validationSchema={tagSchema}>
      <TagInput id="freeTags" label="Free tags" required />
      <TagInput
        id="suggestedTags"
        label="Suggested tags"
        onlySuggestions
        required
        suggestions={['red']}
      />
      <button type="submit">Validate tags</button>
    </ARForm>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const free = canvas.getByRole('textbox', { name: 'Free tags' })
    const suggested = canvas.getByRole('group', { name: 'Suggested tags' })
    await expect(free).toHaveAttribute('aria-required', 'true')
    await userEvent.click(canvas.getByRole('button', { name: 'Validate tags' }))
    await expect(free).toHaveAttribute('aria-invalid', 'true')
    await expect(suggested).toHaveAttribute('aria-invalid', 'true')
    await expect(free).toHaveAccessibleDescription(
      /Choose at least one free tag/
    )
    await expect(suggested).toHaveAccessibleDescription(
      /Choose at least one suggested tag/
    )
    await expect(free.closest('[data-arform-invalid]')).toBeInTheDocument()
    await expect(suggested.closest('[data-arform-invalid]')).toBeInTheDocument()
    await userEvent.type(free, 'alpha{enter}')
    await userEvent.click(
      within(suggested).getByRole('button', { name: 'Add tag red' })
    )
    await expect(free).toHaveAttribute('aria-invalid', 'false')
    await expect(suggested).not.toHaveAttribute('aria-invalid')
    await userEvent.click(
      canvas.getByRole('button', { name: 'Remove tag alpha' })
    )
    await userEvent.click(
      within(suggested).getByRole('button', { name: 'Remove tag red' })
    )
    await expect(free).toHaveAttribute('aria-invalid', 'true')
    await expect(suggested).toHaveAttribute('aria-invalid', 'true')
  },
}

export const ClassHooksOnly: Story = {
  tags: ['zero-css'],
  render: ({ onSubmit }) => (
    <ARForm
      onSubmit={onSubmit}
      validationSchema={z.object({ name: z.string().min(1, 'Name required') })}
      defaultValues={{ topics: 'alpha', file: 'report.pdf' }}
    >
      <Text id="name" label="Name" prefix="@" />
      <Date id="date" label="Date" />
      <Checkbox id="check" label="Check" />
      <Select id="option" label="Option" options={['One', 'Two']} />
      <TextArea id="comment" label="Comment" />
      <FileUpload id="file" label="File" fileType="binary" />
      <TagInput id="topics" label="Topics" suggestions={['beta']} />
      <button type="submit">Check classes</button>
    </ARForm>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('button', { name: 'Remove tag alpha' })
    ).toBeInTheDocument()
    await expect(
      canvas.getByRole('button', { name: 'Add tag beta' })
    ).toBeInTheDocument()
    await expect(canvas.getByText('report.pdf')).toBeInTheDocument()
    await userEvent.click(canvas.getByRole('button', { name: 'Check classes' }))
    await expect(canvas.getByText('Name required.')).toBeInTheDocument()
    const form = canvasElement.querySelector('form')!
    for (const element of form.querySelectorAll('[class]')) {
      for (const token of element.classList) {
        await expect(token.startsWith('arform')).toBe(true)
      }
    }
  },
}

export const ConsumerStyling: Story = {
  tags: ['zero-css'],
  render: ({ onSubmit }) => (
    <ARForm
      onSubmit={onSubmit}
      className="customForm"
      style={{ color: 'navy' }}
    >
      <Text
        id="plain"
        label="Plain"
        className="text-lg"
        style={{ color: 'purple' }}
      />
      <TagInput
        id="tags"
        label="Tags"
        className="moduleTag"
        style={{ color: 'green' }}
      />
      <TagInput
        id="pick"
        label="Pick"
        onlySuggestions
        suggestions={['one']}
        className="moduleGroup"
        style={{ color: 'blue' }}
      />
      <FileUpload
        id="upload"
        label="Upload"
        fileType="binary"
        className="filePicker"
        style={{ color: 'maroon' }}
      />
      <Date
        id="styledDate"
        label="Styled date"
        className="customControl"
        labelClassName="customLabel"
        style={{ color: 'teal' }}
      />
      <Checkbox
        id="styledCheckbox"
        label="Styled checkbox"
        className="customControl"
        labelClassName="customLabel"
        style={{ color: 'teal' }}
      />
      <Select
        id="styledSelect"
        label="Styled select"
        options={['One', 'Two']}
        className="customControl"
        labelClassName="customLabel"
        style={{ color: 'teal' }}
      />
      <TextArea
        id="styledTextArea"
        label="Styled textarea"
        className="customControl"
        labelClassName="customLabel"
        style={{ color: 'teal' }}
      />
    </ARForm>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvasElement.querySelector('form')).toHaveClass(
      'arform',
      'customForm'
    )
    await expect(canvas.getByRole('textbox', { name: 'Plain' })).toHaveClass(
      'arform__input',
      'text-lg'
    )
    await expect(canvas.getByRole('textbox', { name: 'Plain' })).toHaveStyle({
      color: 'rgb(128, 0, 128)',
    })
    await expect(canvas.getByRole('textbox', { name: 'Tags' })).toHaveClass(
      'arform__tag-input-control',
      'moduleTag'
    )
    await expect(canvas.getByRole('textbox', { name: 'Tags' })).toHaveStyle({
      color: 'rgb(0, 128, 0)',
    })
    await expect(canvas.getByRole('group', { name: 'Pick' })).toHaveClass(
      'arform__tag-input',
      'moduleGroup'
    )
    await expect(canvas.getByRole('group', { name: 'Pick' })).toHaveStyle({
      color: 'rgb(0, 0, 255)',
    })
    await expect(canvas.getByLabelText('Upload')).toHaveClass(
      'arform__upload',
      'filePicker'
    )
    await expect(canvas.getByLabelText('Upload')).toHaveStyle({
      color: 'rgb(128, 0, 0)',
    })
    await expect(canvasElement.querySelector('form')).toHaveStyle({
      color: 'rgb(0, 0, 128)',
    })
    for (const name of [
      'Styled date',
      'Styled checkbox',
      'Styled select',
      'Styled textarea',
    ]) {
      const control = canvas.getByLabelText(name)
      await expect(control).toHaveClass('customControl')
      await expect(control).toHaveStyle({ color: 'rgb(0, 128, 128)' })
      await expect(control.closest('label')).toHaveClass('customLabel')
    }
  },
}

export const NoCssLayout: Story = {
  tags: ['zero-css', 'layout'],
  render: ({ onSubmit }) => (
    <ARForm onSubmit={onSubmit}>
      <Text id="firstName" label="First name" />
      <Text id="lastName" label="Last name" />
      <Checkbox id="agree" label="Agree" />
      <Date id="start" label="Start date" />
      <Select id="country" label="Country" options={['USA', 'Canada']} />
      <TextArea id="notes" label="Notes" />
      <FileUpload id="attachment" label="Attachment" fileType="binary" />
      <TagInput id="topics" label="Topics" />
    </ARForm>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const form = canvasElement.querySelector('form')!
    const fields = Array.from(form.querySelectorAll(':scope > .arform__field'))
    await expect(fields).toHaveLength(8)
    for (let index = 1; index < fields.length; index += 1) {
      await expect(
        fields[index].getBoundingClientRect().top
      ).toBeGreaterThanOrEqual(fields[index - 1].getBoundingClientRect().bottom)
    }
    await expect(
      canvas.getByRole('textbox', { name: 'First name' })
    ).toBeInTheDocument()
    await expect(
      canvas.getByRole('textbox', { name: 'Last name' })
    ).toBeInTheDocument()
    await expect(
      canvas.getByRole('checkbox', { name: 'Agree' })
    ).toBeInTheDocument()
    await expect(
      canvas.getByRole('textbox', { name: 'Topics' })
    ).toBeInTheDocument()
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
