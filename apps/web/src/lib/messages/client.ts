/**
 * Client-safe getMessage helper
 *
 * This module provides the getMessage function for client components
 * without Node.js dependencies (fs, path).
 *
 * Messages are loaded via webpack and set by setMessages() at build time.
 */

type NestedObject = { [key: string]: string | NestedObject }

// Messages will be injected by webpack/build process
let messages: NestedObject = {}

/**
 * Set messages (used by webpack loader or during SSR hydration)
 */
export function setMessages(loadedMessages: NestedObject): void {
  messages = loadedMessages
}

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
      return messagePath
    }
  }

  if (typeof result !== 'string') {
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
