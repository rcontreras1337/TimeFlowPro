# Changelog

Todos los cambios notables de este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/).

---

## [Unreleased] - Sprint 2: Ubicaciones y Servicios

### Added

- 📍 **T-2-01**: CRUD Ubicaciones (Backend API + RLS)
  - `location.types.ts`: Tipos TypeScript para ubicaciones
  - `location.service.ts`: Servicio CRUD con validaciones
  - `use-locations.ts`: Hook TanStack Query con mutations
  - `query-provider.tsx`: Provider de TanStack Query

---

## [1.1.0] - 2026-01-09 - Sprint 1: Autenticación y Perfil ✅

### Added

- 🎨 **Sprint 1 Refinamientos**:
  - Página 404 personalizada con imagen de reloj derretido
  - Páginas `/privacy` y `/terms` (Política de Privacidad y Términos)
  - Enlace a Panel Admin en dashboard (solo visible para superadmin)
  - Imagen decorativa 404 generada con IA

- 📱 **Refinamientos UX Mobile-First**:
  - `AppSidebar`: navegación unificada con rol dinámico (Admin/Profesional)
  - `BottomNav`: navegación inferior para mobile con menú desplegable
  - Iconos más grandes (h-6 w-6) para mejor touch target
  - Botón de Cerrar Sesión en sidebar y menú mobile
  - Landing inteligente: muestra "Ir al Dashboard" si usuario autenticado
  - Sincronización de rol de profiles a JWT (migración 00020)

- 🎛️ **T-1-07**: Dashboard Admin - Configuración Trial y Gestión
  - Layout admin con verificación de rol `superadmin`
  - AdminSidebar colapsable con navegación
  - Componentes UI: Badge, Table, Switch, DropdownMenu
  - AdminStats: estadísticas de profesionales (total, trial, activos, readonly)
  - TrialsExpiringCard: muestra trials próximos a vencer
  - ProfessionalsTable: tabla con acciones (activar, suspender, extender trial)
  - Página de configuración de trial y notificaciones admin
- 🔄 **T-1-06**: Sistema de Trial Automático
  - Edge Function `expire-trials` para expirar trials diariamente
  - Edge Function `notify-admin` para notificaciones al administrador
  - Migraciones para `pg_cron`, `pg_net` y cron jobs automáticos
  - Trigger `notify_new_registration` para avisar de nuevos registros
  - `TrialService` frontend con métodos `getTrialStatus`, `getTrialConfig`, `isReadonly`
  - 9 tests unitarios para TrialService
  - Tests de integración para Edge Functions
  - Tests e2e para sistema de trial
  - Configuración `booking_settings` en seed.sql

- 🔐 **T-1-02**: Supabase Auth con Google OAuth
  - `AuthService` con métodos signInWithGoogle, signOut, getSession, getUser
  - Callback handler con verificación de estado de cuenta
  - Hook `useAuth` con estado de trial, readonly, días restantes
  - 15 tests pasando (9 unitarios + 6 integración)

- 🗄️ **T-1-01**: Migración Inicial de Base de Datos
  - 15 scripts de migración SQL para estructura core
  - 14 tablas: `profiles`, `appointments`, `clients`, `services`, `locations`, etc.
  - 9 ENUMs: roles, estados, orígenes, etc.
  - Triggers de auditoría (`updated_at`) y lógica de negocio
  - Integración preparada para Google Calendar
  - Tests de integración para validar esquema y RLS
  - Tipos TypeScript generados automáticamente

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
