'use client'

import { forwardRef, type SelectHTMLAttributes } from 'react'

import { cn } from '@/lib/utils/cn'

/**
 * Common timezones for Latin America and other regions
 */
const TIMEZONES = [
  { value: 'America/Santiago', label: 'Chile (Santiago)' },
  { value: 'America/Argentina/Buenos_Aires', label: 'Argentina (Buenos Aires)' },
  { value: 'America/Bogota', label: 'Colombia (Bogotá)' },
  { value: 'America/Lima', label: 'Perú (Lima)' },
  { value: 'America/Mexico_City', label: 'México (Ciudad de México)' },
  { value: 'America/New_York', label: 'Estados Unidos (Nueva York)' },
  { value: 'America/Los_Angeles', label: 'Estados Unidos (Los Ángeles)' },
  { value: 'Europe/Madrid', label: 'España (Madrid)' },
  { value: 'Europe/London', label: 'Reino Unido (Londres)' },
  { value: 'UTC', label: 'UTC' },
] as const

export interface TimezoneSelectProps extends Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  'onChange'
> {
  /** Current value */
  value?: string
  /** Change handler */
  onChange?: (value: string) => void
  /** Error message */
  error?: string
}

/**
 * Timezone selector component
 *
 * @example
 * <TimezoneSelect
 *   value={timezone}
 *   onChange={setTimezone}
 * />
 *
 * @ticket T-1-05
 */
export const TimezoneSelect = forwardRef<HTMLSelectElement, TimezoneSelectProps>(
  ({ className, value, onChange, error, disabled, ...props }, ref) => {
    return (
      <div className="w-full">
        <select
          ref={ref}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          className={cn(
            'flex h-10 w-full rounded-lg border bg-white px-3 py-2',
            'text-sm text-gray-900',
            'transition-colors duration-200',
            'focus:outline-none focus:ring-2 focus:ring-offset-0',
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50',
            'dark:bg-gray-800 dark:text-gray-100',
            error
              ? 'border-error-500 focus:ring-error-500/20'
              : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500/20 dark:border-gray-600',
            className
          )}
          {...props}
        >
          {TIMEZONES.map((tz) => (
            <option key={tz.value} value={tz.value}>
              {tz.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="mt-1.5 text-sm text-error-500" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  }
)

TimezoneSelect.displayName = 'TimezoneSelect'
