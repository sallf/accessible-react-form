import type { Meta, StoryObj } from '@storybook/react'
import { ARForm } from '../components/ARForm/ARForm'
import { Text } from '../components/Input/Text/Text'
import { AnyObjectSchema, object, string } from 'yup'
import { userEvent, within, expect, fn, waitFor, spyOn } from '@storybook/test'
import { FieldValues } from 'react-hook-form'

const meta: Meta<typeof ARForm> = {
  component: ARForm,
  title: 'ARForm',
  // title: 'ARForm/ARForm',
  args: {
    // onSubmit: (data: FieldValues) => {
    //   console.log(data)
    //   fn()
    //   // fn().mockReturnValue(data)
    //   // fn((args) => {
    //   //   console.log('args :>> ', args)
    //   //   return {
    //   //     ...args,
    //   //     data,
    //   //   }
    //   // })
    // },
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

const BasicTemplate: Story = {
  render: ({ onSubmit }) => (
    <ARForm validationSchema={basicValidationSchema} onSubmit={onSubmit}>
      <Text id="name" label="Name" />
      <Text id="email" label="Email" />
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

export const Base: Story = {
  ...BasicTemplate,
  play: async ({ args, canvasElement, step }) => {
    const { canvas, nameInput, emailInput, submitButton } =
      getBaseElements(canvasElement)

    await expect(nameInput).toBeInTheDocument()
    await expect(emailInput).toBeInTheDocument()
    await expect(submitButton).toBeInTheDocument()
  },
}

export const Empty: Story = {
  ...BasicTemplate,
  play: async ({ args, canvasElement, step }) => {
    const { canvas, nameInput, emailInput, submitButton } =
      getBaseElements(canvasElement)

    await userEvent.click(submitButton)

    await expect(
      canvas.getByText(/name is a required field/)
    ).toBeInTheDocument()
  },
}

export const InvalidEmail: Story = {
  ...BasicTemplate,
  play: async ({ args, canvasElement, step }) => {
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

// export const Basic: Story = {
//   render: () => (
//     <ARForm
//       validationSchema={basicValidationSchema}
//       onSubmit={(data) => console.log(data)}
//     >
//       <Text id="name" label="Name" />
//       <Text id="email" label="Email" />
//     </ARForm>
//   ),
//   play: async ({ canvasElement }) => {
//     const canvas = within(canvasElement)

//     console.log('canvas :>> ', canvas)

//     // const nameInput = canvas.getByLabelText('Name', {
//     //   selector: 'input',
//     //   exact: false,
//     // })

//     // const emailInput = canvas.getByLabelText('Email', {
//     //   selector: 'input',
//     //   exact: false,
//     // })

//     // OR https://testing-library.com/docs/queries/about/#priority
//     const nameInput = canvas.getByRole('textbox', { name: /Name/i })
//     const emailInput = canvas.getByRole('textbox', { name: /Email/i })

//     // await userEvent.type(nameInput, 'Jill Doe')
//     await userEvent.type(emailInput, 'email@provider.com')

//     // See https://storybook.js.org/docs/essentials/actions#automatically-matching-args to learn how to setup logging in the Actions panel
//     // await userEvent.click(canvas.getByRole('button'))
//     await userEvent.keyboard('{enter}')

//     // 👇 Assert DOM structure
//     await expect(
//       canvas.getByText('Please fill out this field')
//     ).toBeInTheDocument()
//   },
// }

// const invalidValidationSchema: AnyObjectSchema = object({
//   name: string().required(),
// })

// export const Invalid: Story = {
//   render: () => (
//     <ARForm
//       validationSchema={invalidValidationSchema}
//       onSubmit={(data) => console.log(data)}
//     >
//       <Text id="name" label="Name" />
//       <Text id="email" label="Email" />
//     </ARForm>
//   ),
// }

// export const FilledForm: Story = {
//   play: async ({ canvasElement }) => {
//     const canvas = within(canvasElement)

//     console.log('canvas :>> ', canvas)

//     const nameInput = canvas.getByLabelText('Name', {
//       selector: 'input',
//     })

//     const emailInput = canvas.getByLabelText('Email', {
//       selector: 'input',
//     })

//     await userEvent.type(nameInput, 'Jill Doe')
//     await userEvent.type(emailInput, 'email@provider.com')

//     // See https://storybook.js.org/docs/essentials/actions#automatically-matching-args to learn how to setup logging in the Actions panel
//     // await userEvent.click(canvas.getByRole('button'))
//     await userEvent.keyboard('{enter}')

//     // 👇 Assert DOM structure
//     await expect(
//       canvas.getByText(
//         'Everything is perfect. Your account is ready and we should probably get you started!'
//       )
//     ).toBeInTheDocument()
//   },
// }

// export const MissingNameForm: Story = {
//   play: async ({ canvasElement }) => {
//     const canvas = within(canvasElement)

//     const emailInput = canvas.getByLabelText('Email', {
//       selector: 'input',
//     })

//     await userEvent.type(emailInput, 'email@provider.com')
//     await userEvent.keyboard('{enter}')

//     // 👇 Assert DOM structure
//     await expect(
//       canvas.getByText(
//         'Everything is perfect. Your account is ready and we should probably get you started!'
//       )
//     ).toBeInTheDocument()
//   },
// }
