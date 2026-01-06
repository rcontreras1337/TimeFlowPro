import { cva, type VariantProps } from 'class-variance-authority'
import { X } from 'lucide-react'
import { forwardRef, type HTMLAttributes } from 'react'

import { cn } from '@/lib/utils/cn'

/**
 * Alert variants following TimeFlowPro Design System
 *
 * @ticket T-1-03
 */
const alertVariants = cva('relative w-full rounded-lg border p-4 text-sm', {
  variants: {
    variant: {
      default:
        'bg-gray-50 border-gray-200 text-gray-800 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200',
      error:
        'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200',
      warning:
        'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200',
      success:
        'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200',
      info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

export interface AlertProps
  extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertVariants> {
  /** Callback when close button is clicked */
  onClose?: () => void
}

/**
 * Alert component for displaying messages to users
 *
 * @example
 * <Alert variant="error" onClose={() => setError(null)}>
 *   {getMessage('auth.errors.invalidCredentials')}
 * </Alert>
 */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, children, onClose, ...props }, ref) => {
    return (
      <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props}>
        <div className="flex items-start gap-3">
          <div className="flex-1">{children}</div>
          {onClose && (
            <button
              onClick={onClose}
              className="shrink-0 opacity-70 hover:opacity-100 transition-opacity"
              aria-label="Cerrar alerta"
              type="button"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    )
  }
)

Alert.displayName = 'Alert'

export { alertVariants }
