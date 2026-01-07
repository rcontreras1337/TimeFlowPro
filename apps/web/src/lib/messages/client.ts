/**
 * Client-safe getMessage helper
 *
 * This module provides the getMessage function for client components.
 * Messages are loaded via webpack's yaml-loader at build time.
 *
 * @ticket T-1-03
 */

// Import messages directly - webpack yaml-loader handles this
import messagesData from './messages.es.yml'

type NestedObject = { [key: string]: string | NestedObject }

// Messages loaded from YAML at build time
const messages: NestedObject = messagesData as NestedObject

/**
 * Get all messages (for debugging/testing)
 */
export function getMessages(): NestedObject {
  return messages
}

/**
 * Obtiene un mensaje por su path (key.subkey.etc)
 * Soporta interpolación de variables con {variable}
 *
 * @example
 * getMessage('auth.login.success') // "¡Bienvenido!"
 * getMessage('account.trial.daysRemaining', { days: 5 }) // "Te quedan 5 días de prueba"
 */
export function getMessage(
  messagePath: string,
  variables?: Record<string, string | number>
): string {
  const keys = messagePath.split('.')
  let result: unknown = messages

  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = (result as NestedObject)[key]
    } else {
      // Return path as fallback if message not found
      console.warn(`[i18n] Message not found: ${messagePath}`)
      return messagePath
    }
  }

  if (typeof result !== 'string') {
    console.warn(`[i18n] Message path does not resolve to string: ${messagePath}`)
    return messagePath
  }

  // Variable interpolation
  if (variables) {
    return result.replace(/\{(\w+)\}/g, (_, varKey: string) => {
      const value = variables[varKey]
      return value !== undefined ? String(value) : `{${varKey}}`
    })
  }

  return result
}

/**
 * Alias corto para getMessage
 */
export const t = getMessage

/**
 * Hook para usar mensajes en componentes React
 */
export function useMessages() {
  return { getMessage, t }
}

/**
 * Check if a message path exists
 */
export function hasMessage(messagePath: string): boolean {
  const keys = messagePath.split('.')
  let result: unknown = messages

  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = (result as NestedObject)[key]
    } else {
      return false
    }
  }

  return typeof result === 'string'
}
