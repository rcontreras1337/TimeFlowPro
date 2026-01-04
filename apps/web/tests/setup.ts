import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock de variables de entorno para tests
vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'http://127.0.0.1:54321')
vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'test-anon-key')
vi.stubEnv('NEXT_PUBLIC_APP_URL', 'http://localhost:3000')

// Mock de console.warn para tests silenciosos
vi.spyOn(console, 'warn').mockImplementation(() => {})

