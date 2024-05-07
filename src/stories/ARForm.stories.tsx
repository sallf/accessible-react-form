import type { Meta, StoryObj } from '@storybook/react'
import { ARForm } from '../components/ARForm/ARForm'
import { Text } from '../components/Input/Text/Text'
import { AnyObjectSchema, object, string } from 'yup'
import { userEvent, within, expect, fn } from '@storybook/test'

const meta: Meta<typeof ARForm> = {
  component: ARForm,
  title: 'ARForm',
  args: {
    onSubmit: fn(),
  },
}

export default meta
type Story = StoryObj<typeof ARForm>

const basicValidationSchema: AnyObjectSchema = object({
  name: string().required(),
  email: string().email(),
})

export const Basic: Story = {
  render: () => (
    <ARForm
      validationSchema={basicValidationSchema}
      onSubmit={(data) => console.log(data)}
    >
      <Text id="name" label="Name" />
      <Text id="email" label="Email" />
    </ARForm>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    console.log('canvas :>> ', canvas)

    const nameInput = canvas.getByLabelText('Name', {
      selector: 'input',
      exact: false,
    })

    const emailInput = canvas.getByLabelText('Email', {
      selector: 'input',
      exact: false,
    })

    // await userEvent.type(nameInput, 'Jill Doe')
    await userEvent.type(emailInput, 'email@provider.com')

    // See https://storybook.js.org/docs/essentials/actions#automatically-matching-args to learn how to setup logging in the Actions panel
    // await userEvent.click(canvas.getByRole('button'))
    await userEvent.keyboard('{enter}')

    // 👇 Assert DOM structure
    await expect(
      canvas.getByText('Please fill out this field')
    ).toBeInTheDocument()
  },
}

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
