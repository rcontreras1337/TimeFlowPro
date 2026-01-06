import fs from 'fs'
import path from 'path'

import yaml from 'js-yaml'

type NestedObject = { [key: string]: string | NestedObject }

// Load messages at runtime
let messages: NestedObject = {}

// In Node.js environment (build time), load from file
// In browser, messages will be injected by webpack
if (typeof window === 'undefined') {
  try {
    const messagesPath = path.join(process.cwd(), 'src/lib/messages/messages.es.yml')
    const fileContents = fs.readFileSync(messagesPath, 'utf8')
    messages = yaml.load(fileContents) as NestedObject
  } catch {
    // Will be loaded by webpack in browser
  }
}

/**
 * Set messages (used by webpack loader)
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
 * getMessage('validation.minLength', { min: 3 }) // "Mínimo 3 caracteres"
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
      console.warn(`[i18n] Message not found: ${messagePath}`)
      return messagePath // Return path as fallback
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
