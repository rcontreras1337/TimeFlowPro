'use client'

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'

import { cn } from '@/lib/utils/cn'

export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  /** Icon to display (emoji or React node) */
  icon?: ReactNode
  /** Title text */
  title: string
  /** Description text */
  description?: string
  /** Action button or element */
  action?: ReactNode
}

/**
 * Empty state component for when there's no data to display
 *
 * @example
 * <EmptyState
 *   icon="📍"
 *   title="No tienes ubicaciones"
 *   description="Agrega las ubicaciones donde atiendes"
 *   action={<Button>Agregar ubicación</Button>}
 * />
 *
 * @ticket T-2-02
 */
const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, icon, title, description, action, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col items-center justify-center py-12 px-4 text-center',
          className
        )}
        {...props}
      >
        {icon && (
          <div className="mb-4 text-5xl" aria-hidden="true">
            {icon}
          </div>
        )}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        {description && (
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-sm">{description}</p>
        )}
        {action && <div className="mt-6">{action}</div>}
      </div>
    )
  }
)

EmptyState.displayName = 'EmptyState'

export { EmptyState }
