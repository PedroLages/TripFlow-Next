import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { LoginForm } from '../LoginForm'

// Mock next/navigation
const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

// Mock loginAction
const mockLoginAction = vi.fn()
vi.mock('@/app/actions/auth', () => ({
  loginAction: (...args: unknown[]) => mockLoginAction(...args),
}))

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    form: ({ children, onSubmit, className, ...props }: React.ComponentPropsWithoutRef<'form'>) => (
      <form onSubmit={onSubmit} className={className} {...props}>{children}</form>
    ),
    div: ({ children, className, role, ...props }: React.ComponentPropsWithoutRef<'div'>) => (
      <div className={className} role={role} {...props}>{children}</div>
    ),
    p: ({ children, className, role, id, ...props }: React.ComponentPropsWithoutRef<'p'>) => (
      <p className={className} role={role} id={id} {...props}>{children}</p>
    ),
  },
}))

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders form with email, password, rememberMe, and submit button', () => {
    render(<LoginForm />)

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/remember me/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument()
  })

  it('disables submit button during authentication (Issue #7)', async () => {
    mockLoginAction.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ success: true }), 100))
    )

    render(<LoginForm />)

    const emailInput = screen.getByLabelText(/email address/i)
    const passwordInput = screen.getByLabelText(/^password$/i)
    const submitButton = screen.getByRole('button', { name: /log in/i })

    // Fill form
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })

    // Submit form
    fireEvent.click(submitButton)

    // Button should be disabled and text should change
    await waitFor(() => {
      expect(submitButton).toBeDisabled()
      expect(screen.getByText(/logging in\.\.\./i)).toBeInTheDocument()
    })

    // Wait for action to complete
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled()
    })
  })

  it('successful login calls loginAction and redirects', async () => {
    mockLoginAction.mockResolvedValue({ success: true })

    render(<LoginForm />)

    const emailInput = screen.getByLabelText(/email address/i)
    const passwordInput = screen.getByLabelText(/^password$/i)
    const submitButton = screen.getByRole('button', { name: /log in/i })

    // Fill form
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })

    // Submit form
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockLoginAction).toHaveBeenCalledWith('test@example.com', 'password123', false)
      expect(mockPush).toHaveBeenCalledWith('/')
    })
  })

  it('failed login shows error message', async () => {
    mockLoginAction.mockResolvedValue({
      success: false,
      error: {
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid email or password',
      },
    })

    render(<LoginForm />)

    const emailInput = screen.getByLabelText(/email address/i)
    const passwordInput = screen.getByLabelText(/^password$/i)
    const submitButton = screen.getByRole('button', { name: /log in/i })

    // Fill form
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } })

    // Submit form
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Invalid email or password')
    })

    expect(mockPush).not.toHaveBeenCalled()
  })

  it('network error shows "unexpected error" message (Issue #13)', async () => {
    mockLoginAction.mockRejectedValue(new Error('Network error'))

    render(<LoginForm />)

    const emailInput = screen.getByLabelText(/email address/i)
    const passwordInput = screen.getByLabelText(/^password$/i)
    const submitButton = screen.getByRole('button', { name: /log in/i })

    // Fill form
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })

    // Submit form
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        'An unexpected error occurred. Please try again.'
      )
    })

    expect(mockPush).not.toHaveBeenCalled()
  })

  it('form validation prevents submission with invalid data', () => {
    render(<LoginForm />)

    const emailInput = screen.getByLabelText(/email address/i)
    const passwordInput = screen.getByLabelText(/^password$/i)
    const submitButton = screen.getByRole('button', { name: /log in/i })

    // Fill with invalid data
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
    fireEvent.change(passwordInput, { target: { value: 'short' } })

    // Submit form
    fireEvent.click(submitButton)

    // Should not call loginAction because client-side validation failed
    expect(mockLoginAction).not.toHaveBeenCalled()
  })

  it('remembers user when rememberMe is checked', async () => {
    mockLoginAction.mockResolvedValue({ success: true })

    render(<LoginForm />)

    const emailInput = screen.getByLabelText(/email address/i)
    const passwordInput = screen.getByLabelText(/^password$/i)
    const rememberMeCheckbox = screen.getByLabelText(/remember me/i)
    const submitButton = screen.getByRole('button', { name: /log in/i })

    // Fill form and check rememberMe
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(rememberMeCheckbox)

    // Submit form
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockLoginAction).toHaveBeenCalledWith('test@example.com', 'password123', true)
    })
  })

  it('clears errors when resubmitting', async () => {
    mockLoginAction.mockResolvedValueOnce({
      success: false,
      error: {
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid email or password',
      },
    }).mockResolvedValueOnce({ success: true })

    render(<LoginForm />)

    const emailInput = screen.getByLabelText(/email address/i)
    const passwordInput = screen.getByLabelText(/^password$/i)
    const submitButton = screen.getByRole('button', { name: /log in/i })

    // First submission with error
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Invalid email or password')
    })

    // Second submission should clear error
    fireEvent.change(passwordInput, { target: { value: 'correctpassword' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })
  })
})
