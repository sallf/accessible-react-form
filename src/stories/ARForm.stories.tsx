import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { ARForm } from '../components/ARForm/ARForm'
import { Text } from '../components/Input/Text/Text'
import { AnyObjectSchema, object, string } from 'yup'

const meta: Meta<typeof ARForm> = {
  component: ARForm,
  title: 'Form',
}

export default meta
type Story = StoryObj<typeof ARForm>

const basicValidationSchema: AnyObjectSchema = object({
  name: string(),
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
}

// option 2
// const Template: Story = (args) => <Form {...args} />

// export const Basic = Template.bind({})
// Basic.args = {
//   backgroundColor: 'red',
// }
