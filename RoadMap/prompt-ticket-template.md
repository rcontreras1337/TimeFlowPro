# 🎫 Prompt Template para Implementación de Tickets

## Instrucciones de Uso

1. Copia todo el contenido de este archivo
2. Reemplaza los valores entre `{{...}}` con los datos reales
3. Pega en Cursor/Claude para comenzar la implementación

---

## 📋 PROMPT PARA IA

```markdown
# Contexto del Proyecto

Estoy trabajando en **TimeFlowPro**, un sistema de agendamiento inteligente para profesionales móviles.

## Stack Tecnológico
- **Frontend:** Next.js 14 (App Router) + TailwindCSS + TypeScript
- **Backend:** Supabase (PostgreSQL + Auth + Edge Functions)
- **Hosting:** Vercel
- **Estilo de código:** Arquitectura Hexagonal, DDD, SOLID, DRY

## Idioma
- **Código:** Variables, funciones y comentarios técnicos en **inglés**
- **Mensajes al usuario:** Todo en **español** (usar archivo de mensajes `messages.es.yml`)
- **Base de datos:** Nombres de tablas y columnas en **inglés**, datos en **español**

---

# Ticket a Implementar

**ID:** {{TICKET_ID}}
**Sprint:** {{SPRINT_NUMBER}}
**Tipo:** {{TIPO}} (Frontend/Backend/Infra/Database)
**Prioridad:** {{PRIORIDAD}}

## Descripción
{{DESCRIPCION_DEL_TICKET}}

## Archivos de Referencia
Por favor, lee estos archivos antes de comenzar:
- `Documentacion/6-TicketsTrabajo.md` - Busca el ticket {{TICKET_ID}} para ver todos los detalles
- `Documentacion/2-ArquitecturaSistema.md` - Para seguir la arquitectura definida
- `Documentacion/3-ModeloDatos.md` - Para referencias de BD
- `Documentacion/4-HistoriasUsuario.md` - HDU relacionada: {{HDU_RELACIONADA}}

## Criterios de Aceptación
{{CRITERIOS_DE_ACEPTACION}}

---

# Instrucciones Específicas

1. **Sigue exactamente** la estructura de carpetas definida en la arquitectura
2. **Usa los componentes base** ya creados (Button, Input, Card, etc.)
3. **Implementa los tests** especificados en el ticket
4. **Usa el archivo de mensajes** (`src/lib/messages/messages.es.yml`) para textos de usuario
5. **Valida con Zod** todas las entradas de datos
6. **Aplica RLS** en todas las queries de Supabase
7. **Documenta** funciones públicas con JSDoc

## Mensajes de Usuario
Todos los mensajes que se muestren al usuario deben:
- Estar en español
- Venir del archivo `messages.es.yml`
- Usar el helper `getMessage('key.path')`

Ejemplo:
```typescript
import { getMessage } from '@/lib/messages'

// En vez de:
toast.success('Cita creada exitosamente')

// Usar:
toast.success(getMessage('appointments.create.success'))
```

## Commits
Usa Conventional Commits en español:
- `feat({{MODULO}}): {{descripción}}`
- `fix({{MODULO}}): {{descripción}}`
- `test({{MODULO}}): {{descripción}}`

---

# Entregables Esperados

1. [ ] Código implementado según especificación
2. [ ] Tests unitarios pasando
3. [ ] Tests de integración pasando (si aplica)
4. [ ] Sin errores de linting
5. [ ] Sin errores de TypeScript
6. [ ] Mensajes de usuario en español via YML

---

# Dependencias del Ticket

**Bloqueado por:** {{TICKETS_BLOQUEADORES}}
**Bloquea a:** {{TICKETS_BLOQUEADOS}}

---

¿Listo para comenzar? Por favor:
1. Lee los archivos de referencia
2. Confirma que entiendes los requisitos
3. Propón un plan de implementación
4. Comienza con el código
```

---

## 📝 Ejemplo de Uso Completo

```markdown
# Contexto del Proyecto

Estoy trabajando en **TimeFlowPro**, un sistema de agendamiento inteligente para profesionales móviles.

## Stack Tecnológico
- **Frontend:** Next.js 14 (App Router) + TailwindCSS + TypeScript
- **Backend:** Supabase (PostgreSQL + Auth + Edge Functions)
- **Hosting:** Vercel
- **Estilo de código:** Arquitectura Hexagonal, DDD, SOLID, DRY

## Idioma
- **Código:** Variables, funciones y comentarios técnicos en **inglés**
- **Mensajes al usuario:** Todo en **español** (usar archivo de mensajes `messages.es.yml`)
- **Base de datos:** Nombres de tablas y columnas en **inglés**, datos en **español**

---

# Ticket a Implementar

**ID:** T-1-03
**Sprint:** 1
**Tipo:** Frontend
**Prioridad:** 🔴 P0 (Crítica)

## Descripción
Crear la página de login con diseño moderno, botón de Google Sign-In, manejo de errores y estados de carga.

## Archivos de Referencia
Por favor, lee estos archivos antes de comenzar:
- `Documentacion/6-TicketsTrabajo.md` - Busca el ticket T-1-03 para ver todos los detalles
- `Documentacion/2-ArquitecturaSistema.md` - Para seguir la arquitectura definida
- `Documentacion/3-ModeloDatos.md` - Para referencias de BD
- `Documentacion/4-HistoriasUsuario.md` - HDU relacionada: US-01

## Criterios de Aceptación
- [ ] Página de login renderiza correctamente
- [ ] Botón de Google funciona
- [ ] Estados de carga visibles
- [ ] Errores se muestran con toast
- [ ] Redirect a dashboard tras login exitoso
- [ ] Responsive en móvil

---

# Instrucciones Específicas
(... resto igual ...)

---

¿Listo para comenzar?
```

---

## 🏷️ Variables del Template

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `{{TICKET_ID}}` | ID del ticket | `T-1-03` |
| `{{SPRINT_NUMBER}}` | Número del sprint | `1` |
| `{{TIPO}}` | Tipo de ticket | `Frontend` |
| `{{PRIORIDAD}}` | Nivel de prioridad | `🔴 P0 (Crítica)` |
| `{{DESCRIPCION_DEL_TICKET}}` | Descripción completa | (ver ticket) |
| `{{HDU_RELACIONADA}}` | Historia de usuario | `US-01` |
| `{{CRITERIOS_DE_ACEPTACION}}` | Lista de criterios | (ver ticket) |
| `{{MODULO}}` | Módulo afectado | `auth`, `calendar` |
| `{{TICKETS_BLOQUEADORES}}` | Tickets que bloquean | `T-1-01, T-1-02` |
| `{{TICKETS_BLOQUEADOS}}` | Tickets bloqueados | `T-1-04` |

---

**Última actualización:** Enero 2026

