import { cva, type VariantProps } from 'class-variance-authority'
import { forwardRef, type InputHTMLAttributes } from 'react'

import { cn } from '@/lib/utils/cn'

/**
 * Input variants following TimeFlowPro Design System
 */
const inputVariants = cva(
  [
    'flex w-full rounded-lg border bg-white px-3 py-2',
    'text-sm text-gray-900 placeholder:text-gray-400',
    'transition-colors duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-0',
    'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50',
    'dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500',
  ],
  {
    variants: {
      variant: {
        default: [
          'border-gray-300 dark:border-gray-600',
          'focus:border-primary-500 focus:ring-primary-500/20',
          'dark:focus:border-primary-400',
        ],
        error: [
          'border-error-500 dark:border-error-400',
          'focus:border-error-500 focus:ring-error-500/20',
        ],
        success: [
          'border-success-500 dark:border-success-400',
          'focus:border-success-500 focus:ring-success-500/20',
        ],
      },
      inputSize: {
        sm: 'h-8 text-xs',
        md: 'h-10 text-sm',
        lg: 'h-12 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      inputSize: 'md',
    },
  }
)

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>, VariantProps<typeof inputVariants> {
  /** Error message to display */
  error?: string
  /** Helper text below input */
  helperText?: string
  /** Left icon/addon */
  leftIcon?: React.ReactNode
  /** Right icon/addon */
  rightIcon?: React.ReactNode
}

/**
 * Input component for forms
 *
 * @example
 * <Input
 *   label="Email"
 *   placeholder="tu@email.com"
 *   type="email"
 * />
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, inputSize, error, helperText, leftIcon, rightIcon, ...props }, ref) => {
    const hasError = !!error
    const effectiveVariant = hasError ? 'error' : variant

    return (
      <div className="w-full">
        <div className="relative">
          {leftIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              {leftIcon}
            </div>
          )}
          <input
            className={cn(
              inputVariants({ variant: effectiveVariant, inputSize }),
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className
            )}
            ref={ref}
            aria-invalid={hasError}
            aria-describedby={
              hasError ? `${props.id}-error` : helperText ? `${props.id}-helper` : undefined
            }
            {...props}
          />
          {rightIcon && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p id={`${props.id}-error`} className="mt-1.5 text-sm text-error-500" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${props.id}-helper`} className="mt-1.5 text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input, inputVariants }
