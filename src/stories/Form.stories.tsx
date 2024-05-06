import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Form } from '../components/Form/Form'

const meta: Meta<typeof Form> = {
  component: Form,
}

export default meta
type Story = StoryObj<typeof Form>

export const Basic: Story = {}

export const WithProp: Story = {
  render: () => <Form />,
}
