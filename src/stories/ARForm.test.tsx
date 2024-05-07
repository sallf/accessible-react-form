import { render, fireEvent, screen } from '@testing-library/react'
import { composeStory } from '@storybook/react'
import Meta, { Basic } from './ARForm.stories'

const FormBasic = composeStory(Basic, Meta)

describe('Basic Form', () => {
  test('renders form fields', () => {
    render(<FormBasic />)
    const nameInput = screen.getByLabelText('Name')
    const emailInput = screen.getByLabelText('Email')
    expect(nameInput).toBeInTheDocument()
    expect(emailInput).toBeInTheDocument()
  })

  test('sets input values', () => {
    render(<FormBasic />)
    const nameInput = screen.getByLabelText('Name') as HTMLInputElement
    const emailInput = screen.getByLabelText('Email') as HTMLInputElement
    fireEvent.change(nameInput, { target: { value: 'John Doe' } })
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } })
    expect(nameInput.value).toBe('John Doe')
    expect(emailInput.value).toBe('john@example.com')
  })

  test('submits form', () => {
    const onSubmit = jest.fn()
    render(<FormBasic onSubmit={onSubmit} />)
    const nameInput = screen.getByLabelText('Name')
    const emailInput = screen.getByLabelText('Email')
    fireEvent.change(nameInput, { target: { value: 'John Doe' } })
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } })
    fireEvent.click(screen.getByRole('button'))
    expect(onSubmit).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com',
    })
  })
})
