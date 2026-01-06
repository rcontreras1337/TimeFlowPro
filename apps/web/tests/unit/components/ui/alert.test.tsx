import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

import { Alert } from '@/components/ui/alert'

describe('Alert', () => {
  it('renders children correctly', () => {
    render(<Alert>Test message</Alert>)
    expect(screen.getByText('Test message')).toBeInTheDocument()
  })

  it('applies error variant styles', () => {
    render(<Alert variant="error">Error message</Alert>)
    const alert = screen.getByRole('alert')
    expect(alert).toHaveClass('bg-red-50')
  })

  it('applies success variant styles', () => {
    render(<Alert variant="success">Success message</Alert>)
    const alert = screen.getByRole('alert')
    expect(alert).toHaveClass('bg-green-50')
  })

  it('applies warning variant styles', () => {
    render(<Alert variant="warning">Warning message</Alert>)
    const alert = screen.getByRole('alert')
    expect(alert).toHaveClass('bg-yellow-50')
  })

  it('applies info variant styles', () => {
    render(<Alert variant="info">Info message</Alert>)
    const alert = screen.getByRole('alert')
    expect(alert).toHaveClass('bg-blue-50')
  })

  it('shows close button when onClose is provided', () => {
    const onClose = vi.fn()
    render(<Alert onClose={onClose}>Closeable alert</Alert>)

    const closeButton = screen.getByRole('button', { name: /cerrar alerta/i })
    expect(closeButton).toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn()
    render(<Alert onClose={onClose}>Closeable alert</Alert>)

    const closeButton = screen.getByRole('button', { name: /cerrar alerta/i })
    fireEvent.click(closeButton)

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('does not show close button when onClose is not provided', () => {
    render(<Alert>Non-closeable alert</Alert>)

    const closeButton = screen.queryByRole('button', { name: /cerrar alerta/i })
    expect(closeButton).not.toBeInTheDocument()
  })

  it('has correct accessibility role', () => {
    render(<Alert>Accessible alert</Alert>)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })
})
