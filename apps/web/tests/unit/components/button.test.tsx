import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '@/components/ui/button'

/**
 * Tests unitarios para el componente Button
 * @ticket T-0-04
 */
describe('Button Component', () => {
  describe('Renderizado', () => {
    it('debe renderizar el texto del boton', () => {
      render(<Button>Click me</Button>)
      
      expect(screen.getByRole('button')).toHaveTextContent('Click me')
    })

    it('debe renderizar con la variante primary (default)', () => {
      render(<Button>Primary</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-primary-500')
    })

    it('debe renderizar con la variante danger', () => {
      render(<Button variant="danger">Delete</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-error-500')
    })

    it('debe renderizar con la variante outline', () => {
      render(<Button variant="outline">Outline</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('border-2')
    })

    it('debe renderizar con la variante ghost', () => {
      render(<Button variant="ghost">Ghost</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-transparent')
    })
  })

  describe('Tamanos', () => {
    it('debe renderizar con tamano md (default)', () => {
      render(<Button>Default Size</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('h-10')
    })

    it('debe renderizar con tamano sm', () => {
      render(<Button size="sm">Small</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('h-8')
    })

    it('debe renderizar con tamano lg', () => {
      render(<Button size="lg">Large</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('h-11')
    })
  })

  describe('Interacciones', () => {
    it('debe llamar onClick cuando se hace click', () => {
      const handleClick = vi.fn()
      render(<Button onClick={handleClick}>Click me</Button>)
      
      fireEvent.click(screen.getByRole('button'))
      
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('no debe llamar onClick cuando esta deshabilitado', () => {
      const handleClick = vi.fn()
      render(<Button onClick={handleClick} disabled>Disabled</Button>)
      
      fireEvent.click(screen.getByRole('button'))
      
      expect(handleClick).not.toHaveBeenCalled()
    })

    it('debe tener el atributo disabled cuando esta deshabilitado', () => {
      render(<Button disabled>Disabled</Button>)
      
      expect(screen.getByRole('button')).toBeDisabled()
    })
  })

  describe('Accesibilidad', () => {
    it('debe ser focusable', () => {
      render(<Button>Focusable</Button>)
      
      const button = screen.getByRole('button')
      button.focus()
      
      expect(button).toHaveFocus()
    })

    it('debe aceptar className adicional', () => {
      render(<Button className="custom-class">Custom</Button>)
      
      expect(screen.getByRole('button')).toHaveClass('custom-class')
    })
  })
})

