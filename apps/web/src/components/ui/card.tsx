import { cva, type VariantProps } from 'class-variance-authority'
import { forwardRef, type HTMLAttributes } from 'react'

import { cn } from '@/lib/utils/cn'

/**
 * Card variants following TimeFlowPro Design System
 */
const cardVariants = cva(['rounded-xl transition-shadow duration-200'], {
  variants: {
    variant: {
      default: [
        'bg-white dark:bg-gray-800',
        'border border-gray-200 dark:border-gray-700',
        'shadow-sm',
      ],
      elevated: ['bg-white dark:bg-gray-800', 'shadow-lg'],
      outline: ['bg-transparent', 'border-2 border-gray-200 dark:border-gray-700'],
      ghost: ['bg-gray-50 dark:bg-gray-800/50'],
      interactive: [
        'bg-white dark:bg-gray-800',
        'border border-gray-200 dark:border-gray-700',
        'shadow-sm',
        'cursor-pointer',
        'hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600',
      ],
    },
    padding: {
      none: 'p-0',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    },
  },
  defaultVariants: {
    variant: 'default',
    padding: 'md',
  },
})

export interface CardProps
  extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {}

/**
 * Card container component
 *
 * @example
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Title</CardTitle>
 *     <CardDescription>Description</CardDescription>
 *   </CardHeader>
 *   <CardContent>Content here</CardContent>
 *   <CardFooter>Footer actions</CardFooter>
 * </Card>
 */
const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(cardVariants({ variant, padding }), className)} {...props} />
    )
  }
)

Card.displayName = 'Card'

/**
 * Card Header
 */
const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn('flex flex-col space-y-1.5', className)} {...props} />
  }
)

CardHeader.displayName = 'CardHeader'

/**
 * Card Title
 */
const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={cn('text-xl font-semibold text-gray-900 dark:text-white', className)}
        {...props}
      />
    )
  }
)

CardTitle.displayName = 'CardTitle'

/**
 * Card Description
 */
const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn('text-sm text-gray-500 dark:text-gray-400', className)}
        {...props}
      />
    )
  }
)

CardDescription.displayName = 'CardDescription'

/**
 * Card Content
 */
const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn('pt-4', className)} {...props} />
  }
)

CardContent.displayName = 'CardContent'

/**
 * Card Footer
 */
const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn('flex items-center pt-6', className)} {...props} />
  }
)

CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, cardVariants }
