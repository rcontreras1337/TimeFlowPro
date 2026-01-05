import { defineConfig } from 'vitest/config'
import path from 'path'

/**
 * Configuración de Vitest para tests de integración
 * Los tests unitarios se ejecutan desde apps/web
 */
export default defineConfig({
  test: {
    globals: true,
    include: ['./tests/**/*.test.ts'],
    exclude: ['node_modules/', 'apps/*/node_modules/'],
    testTimeout: 30000, // 30s para tests de integración
    hookTimeout: 30000,
  },
  resolve: {
    alias: {
      '@timeflowpro/shared': path.resolve(__dirname, './packages/shared/src'),
    },
  },
})
