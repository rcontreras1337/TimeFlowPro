import { cva, type VariantProps } from 'class-variance-authority'
import { forwardRef, type HTMLAttributes } from 'react'

import { cn } from '@/lib/utils/cn'

/**
 * Badge variants following TimeFlowPro Design System
 */
const badgeVariants = cva(
  [
    'inline-flex items-center rounded-full px-2.5 py-0.5',
    'text-xs font-medium',
    'transition-colors',
  ],
  {
    variants: {
      variant: {
        default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
        success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        destructive: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
        secondary: 'bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-300',
        primary: 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

/**
 * Badge component for status labels
 *
 * @example
 * <Badge variant="success">Activo</Badge>
 * <Badge variant="warning">Trial</Badge>
 */
const Badge = forwardRef<HTMLSpanElement, BadgeProps>(({ className, variant, ...props }, ref) => {
  return <span ref={ref} className={cn(badgeVariants({ variant }), className)} {...props} />
})

Badge.displayName = 'Badge'

export { Badge, badgeVariants }
