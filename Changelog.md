# Changelog

Todos los cambios notables de este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/).

---

## [Unreleased]

### Added

- **T-0-05**: Configuración de herramientas de calidad de código
  - Husky para git hooks (`pre-commit`, `commit-msg`)
  - Commitlint para validar Conventional Commits
  - ESLint con reglas estrictas de TypeScript
  - Prettier para formateo consistente
  - lint-staged para formatear archivos antes de commit

- 🎨 **UI Redesign**: Mobile-First PWA + Dark Theme Elegante
  - PWA configurada con `manifest.json` y meta tags
  - Nueva paleta oscura: `#0F0F14` (dark), `#6366F1` (indigo), `#8B5CF6` (violet)
  - Landing page rediseñada mobile-first con glassmorphism
  - Componente `BottomNav` para navegación móvil
  - Botones con gradiente y glow sutil
  - Reglas de estilo para IA en `.cursor/rules/estilo.mdc`

- 🌐 **T-0-06**: Sistema de mensajes centralizado (i18n)
  - `messages.es.yml` con ~400 mensajes en español organizados por módulo
  - Helper `getMessage()` con interpolación de variables
  - Función `hasMessage()` para verificar mensajes existentes
  - Webpack configurado para cargar archivos YML
  - 14 unit tests para el sistema de mensajes
  - Reglas de i18n en `.cursor/rules/estilo.mdc`

- 🎨 **Branding**: Logos actualizados con paleta dark
  - `logo-icon.svg`, `logo.svg`, `logo-dark.svg` con gradiente indigo/violet
  - Landing page usa logo en lugar de ícono genérico

### Changed

- Simplificado script de lint en `apps/web` para usar solo `next lint`
- Agregados ignorePatterns para archivos generados (`database.types.ts`)
- **BREAKING**: Paleta de colores actualizada (ver `.cursor/rules/estilo.mdc`)

---

## [0.1.0] - 2026-01-05

### Added

- Setup inicial del monorepo con pnpm workspaces
- Next.js 14 con App Router
- TailwindCSS con design tokens personalizados
- Supabase local con Docker
- GitHub Actions CI/CD Pipeline
- Deploy a Vercel configurado
