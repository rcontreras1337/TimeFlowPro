import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useSearchParams: vi.fn(() => ({
    get: vi.fn(() => null),
  })),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
}))

// Mock useAuth hook
const mockSignInWithGoogle = vi.fn()
vi.mock('@/hooks/use-auth', () => ({
  useAuth: () => ({
    signInWithGoogle: mockSignInWithGoogle,
    isLoading: false,
  }),
}))

// Mock getMessage
vi.mock('@/lib/messages/client', () => ({
  getMessage: (path: string) => {
    const messages: Record<string, string> = {
      'auth.login.withGoogle': 'Continuar con Google',
      'auth.login.error': 'Error al iniciar sesión',
      'auth.errors.invalidCredentials': 'Credenciales inválidas',
    }
    return messages[path] || path
  },
}))

import { LoginForm } from '@/components/features/auth/login-form'

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders Google login button', () => {
    render(<LoginForm />)
    expect(screen.getByText('Continuar con Google')).toBeInTheDocument()
  })

  it('calls signInWithGoogle when button is clicked', async () => {
    mockSignInWithGoogle.mockResolvedValue(undefined)

    render(<LoginForm />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    await waitFor(() => {
      expect(mockSignInWithGoogle).toHaveBeenCalled()
    })
  })

  it('shows error alert when login fails', async () => {
    mockSignInWithGoogle.mockRejectedValue(new Error('Login failed'))

    render(<LoginForm />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
  })

  it('displays OAuth 2.0 security text', () => {
    render(<LoginForm />)
    expect(screen.getByText(/oauth 2.0/i)).toBeInTheDocument()
  })
})
