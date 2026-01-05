import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { forwardRef, type ButtonHTMLAttributes } from 'react'

import { cn } from '@/lib/utils/cn'

/**
 * Button variants following TimeFlowPro Design System
 *
 * @principle Single Responsibility - Only handles styles and variants
 * @principle Open/Closed - Extensible via className, closed for modification
 */
const buttonVariants = cva(
  // Base styles
  [
    'inline-flex items-center justify-center gap-2',
    'rounded-lg font-medium',
    'transition-all duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    'active:scale-[0.98]',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-gradient-to-r from-primary-500 to-secondary-500 text-white',
          'hover:from-primary-600 hover:to-secondary-600',
          'focus-visible:ring-primary-500',
          'shadow-glow-sm hover:shadow-glow',
        ],
        secondary: [
          'bg-secondary-500 text-white',
          'hover:bg-secondary-600',
          'focus-visible:ring-secondary-500',
        ],
        accent: [
          'bg-accent-500 text-white',
          'hover:bg-accent-600',
          'focus-visible:ring-accent-500',
        ],
        outline: [
          'border-2 border-primary-500 text-primary-500 bg-transparent',
          'hover:bg-primary-50 dark:hover:bg-primary-950',
          'focus-visible:ring-primary-500',
        ],
        ghost: [
          'text-gray-300 bg-transparent',
          'hover:bg-dark-300 hover:text-white',
          'focus-visible:ring-gray-500',
        ],
        danger: ['bg-error-500 text-white', 'hover:bg-error-600', 'focus-visible:ring-error-500'],
        link: [
          'text-primary-500 underline-offset-4',
          'hover:underline',
          'focus-visible:ring-primary-500',
        ],
      },
      size: {
        xs: 'h-7 px-2.5 text-xs',
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-11 px-6 text-base',
        xl: 'h-12 px-8 text-base',
        icon: 'h-10 w-10',
        'icon-sm': 'h-8 w-8',
        'icon-lg': 'h-12 w-12',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  /** Render as child component (for Link wrapping) */
  asChild?: boolean
  /** Loading state */
  isLoading?: boolean
}

/**
 * Primary UI component for user actions
 *
 * @example
 * <Button variant="primary" size="lg">Click me</Button>
 *
 * @example With Link
 * <Button asChild>
 *   <Link href="/dashboard">Go to Dashboard</Link>
 * </Button>
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      asChild = false,
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button'

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        disabled={disabled ?? isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="h-4 w-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Cargando...</span>
          </>
        ) : (
          children
        )}
      </Comp>
    )
  }
)

Button.displayName = 'Button'

export { Button, buttonVariants }
