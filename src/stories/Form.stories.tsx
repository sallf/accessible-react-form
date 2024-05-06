import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Form } from '../components/Form/Form'

const meta: Meta<typeof Form> = {
  component: Form,
  title: 'Form',
}

export default meta
type Story = StoryObj<typeof Form>

export const Basic: Story = {}

export const WithProp: Story = {
  render: () => <Form />,
}

// option 2
// const Template: Story = (args) => <Form {...args} />

// export const Basic = Template.bind({})
// Basic.args = {
//   backgroundColor: 'red',
// }
