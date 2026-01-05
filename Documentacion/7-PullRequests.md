# 7. Pull Requests - TimeFlowPro

---

## 7.0 Estándares de Pull Requests

### Convenciones de Commits

Todos los PRs deben seguir **Conventional Commits**:

| Prefijo    | Uso                 | Ejemplo                                       |
| ---------- | ------------------- | --------------------------------------------- |
| `feat`     | Nueva funcionalidad | `feat(auth): implementar login con Google`    |
| `fix`      | Corrección de bug   | `fix(calendar): corregir cálculo de slots`    |
| `chore`    | Mantenimiento       | `chore(deps): actualizar dependencias`        |
| `docs`     | Documentación       | `docs(api): agregar ejemplos de endpoints`    |
| `refactor` | Refactorización     | `refactor(appointments): extraer servicio`    |
| `test`     | Tests               | `test(availability): agregar tests unitarios` |
| `style`    | Formateo            | `style: aplicar prettier a componentes`       |
| `perf`     | Performance         | `perf(queries): optimizar consultas RLS`      |
| `ci`       | CI/CD               | `ci: agregar job de deploy a staging`         |

### Estructura de Descripción

```markdown
## Resumen

[Qué hace este PR en 1-2 oraciones]

## Motivación

[Por qué es necesario este cambio]

## Cambios Realizados

- [Cambio 1]
- [Cambio 2]
- [Cambio 3]

## Tickets Relacionados

Closes #T-X-XX

## Plan de Pruebas

- [ ] Tests unitarios pasando
- [ ] Tests de integración pasando
- [ ] Pruebas manuales realizadas

## Capturas / Evidencia

[Screenshots o respuestas JSON]

## Checklist

- [ ] Código sigue guía de estilo
- [ ] Tests añadidos/actualizados
- [ ] Documentación actualizada
- [ ] Sin errores de linting
- [ ] Sin errores de TypeScript
- [ ] Mensajes en español via YML
```

---

## 7.1 Pull Request #1: Setup Inicial del Proyecto

### Título

```
feat(infra): setup inicial monorepo + Next.js 14 + sistema de mensajes
```

### Descripción

#### Resumen

Configura la estructura base del proyecto TimeFlowPro: monorepo con pnpm workspaces, Next.js 14 con App Router, TailwindCSS con design tokens personalizados, y sistema centralizado de mensajes en español.

#### Motivación

Este PR establece los cimientos técnicos del proyecto, asegurando:

- Arquitectura hexagonal preparada para escalabilidad
- Design system consistente con la identidad de marca
- Sistema de mensajes centralizado para mantener todo el UI en español
- Configuración de calidad de código desde el día 1

#### Cambios Realizados

**Estructura del Proyecto:**

```
timeflowpro/
├── apps/
│   └── web/                      # Next.js 14 App
│       ├── src/
│       │   ├── app/              # App Router pages
│       │   ├── components/       # Componentes UI
│       │   │   ├── ui/           # Componentes base
│       │   │   └── features/     # Componentes de negocio
│       │   ├── lib/
│       │   │   ├── supabase/     # Clientes Supabase
│       │   │   └── messages/     # Sistema i18n
│       │   ├── services/         # Lógica de negocio
│       │   ├── hooks/            # Custom hooks
│       │   └── types/            # TypeScript types
│       ├── tailwind.config.ts
│       └── next.config.js
├── packages/
│   └── ui/                       # Shared UI components
├── pnpm-workspace.yaml
├── package.json
└── turbo.json
```

**Design Tokens (tailwind.config.ts):**

- Primary: `#3F83F8` (Azul profesional)
- Secondary: `#0694A2` (Teal flow)
- Accent: `#FF5A1F` (Naranja energía)
- Colores semánticos para citas, traslados, bloqueos
- Tipografía: Plus Jakarta Sans

**Sistema de Mensajes:**

- Archivo `messages.es.yml` con +200 mensajes
- Helper `getMessage(path, variables)`
- Interpolación de variables `{variable}`
- Fallback a path si mensaje no existe

**Componentes Base Creados:**

- `Button` (variantes: default, outline, ghost, destructive)
- `Input` (con validación visual)
- `Card`, `CardHeader`, `CardContent`
- `Badge` (variantes de color)
- `Alert` (success, warning, error, info)

**Configuración de Calidad:**

- ESLint con reglas estrictas
- Prettier para formateo
- Husky para pre-commit hooks
- Commitlint para conventional commits

### Tickets Relacionados

```
Closes #T-0-01
Closes #T-0-02
Closes #T-0-05
Closes #T-0-06
```

### Plan de Pruebas

#### Tests Unitarios

```bash
pnpm test

# Resultados:
✓ Button renders correctly (12ms)
✓ Button handles click events (8ms)
✓ Input shows validation error (15ms)
✓ getMessage resolves nested paths (5ms)
✓ getMessage interpolates variables (6ms)
✓ getMessage returns path as fallback (4ms)

Tests: 6 passed, 6 total
Coverage: 94%
```

#### Pruebas Manuales

1. Ejecutar `pnpm dev` → Servidor inicia en `localhost:3000`
2. Abrir página principal → Logo y colores de marca visibles
3. Verificar responsive → Layout se adapta a móvil
4. Inspeccionar consola → Sin errores ni warnings

### Capturas de Pantalla

**Página de Inicio (Desktop):**

```
┌─────────────────────────────────────────────────────┐
│  🕐 TimeFlowPro                    [Iniciar sesión] │
├─────────────────────────────────────────────────────┤
│                                                     │
│     Gestión inteligente de agendas                  │
│     para profesionales móviles                      │
│                                                     │
│     [Comenzar ahora]  [Ver demo]                    │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Componentes en Storybook:**

```
┌──────────────────────────────────────┐
│ Button                               │
│ ├── Default    [Guardar]             │
│ ├── Outline    [Cancelar]            │
│ ├── Ghost      [Ver más]             │
│ └── Destructive [Eliminar]           │
└──────────────────────────────────────┘
```

### Checklist

- [x] Código sigue arquitectura hexagonal
- [x] Design tokens aplicados correctamente
- [x] Componentes base funcionan
- [x] Sistema de mensajes configurado
- [x] Husky y commitlint funcionan
- [x] README actualizado con instrucciones de setup
- [x] Sin errores de linting
- [x] Sin errores de TypeScript

---

## 7.2 Pull Request #2: Autenticación con Google

### Título

```
feat(auth): implementar login con Google OAuth2 + sistema de trial
```

### Descripción

#### Resumen

Implementa el flujo completo de autenticación con Google OAuth2 usando Supabase Auth, incluyendo el sistema automático de trial de 14 días para nuevos profesionales.

#### Motivación

La autenticación con Google reduce la fricción de registro (no hay contraseñas que recordar) y aprovecha la integración nativa con Google Calendar que implementaremos en Sprint 5.

#### Cambios Realizados

**Backend:**

- Configuración de Google OAuth en Supabase
- Trigger `handle_new_user` para crear perfil automáticamente
- Campo `trial_expires_at` se establece a +14 días
- Campo `account_status` inicia como `trial`
- RLS policies para proteger datos de perfil

**Frontend:**

- Página de login con botón "Continuar con Google"
- Manejo de callback OAuth
- Hook `useAuth` para estado de autenticación
- Redirect automático tras login exitoso
- Componente `Alert` para errores

**Middleware:**

- Verificación de sesión en rutas protegidas
- Redirect a login si no autenticado
- Banner de trial visible cuando quedan < 7 días

**Sistema de Trial:**

- Edge Function `expire-trials` (cron diario)
- Cambia `account_status` a `readonly` cuando expira
- Envía notificación al admin

**Mensajes (messages.es.yml):**

```yaml
auth:
  login:
    title: 'Iniciar sesión'
    withGoogle: 'Continuar con Google'
    success: '¡Bienvenido!'
account:
  trial:
    daysRemaining: 'Te quedan {days} días de prueba'
    expired: 'Tu período de prueba ha expirado'
```

### Tickets Relacionados

```
Closes #T-1-01
Closes #T-1-02
Closes #T-1-03
Closes #T-1-04
Closes #T-1-06
```

### Plan de Pruebas

#### Tests Unitarios

```bash
pnpm test src/services/auth

# Resultados:
✓ AuthService handles Google callback (45ms)
✓ AuthService creates profile on signup (32ms)
✓ AuthService sets trial expiration (28ms)
✓ useAuth returns user state (15ms)
✓ useAuth handles logout (18ms)

Tests: 5 passed, 5 total
Coverage: 92%
```

#### Tests de Integración

```bash
pnpm test:integration src/services/auth

# Resultados:
✓ Google OAuth flow completes successfully (1.2s)
✓ New user gets trial status (0.8s)
✓ Middleware redirects unauthenticated users (0.3s)

Tests: 3 passed, 3 total
```

#### Pruebas Manuales

1. Click en "Continuar con Google"
2. Seleccionar cuenta de Google
3. Verificar redirect a dashboard
4. Verificar perfil creado en BD
5. Verificar `trial_expires_at` = +14 días

### Capturas de Pantalla

**Página de Login:**

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│           🕐 TimeFlowPro                            │
│                                                     │
│           Iniciar sesión                            │
│           Accede a tu cuenta                        │
│                                                     │
│     ┌─────────────────────────────────────────┐     │
│     │  🔵 Continuar con Google                │     │
│     └─────────────────────────────────────────┘     │
│                                                     │
│           ¿Nuevo aquí? Obtén 14 días gratis         │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Banner de Trial:**

```
┌─────────────────────────────────────────────────────┐
│ ⚠️ Te quedan 5 días de prueba. Contacta al admin   │
│    para activar tu cuenta completa.         [X]    │
└─────────────────────────────────────────────────────┘
```

**Respuesta de API (signup):**

```json
{
  "user": {
    "id": "uuid-1234",
    "email": "felipe@example.com",
    "user_metadata": {
      "full_name": "Felipe González",
      "avatar_url": "https://..."
    }
  },
  "session": {
    "access_token": "eyJ...",
    "expires_at": 1704326400
  }
}
```

### Checklist

- [x] OAuth flow funciona end-to-end
- [x] Perfil se crea automáticamente
- [x] Trial de 14 días asignado
- [x] Rutas protegidas funcionan
- [x] Banner de trial visible
- [x] Edge Function de expiración configurada
- [x] Mensajes en español
- [x] Tests pasando (unit + integration)
- [x] Sin errores de linting

---

## 7.3 Pull Request #3: Calendario y Gestión de Citas

### Título

```
feat(calendar): implementar vista de calendario + crear/editar citas
```

### Descripción

#### Resumen

Implementa la vista principal del calendario con visualización de citas, travel blocks y bloqueos personales. Incluye el modal de creación de citas con selector de cliente, servicio, ubicación y horario basado en disponibilidad real.

#### Motivación

El calendario es el corazón de TimeFlowPro. Esta implementación:

- Muestra la agenda diaria/semanal del profesional
- Visualiza tiempos de traslado como bloques diferenciados
- Permite crear citas considerando disponibilidad real
- Aplica duración adaptativa basada en historial del cliente

#### Cambios Realizados

**Motor de Disponibilidad (Backend):**

```typescript
// Considera:
- Horarios de trabajo por ubicación
- Citas existentes
- Travel blocks
- Bloqueos personales
- Duración del servicio (adaptativa si hay historial)
- Tiempo de traslado entre ubicaciones
```

**Vista de Calendario (Frontend):**

- Vista diaria con timeline vertical
- Vista semanal con grid de días
- Código de colores:
  - 🔵 Citas confirmadas
  - 🟡 Travel blocks
  - 🟣 Bloqueos personales
  - ⚪ Slots disponibles
- Click en cita → Ver/editar detalles
- Click en slot vacío → Crear cita

**Modal de Crear Cita:**

- Selector de cliente (con búsqueda)
- Selector de servicio
- Selector de ubicación
- Selector de fecha
- Slots disponibles para ese día
- Duración sugerida (si hay historial)
- Notas opcionales

**Travel Blocks Automáticos:**

- Al crear cita, calcula si necesita traslado
- Bloquea tiempo previo automáticamente
- Se visualiza en calendario con color diferenciado

**Mensajes (messages.es.yml):**

```yaml
calendar:
  title: 'Calendario'
  today: 'Hoy'
  travelBlock: 'Tiempo de traslado'
appointments:
  create:
    success: 'Cita creada exitosamente'
  fields:
    client: 'Cliente'
    service: 'Servicio'
```

### Tickets Relacionados

```
Closes #T-3-03
Closes #T-3-04
Closes #T-3-05
Closes #T-3-06
```

### Plan de Pruebas

#### Tests Unitarios

```bash
pnpm test src/services/availability

# Resultados:
✓ calculates available slots correctly (35ms)
✓ excludes existing appointments (28ms)
✓ excludes travel blocks (22ms)
✓ excludes personal blocks (20ms)
✓ considers working hours (25ms)
✓ applies adaptive duration (30ms)

Tests: 6 passed, 6 total
Coverage: 91%
```

#### Tests de Integración

```bash
pnpm test:integration src/services/appointments

# Resultados:
✓ creates appointment with travel block (1.5s)
✓ prevents double booking (0.8s)
✓ applies RLS correctly (0.6s)

Tests: 3 passed, 3 total
```

#### Pruebas Manuales

1. Abrir calendario → Ver citas del día
2. Click en slot vacío → Abre modal de crear
3. Seleccionar cliente, servicio, ubicación
4. Ver slots disponibles filtrados
5. Crear cita → Aparece en calendario
6. Verificar travel block si aplica

### Capturas de Pantalla

**Vista de Calendario (Día):**

```
┌─────────────────────────────────────────────────────┐
│  📅 Miércoles 15 de Enero          [< Hoy >]       │
├─────────────────────────────────────────────────────┤
│ 09:00 │ ┌───────────────────────────────┐           │
│       │ │ 🔵 Juan Pérez                 │           │
│       │ │    Kinesiología - Iron Gym    │           │
│ 09:45 │ └───────────────────────────────┘           │
│       │                                             │
│ 10:45 │ ┌───────────────────────────────┐           │
│       │ │ 🟡 Traslado a Hotel           │           │
│ 11:05 │ └───────────────────────────────┘           │
│       │                                             │
│ 12:30 │ ┌───────────────────────────────┐           │
│       │ │ 🔵 María López                │           │
│       │ │    Masaje - Hotel Viejas Esc. │           │
│ 13:00 │ └───────────────────────────────┘           │
│       │                                             │
│ 13:00 │ ┌───────────────────────────────┐           │
│       │ │ 🟣 Almuerzo                   │           │
│ 14:00 │ └───────────────────────────────┘           │
└─────────────────────────────────────────────────────┘
```

**Modal Crear Cita:**

```
┌─────────────────────────────────────────────────────┐
│  ➕ Nueva cita                               [X]    │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Cliente      [🔍 Buscar cliente...           ▼]   │
│               [+ Nuevo cliente]                     │
│                                                     │
│  Servicio     [Kinesiología                   ▼]   │
│               ⏱️ 45 min (sugerido: 30 min)         │
│                                                     │
│  Ubicación    [Iron Gym                       ▼]   │
│                                                     │
│  Fecha        [15/01/2026                     📅]   │
│                                                     │
│  Horario      [09:00] [09:30] [10:00] [10:30]      │
│               [14:00] [14:30] [15:00] ...          │
│                                                     │
│  Notas        [                               ]     │
│                                                     │
├─────────────────────────────────────────────────────┤
│            [Cancelar]  [Crear cita]                 │
└─────────────────────────────────────────────────────┘
```

**Respuesta API (crear cita):**

```json
{
  "id": "apt-uuid-5678",
  "client_id": "cli-uuid-1234",
  "service_id": "srv-uuid-9999",
  "location_id": "loc-uuid-7777",
  "start_time": "2026-01-15T09:00:00-03:00",
  "end_time": "2026-01-15T09:45:00-03:00",
  "duration_minutes": 45,
  "status": "confirmed",
  "travel_block": {
    "id": "tb-uuid-1111",
    "start_time": "2026-01-15T08:40:00-03:00",
    "end_time": "2026-01-15T09:00:00-03:00",
    "duration_minutes": 20
  }
}
```

### Checklist

- [x] Vista de calendario renderiza correctamente
- [x] Código de colores aplicado
- [x] Modal de crear cita funciona
- [x] Motor de disponibilidad calcula slots
- [x] Travel blocks se crean automáticamente
- [x] Duración adaptativa aplicada
- [x] Mensajes en español via YML
- [x] Tests pasando (unit + integration)
- [x] Sin errores de linting
- [x] Responsive en móvil

---

## 7.4 Plantilla para Nuevos PRs

```markdown
## Título
```

[tipo]([scope]): [descripción corta]

```

### Descripción

#### Resumen
[Qué hace este PR]

#### Motivación
[Por qué es necesario]

#### Cambios Realizados
- [Cambio 1]
- [Cambio 2]

### Tickets Relacionados
```

Closes #T-X-XX

```

### Plan de Pruebas

#### Tests Unitarios
[Resultados]

#### Pruebas Manuales
[Pasos]

### Capturas de Pantalla
[Screenshots o JSON]

### Checklist
- [ ] Código sigue guía de estilo
- [ ] Tests añadidos/actualizados
- [ ] Documentación actualizada
- [ ] Sin errores de linting
- [ ] Sin errores de TypeScript
- [ ] Mensajes en español via YML
```

---

## 7.5 Checklist de Validación de PRs

| Criterio             | Verificación                                |
| -------------------- | ------------------------------------------- |
| **Trazabilidad**     | ¿El PR menciona `Closes #T-X-XX`?           |
| **Título Semántico** | ¿Usa Conventional Commits (feat/fix/chore)? |
| **Descripción**      | ¿Explica el "qué" y el "por qué"?           |
| **Tests**            | ¿Menciona qué tests se añadieron?           |
| **Evidencia**        | ¿Incluye screenshots o respuestas JSON?     |
| **Idioma**           | ¿Todos los mensajes de usuario en español?  |
| **Checklist**        | ¿El autor verificó linting y tipos?         |

---

**Última actualización:** Enero 2026  
**Versión del documento:** 1.0.0  
**Autor:** TimeFlowPro Team
