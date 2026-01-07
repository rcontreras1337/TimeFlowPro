'use client'

import { forwardRef, type ImgHTMLAttributes } from 'react'

import { cn } from '@/lib/utils/cn'

export interface AvatarProps extends ImgHTMLAttributes<HTMLImageElement> {
  /** Size of the avatar */
  size?: 'sm' | 'md' | 'lg' | 'xl'
  /** Fallback text when no image (usually initials) */
  fallback?: string
}

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-20 w-20 text-2xl',
}

/**
 * Avatar component for displaying user profile images
 *
 * @example
 * <Avatar src={user.avatarUrl} fallback="RC" size="lg" />
 *
 * @ticket T-1-05
 */
export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, size = 'md', fallback, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700',
          sizeClasses[size],
          className
        )}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={alt ?? 'Avatar'} className="h-full w-full object-cover" {...props} />
        ) : (
          <span className="font-medium text-gray-600 dark:text-gray-300">{fallback ?? '?'}</span>
        )}
      </div>
    )
  }
)

Avatar.displayName = 'Avatar'
