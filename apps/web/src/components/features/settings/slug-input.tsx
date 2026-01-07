'use client'

import { useState, useEffect, useCallback } from 'react'

import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils/cn'

export interface SlugInputProps {
  /** Current slug value */
  value: string
  /** Change handler */
  onChange: (value: string) => void
  /** Error message */
  error?: string
  /** Disabled state */
  disabled?: boolean
}

/**
 * Specialized input for URL slugs with preview
 *
 * @description Automatically transforms input to lowercase and
 * replaces spaces with hyphens
 *
 * @ticket T-1-05
 */
export function SlugInput({ value, onChange, error, disabled }: SlugInputProps) {
  const [localValue, setLocalValue] = useState(value)

  // Sync external value
  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      // Transform to slug format: lowercase, no spaces, only alphanumeric and hyphens
      const transformed = e.target.value
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')

      setLocalValue(transformed)
      onChange(transformed)
    },
    [onChange]
  )

  const baseUrl = 'timeflowpro.app/'

  return (
    <div className="space-y-2">
      <div className="flex">
        <span
          className={cn(
            'inline-flex items-center rounded-l-lg border border-r-0 px-3 text-sm',
            'bg-gray-50 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
            error ? 'border-error-500' : 'border-gray-300 dark:border-gray-600'
          )}
        >
          {baseUrl}
        </span>
        <Input
          value={localValue}
          onChange={handleChange}
          error={error}
          disabled={disabled}
          placeholder="tu-nombre"
          className="rounded-l-none"
        />
      </div>
      {localValue && !error && (
        <p className="text-xs text-gray-500">
          Vista previa:{' '}
          <span className="font-medium text-primary-600 dark:text-primary-400">
            https://{baseUrl}
            {localValue}
          </span>
        </p>
      )}
    </div>
  )
}
