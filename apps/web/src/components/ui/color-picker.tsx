'use client'

import { forwardRef, type HTMLAttributes } from 'react'

import { cn } from '@/lib/utils/cn'

/**
 * Predefined color palette for TimeFlowPro
 * Colors are chosen to be distinguishable and accessible
 */
const COLORS = [
  '#3F83F8', // Blue
  '#10B981', // Emerald
  '#8B5CF6', // Violet
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#84CC16', // Lime
  '#F97316', // Orange
  '#6366F1', // Indigo
] as const

export type ColorPickerColor = (typeof COLORS)[number]

export interface ColorPickerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Currently selected color */
  value?: string
  /** Callback when color changes */
  onChange?: (color: string) => void
  /** Whether the picker is disabled */
  disabled?: boolean
}

/**
 * Color picker component with predefined palette
 *
 * @example
 * <ColorPicker
 *   value={selectedColor}
 *   onChange={setSelectedColor}
 * />
 *
 * @ticket T-2-02
 */
const ColorPicker = forwardRef<HTMLDivElement, ColorPickerProps>(
  ({ className, value, onChange, disabled = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex flex-wrap gap-2', className)}
        role="radiogroup"
        aria-label="Seleccionar color"
        {...props}
      >
        {COLORS.map((color) => (
          <button
            key={color}
            type="button"
            role="radio"
            aria-checked={value === color}
            disabled={disabled}
            className={cn(
              'h-8 w-8 rounded-full transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              value === color && 'ring-2 ring-offset-2 ring-gray-900 dark:ring-white scale-110'
            )}
            style={{ backgroundColor: color }}
            onClick={() => onChange?.(color)}
            aria-label={`Color ${color}`}
          />
        ))}
      </div>
    )
  }
)

ColorPicker.displayName = 'ColorPicker'

export { ColorPicker, COLORS }
