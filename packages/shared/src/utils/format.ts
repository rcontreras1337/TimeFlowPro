/**
 * Formatting utilities
 */

/**
 * Format a date to locale string
 */
export function formatDate(
  date: Date | string,
  locale: string = 'es-CL',
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  })
}

/**
 * Format a time to locale string
 */
export function formatTime(
  date: Date | string,
  locale: string = 'es-CL',
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
    ...options,
  })
}

/**
 * Format a datetime to locale string
 */
export function formatDateTime(date: Date | string, locale: string = 'es-CL'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return `${formatDate(dateObj, locale)} ${formatTime(dateObj, locale)}`
}

/**
 * Format duration in minutes to human readable string
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`
  }
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  if (remainingMinutes === 0) {
    return `${hours}h`
  }
  return `${hours}h ${remainingMinutes}min`
}

/**
 * Format currency (Chilean Pesos by default)
 */
export function formatCurrency(
  amount: number,
  currency: string = 'CLP',
  locale: string = 'es-CL'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Format phone number (Chilean format)
 */
export function formatPhone(phone: string): string {
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '')

  // Format as +56 9 XXXX XXXX
  if (cleaned.length === 11 && cleaned.startsWith('569')) {
    return `+56 9 ${cleaned.slice(3, 7)} ${cleaned.slice(7)}`
  }

  // Format as 9 XXXX XXXX
  if (cleaned.length === 9 && cleaned.startsWith('9')) {
    return `9 ${cleaned.slice(1, 5)} ${cleaned.slice(5)}`
  }

  return phone
}
