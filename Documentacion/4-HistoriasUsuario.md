# 4. Historias de Usuario - TimeFlowPro

---

## 4.0 Estructura Base de Historias de Usuario

### Plantilla Estándar

Cada Historia de Usuario sigue esta estructura para garantizar completitud y trazabilidad:

```markdown
## US-[ID]: [Título Descriptivo]

### Definición
**Como** [rol del usuario],
**quiero** [acción o funcionalidad],
**para** [beneficio o valor que obtengo].

### Criterios de Aceptación (Gherkin)
**Escenario N: [Nombre descriptivo]**
- **Dado que** [contexto inicial]
- **Cuando** [acción del usuario]
- **Entonces** [resultado esperado]

### Prioridad y Estimación
| Prioridad | Estimación | Dependencias |
|-----------|------------|--------------|
| Alta/Media/Baja | S/M/L (1-8 pts) | US-XX, US-YY |

### Especificación de Tests
| Tipo | Descripción | Ubicación |
|------|-------------|-----------|
| Unit | [Qué se testea unitariamente] | `tests/unit/...` |
| Integration | [Qué integración se valida] | `tests/integration/...` |
| E2E | [Flujo completo a validar] | `tests/e2e/...` (Solo Local) |

### Referencias Técnicas
- Modelo de Datos: [Tablas involucradas]
- API Endpoints: [Endpoints relacionados]
- Componentes UI: [Vistas/componentes]
```

---

## 4.1 Resumen de Historias por Fase

### Fase 1: MVP

| ID | Título | Actor | Prioridad | Estimación | Sprint |
|----|--------|-------|-----------|------------|--------|
| US-01 | Registro y Login con Google | Profesional | 🔴 Crítica | M (5 pts) | 1 |
| US-02 | Gestión de Perfil Profesional | Profesional | 🔴 Crítica | S (3 pts) | 1 |
| US-03 | Gestión de Ubicaciones | Profesional | 🔴 Crítica | M (5 pts) | 1 |
| US-04 | Gestión de Servicios | Profesional | 🔴 Crítica | M (5 pts) | 1 |
| US-05 | Gestión de Clientes | Profesional | 🔴 Crítica | M (5 pts) | 2 |
| US-06 | Configurar Horarios por Ubicación | Profesional | 🔴 Crítica | M (5 pts) | 2 |
| US-07 | Configurar Tiempos de Traslado | Profesional | 🟡 Alta | S (3 pts) | 2 |
| US-08 | Crear Cita Manual | Profesional | 🔴 Crítica | L (8 pts) | 3 |
| US-09 | Ver Calendario con Citas y Traslados | Profesional | 🔴 Crítica | L (8 pts) | 3 |
| US-10 | Duración Adaptativa por Cliente | Profesional | 🟡 Alta | M (5 pts) | 3 |
| US-11 | Completar/Cancelar Cita | Profesional | 🔴 Crítica | M (5 pts) | 4 |
| US-12 | Portal Público de Reservas | Cliente | 🔴 Crítica | L (8 pts) | 4 |
| US-13 | Reservar Cita Online | Cliente | 🔴 Crítica | L (8 pts) | 4 |
| US-14 | Sincronización con Google Calendar | Profesional | 🟡 Alta | L (8 pts) | 5 |
| US-15 | Notificaciones vía Google Calendar | Cliente/Prof | 🟡 Alta | M (5 pts) | 5 |
| US-16 | Configuración de Trial por Superadmin | Superadmin | 🔴 Crítica | S (3 pts) | 1 |
| US-17 | Dashboard de Gestión de Profesionales | Superadmin | 🔴 Crítica | M (5 pts) | 1 |
| US-18 | Notificaciones de Registro y Trial | Superadmin | 🟡 Alta | S (3 pts) | 2 |
| US-19 | Cuenta en Modo Solo Lectura | Sistema | 🔴 Crítica | M (5 pts) | 2 |

**Total MVP:** 19 Historias | ~94 Story Points | ~5 Sprints

### Fase 2: Post-MVP

| ID | Título | Actor | Prioridad | Estimación |
|----|--------|-------|-----------|------------|
| US-20 | Cálculo Automático de Traslado (Google Maps) | Sistema | 🟡 Alta | L (8 pts) |
| US-21 | Sugerencias de Optimización de Jornada | Profesional | 🟢 Media | L (8 pts) |
| US-22 | Pagos con MercadoPago | Cliente | 🟢 Media | L (8 pts) |
| US-23 | Gestión Multi-Profesional (Equipos) | Superadmin | 🟢 Media | L (8 pts) |
| US-24 | Reportes y Estadísticas | Profesional | 🟢 Media | M (5 pts) |
| US-25 | Importación Masiva de Clientes | Profesional | 🟢 Media | S (3 pts) |
| US-26 | Recordatorios Automáticos (WhatsApp) | Sistema | 🟢 Media | L (8 pts) |

---

## 4.2 Historias de Usuario - Fase 1 (MVP)

---

### US-01: Registro y Login con Google (con Trial Automático)

#### Definición

**Como** profesional móvil,  
**quiero** registrarme e iniciar sesión usando mi cuenta de Google,  
**para** acceder rápidamente sin crear otra contraseña y comenzar a usar el sistema inmediatamente.

#### Criterios de Aceptación

**Escenario 1: Primer registro exitoso con trial**
- **Dado que** soy un profesional nuevo sin cuenta
- **Cuando** hago clic en "Continuar con Google" y autorizo
- **Entonces** se crea mi cuenta con los datos de Google (email, nombre, foto)
- **Y** mi cuenta se crea en estado `trial` con fecha de expiración (ej: 7 días)
- **Y** soy redirigido al onboarding de perfil
- **Y** el superadmin recibe notificación de nuevo registro

**Escenario 2: Login de usuario existente activo**
- **Dado que** tengo una cuenta activa o en trial válido
- **Cuando** hago clic en "Continuar con Google"
- **Entonces** accedo directamente a mi dashboard

**Escenario 3: Login con trial expirado**
- **Dado que** mi trial de 7 días expiró y el admin no activó mi cuenta
- **Cuando** inicio sesión
- **Entonces** accedo en modo "solo lectura"
- **Y** veo banner indicando que mi trial expiró
- **Y** puedo ver mis datos pero no crear/editar citas

**Escenario 4: Login con cuenta suspendida**
- **Dado que** el admin suspendió mi cuenta
- **Cuando** intento iniciar sesión
- **Entonces** veo mensaje "Tu cuenta está suspendida. Contacta al administrador."

**Escenario 5: Usuario cancela autorización**
- **Dado que** estoy en la pantalla de login
- **Cuando** cancelo el flujo de Google OAuth
- **Entonces** vuelvo a la pantalla de login con mensaje informativo

**Escenario 6: Email ya registrado con otro método**
- **Dado que** existe una cuenta con mi email pero otro proveedor
- **Cuando** intento registrarme con Google
- **Entonces** veo un mensaje indicando que el email ya está en uso

#### Prioridad y Estimación

| Prioridad | Estimación | Dependencias |
|-----------|------------|--------------|
| 🔴 Crítica | M (5 pts) | Ninguna |

#### Especificación de Tests

| Tipo | Descripción | Ubicación |
|------|-------------|-----------|
| Unit | Validación de datos de perfil creados desde Google | `tests/unit/auth/google-profile-mapper.test.ts` |
| Unit | Cálculo de fecha de expiración de trial | `tests/unit/auth/trial-expiration.test.ts` |
| Unit | Manejo de estados de cuenta (trial, active, suspended, readonly) | `tests/unit/auth/account-status.test.ts` |
| Integration | Flujo completo OAuth → Supabase → Profile con trial | `tests/integration/auth/google-auth-flow.test.ts` |
| Integration | Notificación a admin en registro | `tests/integration/auth/admin-notification.test.ts` |
| E2E | Usuario nuevo se registra y ve días restantes de trial | `tests/e2e/auth/new-user-registration.spec.ts` |

#### Referencias Técnicas

- **Modelo de Datos:** `profiles` (campos: `account_status`, `trial_expires_at`), `auth.users`
- **API:** Supabase Auth (Google OAuth)
- **Componentes UI:** `LoginPage`, `AuthButton`, `OnboardingFlow`, `TrialBanner`, `ReadOnlyBanner`

---

### US-02: Gestión de Perfil Profesional

#### Definición

**Como** profesional registrado,  
**quiero** completar y editar mi perfil (nombre, teléfono, slug público, zona horaria),  
**para** personalizar mi página de reservas y configurar mi operación.

#### Criterios de Aceptación

**Escenario 1: Completar perfil en onboarding**
- **Dado que** acabo de registrarme y estoy en onboarding
- **Cuando** ingreso mi nombre comercial, teléfono y elijo un slug
- **Entonces** mi perfil se guarda y puedo continuar configurando ubicaciones

**Escenario 2: Slug único validado**
- **Dado que** estoy eligiendo mi slug (ej: "felipe-kine")
- **Cuando** escribo un slug que ya existe
- **Entonces** veo un error "Este nombre ya está en uso" en tiempo real

**Escenario 3: Editar perfil existente**
- **Dado que** tengo un perfil completo
- **Cuando** cambio mi teléfono y guardo
- **Entonces** los cambios se reflejan inmediatamente

**Escenario 4: Cambiar zona horaria**
- **Dado que** me mudé a otra zona horaria
- **Cuando** cambio de "America/Santiago" a "America/Buenos_Aires"
- **Entonces** todas mis citas futuras se muestran en la nueva zona

#### Prioridad y Estimación

| Prioridad | Estimación | Dependencias |
|-----------|------------|--------------|
| 🔴 Crítica | S (3 pts) | US-01 |

#### Especificación de Tests

| Tipo | Descripción | Ubicación |
|------|-------------|-----------|
| Unit | Validación de formato de slug | `tests/unit/profile/slug-validation.test.ts` |
| Unit | Validación de teléfono | `tests/unit/profile/phone-validation.test.ts` |
| Integration | CRUD de perfil con Supabase | `tests/integration/profile/profile-crud.test.ts` |
| E2E | Onboarding completo de nuevo usuario | `tests/e2e/onboarding/complete-profile.spec.ts` |

#### Referencias Técnicas

- **Modelo de Datos:** `profiles`
- **API Endpoints:** `PATCH /profiles/:id`
- **Componentes UI:** `ProfileForm`, `SlugInput`, `TimezoneSelector`

---

### US-03: Gestión de Ubicaciones

#### Definición

**Como** profesional móvil,  
**quiero** agregar, editar y eliminar mis ubicaciones de trabajo,  
**para** que los clientes sepan dónde puedo atenderlos.

#### Criterios de Aceptación

**Escenario 1: Agregar nueva ubicación**
- **Dado que** estoy en la sección de ubicaciones
- **Cuando** creo una ubicación con nombre "Iron Gym" y dirección
- **Entonces** la ubicación aparece en mi lista activa

**Escenario 2: Agregar ubicación con coordenadas**
- **Dado que** estoy creando una ubicación
- **Cuando** ingreso la dirección
- **Entonces** el sistema sugiere autocompletar y guarda lat/lng

**Escenario 3: Desactivar ubicación**
- **Dado que** temporalmente no trabajo en "Hotel VE"
- **Cuando** desactivo la ubicación
- **Entonces** no aparece en el portal de reservas
- **Y** las citas existentes no se afectan

**Escenario 4: Eliminar ubicación con citas futuras**
- **Dado que** intento eliminar "Iron Gym" que tiene citas agendadas
- **Cuando** confirmo la eliminación
- **Entonces** el sistema advierte sobre las citas afectadas
- **Y** debo reasignar o cancelar antes de eliminar

**Escenario 5: Ordenar ubicaciones**
- **Dado que** tengo 3 ubicaciones
- **Cuando** arrastro "Domicilio" al primer lugar
- **Entonces** el orden se refleja en el portal de reservas

#### Prioridad y Estimación

| Prioridad | Estimación | Dependencias |
|-----------|------------|--------------|
| 🔴 Crítica | M (5 pts) | US-02 |

#### Especificación de Tests

| Tipo | Descripción | Ubicación |
|------|-------------|-----------|
| Unit | Validación de campos de ubicación | `tests/unit/locations/location-validation.test.ts` |
| Unit | Lógica de ordenamiento | `tests/unit/locations/location-ordering.test.ts` |
| Integration | CRUD ubicaciones con RLS | `tests/integration/locations/location-crud.test.ts` |
| Integration | Verificación de citas antes de eliminar | `tests/integration/locations/location-delete-check.test.ts` |
| E2E | Profesional crea y ordena 3 ubicaciones | `tests/e2e/locations/manage-locations.spec.ts` |

#### Referencias Técnicas

- **Modelo de Datos:** `locations`, `appointments`
- **API Endpoints:** `GET/POST/PATCH/DELETE /locations`
- **Componentes UI:** `LocationsList`, `LocationForm`, `LocationCard`

---

### US-04: Gestión de Servicios

#### Definición

**Como** profesional,  
**quiero** definir los servicios que ofrezco con nombre, duración base, precio y color,  
**para** que mis clientes puedan elegirlos al reservar.

#### Criterios de Aceptación

**Escenario 1: Crear servicio básico**
- **Dado que** estoy configurando mis servicios
- **Cuando** creo "Sesión de Kinesiología" con 45 min y $25.000
- **Entonces** el servicio aparece disponible para agendar

**Escenario 2: Servicio con tiempo buffer**
- **Dado que** necesito 10 minutos entre sesiones para preparar
- **Cuando** configuro buffer_time = 10 min
- **Entonces** al agendar, el sistema bloquea 45 + 10 = 55 min

**Escenario 3: Desactivar servicio para reservas online**
- **Dado que** "Evaluación Inicial" solo la agendo yo
- **Cuando** desactivo "allow_online_booking"
- **Entonces** el servicio no aparece en el portal público
- **Pero** yo puedo agendarlo manualmente

**Escenario 4: Asociar servicio a ubicaciones específicas**
- **Dado que** "Masaje Deportivo" solo lo hago en el gimnasio
- **Cuando** lo asocio solo a "Iron Gym"
- **Entonces** solo aparece disponible en esa ubicación

#### Prioridad y Estimación

| Prioridad | Estimación | Dependencias |
|-----------|------------|--------------|
| 🔴 Crítica | M (5 pts) | US-03 |

#### Especificación de Tests

| Tipo | Descripción | Ubicación |
|------|-------------|-----------|
| Unit | Cálculo de duración con buffer | `tests/unit/services/duration-with-buffer.test.ts` |
| Unit | Validación de precio (no negativo) | `tests/unit/services/price-validation.test.ts` |
| Integration | Asociación servicio-ubicación | `tests/integration/services/service-location.test.ts` |
| E2E | Crear servicio y verificar en portal | `tests/e2e/services/create-service-flow.spec.ts` |

#### Referencias Técnicas

- **Modelo de Datos:** `services`, `location_services`
- **API Endpoints:** `GET/POST/PATCH/DELETE /services`
- **Componentes UI:** `ServicesList`, `ServiceForm`, `ServiceCard`

---

### US-05: Gestión de Clientes

#### Definición

**Como** profesional,  
**quiero** registrar y gestionar mis clientes con nombre, contacto y notas,  
**para** tener un historial centralizado.

#### Criterios de Aceptación

**Escenario 1: Crear cliente manualmente**
- **Dado que** tengo un nuevo cliente llamado "Juan Pérez"
- **Cuando** lo registro con email y teléfono
- **Entonces** aparece en mi lista de clientes

**Escenario 2: Cliente creado automáticamente por reserva online**
- **Dado que** un cliente nuevo reserva por el portal
- **Cuando** completa su reserva
- **Entonces** se crea automáticamente con source = "online_booking"

**Escenario 3: Buscar cliente**
- **Dado que** tengo 50+ clientes
- **Cuando** busco "Pér"
- **Entonces** aparecen todos los que coinciden (búsqueda fuzzy)

**Escenario 4: Agregar notas a cliente**
- **Dado que** Juan tiene una lesión crónica
- **Cuando** agrego nota "Lesión lumbar L4-L5, evitar rotación"
- **Entonces** la nota aparece al crear citas con él

**Escenario 5: Eliminar cliente (soft delete)**
- **Dado que** Juan ya no es cliente
- **Cuando** lo elimino
- **Entonces** no aparece en búsquedas
- **Pero** su historial de citas se mantiene

#### Prioridad y Estimación

| Prioridad | Estimación | Dependencias |
|-----------|------------|--------------|
| 🔴 Crítica | M (5 pts) | US-02 |

#### Especificación de Tests

| Tipo | Descripción | Ubicación |
|------|-------------|-----------|
| Unit | Búsqueda fuzzy de clientes | `tests/unit/clients/client-search.test.ts` |
| Unit | Validación de email/teléfono | `tests/unit/clients/client-validation.test.ts` |
| Integration | Soft delete y restauración | `tests/integration/clients/client-soft-delete.test.ts` |
| Integration | Creación automática por reserva | `tests/integration/clients/auto-create-client.test.ts` |
| E2E | CRUD completo de clientes | `tests/e2e/clients/manage-clients.spec.ts` |

#### Referencias Técnicas

- **Modelo de Datos:** `clients`
- **API Endpoints:** `GET/POST/PATCH/DELETE /clients`
- **Componentes UI:** `ClientsList`, `ClientForm`, `ClientSearch`, `ClientNotes`

---

### US-06: Configurar Horarios por Ubicación

#### Definición

**Como** profesional,  
**quiero** definir mis horarios de trabajo para cada ubicación,  
**para** que solo se muestren disponibilidades en esos rangos.

#### Criterios de Aceptación

**Escenario 1: Configurar horario semanal**
- **Dado que** trabajo en Iron Gym de lunes a viernes
- **Cuando** configuro 09:00-13:00 para L-V
- **Entonces** solo esos bloques aparecen disponibles

**Escenario 2: Horario diferente por día**
- **Dado que** los viernes salgo más temprano
- **Cuando** configuro viernes 09:00-12:00
- **Entonces** el viernes muestra menos disponibilidad

**Escenario 3: Ubicación sin horario definido**
- **Dado que** "Domicilio" es flexible
- **Cuando** no configuro horario
- **Entonces** no aparece en disponibilidad automática
- **Pero** puedo crear citas manuales

**Escenario 4: Horario en zona horaria correcta**
- **Dado que** mi zona horaria es America/Santiago
- **Cuando** configuro 09:00
- **Entonces** un cliente en otra zona ve la hora convertida

#### Prioridad y Estimación

| Prioridad | Estimación | Dependencias |
|-----------|------------|--------------|
| 🔴 Crítica | M (5 pts) | US-03 |

#### Especificación de Tests

| Tipo | Descripción | Ubicación |
|------|-------------|-----------|
| Unit | Validación de rangos horarios | `tests/unit/working-hours/time-range-validation.test.ts` |
| Unit | Conversión de zona horaria | `tests/unit/working-hours/timezone-conversion.test.ts` |
| Integration | CRUD de horarios con ubicación | `tests/integration/working-hours/working-hours-crud.test.ts` |
| E2E | Configurar horarios y ver en calendario | `tests/e2e/working-hours/configure-schedule.spec.ts` |

#### Referencias Técnicas

- **Modelo de Datos:** `working_hours`, `locations`
- **API Endpoints:** `GET/POST/PATCH /locations/:id/working-hours`
- **Componentes UI:** `WeeklySchedule`, `TimeRangePicker`, `ScheduleGrid`

---

### US-07: Configurar Tiempos de Traslado

#### Definición

**Como** profesional con múltiples ubicaciones,  
**quiero** definir cuánto tardo en trasladarme entre cada par de ubicaciones,  
**para** que el sistema bloquee ese tiempo automáticamente.

#### Criterios de Aceptación

**Escenario 1: Configurar tiempo entre dos ubicaciones**
- **Dado que** tardo 20 minutos de Iron Gym a Hotel VE
- **Cuando** configuro travel_time = 20 min
- **Entonces** al agendar consecutivamente, se bloquean 20 min

**Escenario 2: Configuración simétrica sugerida**
- **Dado que** configuré 20 min de A → B
- **Cuando** voy a configurar B → A
- **Entonces** el sistema sugiere 20 min (puedo cambiar)

**Escenario 3: Sin tiempo configurado = sin bloqueo**
- **Dado que** no he configurado tiempo entre Gym y Domicilio
- **Cuando** agendo consecutivamente en ambos
- **Entonces** el sistema NO bloquea tiempo automáticamente
- **Pero** muestra advertencia de posible conflicto

**Escenario 4: Misma ubicación = sin traslado**
- **Dado que** agendo dos citas seguidas en Iron Gym
- **Cuando** creo la segunda cita
- **Entonces** NO se crea bloque de traslado

#### Prioridad y Estimación

| Prioridad | Estimación | Dependencias |
|-----------|------------|--------------|
| 🟡 Alta | S (3 pts) | US-03 |

#### Especificación de Tests

| Tipo | Descripción | Ubicación |
|------|-------------|-----------|
| Unit | Validación de tiempo positivo | `tests/unit/travel-times/travel-time-validation.test.ts` |
| Unit | Lógica de sugerencia simétrica | `tests/unit/travel-times/symmetric-suggestion.test.ts` |
| Integration | Matriz de tiempos de traslado | `tests/integration/travel-times/travel-matrix.test.ts` |
| E2E | Configurar tiempos y ver bloqueos | `tests/e2e/travel-times/configure-travel.spec.ts` |

#### Referencias Técnicas

- **Modelo de Datos:** `location_travel_times`
- **API Endpoints:** `GET/POST/PATCH /travel-times`
- **Componentes UI:** `TravelTimeMatrix`, `TravelTimeInput`

---

### US-08: Crear Cita Manual

#### Definición

**Como** profesional,  
**quiero** crear citas manualmente seleccionando cliente, servicio, ubicación y horario,  
**para** agendar a clientes que no reservan online (ej: adultos mayores).

#### Criterios de Aceptación

**Escenario 1: Crear cita básica (happy path)**
- **Dado que** tengo un cliente, servicio y ubicación configurados
- **Cuando** creo cita para "Juan" en "Iron Gym" el martes 10:00
- **Entonces** la cita aparece en mi calendario
- **Y** se crea el bloque de traslado si aplica

**Escenario 2: Duración sugerida por historial**
- **Dado que** Juan ha tenido 3 sesiones de 30, 32, 35 min
- **Cuando** creo nueva cita para él
- **Entonces** el sistema sugiere ~32 min (promedio)
- **Y** puedo aceptar o modificar

**Escenario 3: Conflicto de horario**
- **Dado que** tengo cita 10:00-10:45
- **Cuando** intento crear otra 10:30-11:15
- **Entonces** veo error de conflicto con la cita existente

**Escenario 4: Conflicto por tiempo de traslado**
- **Dado que** tengo cita en Hotel 10:00-10:45 y traslado a Gym son 20 min
- **Cuando** intento crear cita en Gym a las 10:50
- **Entonces** veo advertencia: "Necesitas llegar a las 11:05 considerando traslado"

**Escenario 5: Crear cliente nuevo inline**
- **Dado que** el cliente no existe en mi sistema
- **Cuando** escribo "María López" y no hay coincidencias
- **Entonces** puedo crear el cliente inline con datos mínimos

#### Prioridad y Estimación

| Prioridad | Estimación | Dependencias |
|-----------|------------|--------------|
| 🔴 Crítica | L (8 pts) | US-05, US-06, US-07 |

#### Especificación de Tests

| Tipo | Descripción | Ubicación |
|------|-------------|-----------|
| Unit | Detección de conflictos de horario | `tests/unit/appointments/conflict-detection.test.ts` |
| Unit | Cálculo de duración sugerida | `tests/unit/appointments/suggested-duration.test.ts` |
| Unit | Lógica de creación de travel_block | `tests/unit/appointments/travel-block-creation.test.ts` |
| Integration | Crear cita con travel block | `tests/integration/appointments/create-with-travel.test.ts` |
| Integration | Validación de conflictos con RLS | `tests/integration/appointments/conflict-validation.test.ts` |
| E2E | Flujo completo de creación de cita | `tests/e2e/appointments/create-appointment.spec.ts` |

#### Referencias Técnicas

- **Modelo de Datos:** `appointments`, `travel_blocks`, `client_service_durations`
- **API Endpoints:** `POST /appointments`, `GET /availability`
- **Componentes UI:** `AppointmentForm`, `ClientSelector`, `TimeSlotPicker`, `ConflictWarning`

---

### US-09: Ver Calendario con Citas y Traslados

#### Definición

**Como** profesional,  
**quiero** ver mi calendario con citas, bloques de traslado y huecos disponibles,  
**para** tener visibilidad completa de mi jornada.

#### Criterios de Aceptación

**Escenario 1: Vista diaria con citas**
- **Dado que** tengo 3 citas hoy
- **Cuando** abro la vista de calendario del día
- **Entonces** veo las 3 citas con cliente, servicio y ubicación

**Escenario 2: Bloques de traslado visibles**
- **Dado que** hay 20 min de traslado entre cita 1 y 2
- **Cuando** veo el calendario
- **Entonces** el bloque de traslado aparece en color diferente

**Escenario 3: Citas coloreadas por ubicación**
- **Dado que** Iron Gym es azul y Hotel es verde
- **Cuando** veo el calendario
- **Entonces** las citas heredan el color de su ubicación

**Escenario 4: Vista semanal**
- **Dado que** quiero planificar mi semana
- **Cuando** cambio a vista semanal
- **Entonces** veo todas las citas de lun-dom

**Escenario 5: Filtrar por ubicación**
- **Dado que** solo quiero ver citas de Iron Gym
- **Cuando** aplico filtro de ubicación
- **Entonces** solo veo citas de esa ubicación

**Escenario 6: Click en cita muestra detalles**
- **Dado que** veo una cita en el calendario
- **Cuando** hago click en ella
- **Entonces** veo modal con: cliente, servicio, notas, acciones

#### Prioridad y Estimación

| Prioridad | Estimación | Dependencias |
|-----------|------------|--------------|
| 🔴 Crítica | L (8 pts) | US-08 |

#### Especificación de Tests

| Tipo | Descripción | Ubicación |
|------|-------------|-----------|
| Unit | Transformación de datos para calendario | `tests/unit/calendar/calendar-data-transform.test.ts` |
| Unit | Lógica de filtros | `tests/unit/calendar/calendar-filters.test.ts` |
| Integration | Fetch de citas del día/semana | `tests/integration/calendar/fetch-appointments.test.ts` |
| E2E | Navegación entre vistas de calendario | `tests/e2e/calendar/calendar-navigation.spec.ts` |

#### Referencias Técnicas

- **Modelo de Datos:** `appointments`, `travel_blocks`, `locations`
- **API Endpoints:** `GET /appointments?date=X`, `GET /appointments?week=X`
- **Componentes UI:** `CalendarView`, `DayView`, `WeekView`, `AppointmentCard`, `TravelBlockCard`

---

### US-10: Duración Adaptativa por Cliente

#### Definición

**Como** profesional,  
**quiero** que el sistema aprenda y sugiera duraciones basadas en el historial de cada cliente,  
**para** evitar bloques rígidos y optimizar mi agenda.

#### Criterios de Aceptación

**Escenario 1: Primera visita usa duración estándar**
- **Dado que** es la primera sesión de Juan con "Kinesiología"
- **Cuando** creo la cita
- **Entonces** se sugiere la duración del servicio (45 min)

**Escenario 2: Segunda visita usa historial**
- **Dado que** Juan tuvo 1 sesión previa de 35 min
- **Cuando** creo nueva cita
- **Entonces** se sugiere 35 min

**Escenario 3: Promedio de múltiples visitas**
- **Dado que** Juan tuvo sesiones de 30, 35, 32 min
- **Cuando** creo nueva cita
- **Entonces** se sugiere 32 min (promedio redondeado)

**Escenario 4: Historial se actualiza al completar**
- **Dado que** completo una cita de 28 min
- **Cuando** la marco como completada con duration_actual = 28
- **Entonces** el historial se actualiza para próximas sugerencias

**Escenario 5: Profesional puede ignorar sugerencia**
- **Dado que** el sistema sugiere 32 min pero sé que hoy será más larga
- **Cuando** cambio a 50 min y guardo
- **Entonces** la cita se crea con 50 min

#### Prioridad y Estimación

| Prioridad | Estimación | Dependencias |
|-----------|------------|--------------|
| 🟡 Alta | M (5 pts) | US-08 |

#### Especificación de Tests

| Tipo | Descripción | Ubicación |
|------|-------------|-----------|
| Unit | Cálculo de promedio de duraciones | `tests/unit/duration/average-calculation.test.ts` |
| Unit | Redondeo a múltiplos de 5 min | `tests/unit/duration/duration-rounding.test.ts` |
| Integration | Trigger de actualización de historial | `tests/integration/duration/history-update-trigger.test.ts` |
| Integration | Consulta de sugerencia por cliente+servicio | `tests/integration/duration/suggested-duration.test.ts` |
| E2E | Flujo completo: crear, completar, nueva sugerencia | `tests/e2e/duration/adaptive-duration-flow.spec.ts` |

#### Referencias Técnicas

- **Modelo de Datos:** `client_service_durations`, `appointments`
- **API Endpoints:** `GET /clients/:id/suggested-duration?service_id=X`
- **Componentes UI:** `DurationSuggestion`, `DurationInput`
- **Triggers:** `update_client_service_duration()` (ver Sección 3)

---

### US-11: Completar/Cancelar Cita

#### Definición

**Como** profesional,  
**quiero** marcar citas como completadas o canceladas,  
**para** mantener un registro preciso y actualizar el historial.

#### Criterios de Aceptación

**Escenario 1: Completar cita con duración real**
- **Dado que** tengo una cita confirmada
- **Cuando** la marco como "Completada" e ingreso duración real = 35 min
- **Entonces** el status cambia a "completed"
- **Y** se actualiza el historial de duraciones del cliente

**Escenario 2: Cancelar cita por el profesional**
- **Dado que** debo cancelar una cita
- **Cuando** la marco como "Cancelada" con razón "Enfermedad"
- **Entonces** el status cambia a "cancelled"
- **Y** el bloque de traslado asociado se elimina
- **Y** se notifica al cliente (si tiene email)

**Escenario 3: Marcar no-show**
- **Dado que** el cliente no se presentó
- **Cuando** la marco como "No asistió"
- **Entonces** el status cambia a "no_show"
- **Y** NO se actualiza el historial de duraciones

**Escenario 4: Cancelar cita pasada**
- **Dado que** intento cancelar una cita de hace 3 días
- **Cuando** la marco como cancelada
- **Entonces** veo advertencia pero puedo proceder

**Escenario 5: Sincronizar cambio con Google Calendar**
- **Dado que** tengo sincronización activa
- **Cuando** cancelo una cita
- **Entonces** el evento en Google Calendar se actualiza/elimina

#### Prioridad y Estimación

| Prioridad | Estimación | Dependencias |
|-----------|------------|--------------|
| 🔴 Crítica | M (5 pts) | US-08 |

#### Especificación de Tests

| Tipo | Descripción | Ubicación |
|------|-------------|-----------|
| Unit | Transiciones de estado válidas | `tests/unit/appointments/status-transitions.test.ts` |
| Unit | Lógica de actualización de historial | `tests/unit/appointments/history-update-logic.test.ts` |
| Integration | Completar cita actualiza historial | `tests/integration/appointments/complete-appointment.test.ts` |
| Integration | Cancelar cita elimina travel_block | `tests/integration/appointments/cancel-with-travel.test.ts` |
| E2E | Flujo de completar cita | `tests/e2e/appointments/complete-appointment.spec.ts` |

#### Referencias Técnicas

- **Modelo de Datos:** `appointments`, `client_service_durations`, `travel_blocks`
- **API Endpoints:** `PUT /appointments/:id/complete`, `PUT /appointments/:id/cancel`
- **Componentes UI:** `AppointmentActions`, `CompletionModal`, `CancellationModal`

---

### US-12: Portal Público de Reservas

#### Definición

**Como** profesional,  
**quiero** tener una página pública donde mis clientes puedan ver mis servicios y reservar,  
**para** ofrecer autoservicio 24/7 sin depender de WhatsApp o llamadas.

#### Criterios de Aceptación

**Escenario 1: Acceso público por slug**
- **Dado que** mi slug es "felipe-kine"
- **Cuando** alguien accede a `/reservar/felipe-kine`
- **Entonces** ve mi nombre, foto, servicios y ubicaciones activos

**Escenario 2: Solo servicios con booking habilitado**
- **Dado que** tengo 5 servicios, 3 con allow_online_booking = true
- **Cuando** el cliente ve el portal
- **Entonces** solo ve los 3 servicios públicos

**Escenario 3: Selección de ubicación filtra servicios**
- **Dado que** "Masaje" solo está en "Gym"
- **Cuando** el cliente selecciona "Hotel"
- **Entonces** "Masaje" no aparece como opción

**Escenario 4: Vista responsive (móvil)**
- **Dado que** la mayoría accede desde celular
- **Cuando** abren el portal en móvil
- **Entonces** la experiencia es optimizada para touch

**Escenario 5: Portal de profesional inactivo**
- **Dado que** un profesional desactivó su cuenta
- **Cuando** acceden a su portal
- **Entonces** ven mensaje "Este profesional no está disponible"

#### Prioridad y Estimación

| Prioridad | Estimación | Dependencias |
|-----------|------------|--------------|
| 🔴 Crítica | L (8 pts) | US-03, US-04, US-06 |

#### Especificación de Tests

| Tipo | Descripción | Ubicación |
|------|-------------|-----------|
| Unit | Filtrado de servicios por ubicación | `tests/unit/portal/service-location-filter.test.ts` |
| Unit | Validación de slug público | `tests/unit/portal/slug-validation.test.ts` |
| Integration | Fetch de datos públicos del profesional | `tests/integration/portal/public-profile-fetch.test.ts` |
| E2E | Cliente navega portal y ve servicios | `tests/e2e/portal/public-portal-navigation.spec.ts` |

#### Referencias Técnicas

- **Modelo de Datos:** `profiles`, `services`, `locations`, `location_services`
- **API Endpoints:** `GET /public/professionals/:slug`
- **Componentes UI:** `PublicPortal`, `ServiceSelector`, `LocationSelector`
- **Ruta:** `/reservar/[slug]`

---

### US-13: Reservar Cita Online (Sin Necesidad de Cuenta)

#### Definición

**Como** cliente de un profesional,  
**quiero** reservar una cita seleccionando servicio, ubicación, fecha y hora **sin necesidad de crear una cuenta**,  
**para** asegurar mi atención de forma rápida sin llamar por teléfono.

> ⚠️ **Importante:** El cliente **NO necesita registrarse** en el sistema. Solo proporciona nombre, email y teléfono para la reserva.

#### Criterios de Aceptación

**Escenario 1: Reserva exitosa sin cuenta (happy path)**
- **Dado que** soy cliente en el portal de un profesional
- **Cuando** selecciono servicio, ubicación y horario
- **Y** ingreso mi nombre, email y teléfono
- **Entonces** la cita se crea en estado "pending" o "confirmed"
- **Y** recibo confirmación en pantalla
- **Y** NO necesito crear usuario ni contraseña

**Escenario 2: Ver solo slots disponibles**
- **Dado que** el profesional tiene citas de 9:00-10:00 y 11:00-12:00
- **Cuando** veo disponibilidad para ese día
- **Entonces** veo slot 10:00-11:00 disponible (considerando traslados)

**Escenario 3: Cliente nuevo ingresa datos mínimos**
- **Dado que** nunca he reservado con este profesional
- **Cuando** completo la reserva
- **Entonces** solo debo ingresar: nombre, email y teléfono
- **Y** el sistema crea un registro de cliente automáticamente (source = "online_booking")

**Escenario 4: Cliente existente se reconoce por email**
- **Dado que** ya reservé antes con este email
- **Cuando** ingreso el mismo email
- **Entonces** mis datos (nombre, teléfono) se pre-llenan
- **Y** puedo modificarlos si han cambiado

**Escenario 5: Slot seleccionado ya no disponible**
- **Dado que** seleccioné 10:00 pero alguien más reservó mientras
- **Cuando** confirmo mi reserva
- **Entonces** veo mensaje de conflicto y puedo elegir otro horario

**Escenario 6: Confirmación por email**
- **Dado que** completé mi reserva
- **Cuando** la cita se crea
- **Entonces** recibo email de confirmación con detalles de la cita

**Escenario 7: Profesional inactivo/congelado**
- **Dado que** el profesional tiene cuenta suspendida o trial expirado
- **Cuando** intento acceder a su portal de reservas
- **Entonces** veo mensaje "Este profesional no está disponible actualmente"
- **Y** NO puedo ver servicios ni reservar

#### Prioridad y Estimación

| Prioridad | Estimación | Dependencias |
|-----------|------------|--------------|
| 🔴 Crítica | L (8 pts) | US-12 |

#### Especificación de Tests

| Tipo | Descripción | Ubicación |
|------|-------------|-----------|
| Unit | Cálculo de slots disponibles | `tests/unit/availability/slot-calculation.test.ts` |
| Unit | Validación de datos mínimos del cliente | `tests/unit/booking/client-data-validation.test.ts` |
| Integration | Crear cita y cliente desde portal público | `tests/integration/booking/public-booking.test.ts` |
| Integration | Manejo de conflictos concurrentes | `tests/integration/booking/concurrent-booking.test.ts` |
| Integration | Bloqueo de portal para profesional inactivo | `tests/integration/booking/inactive-professional.test.ts` |
| E2E | Flujo completo: cliente sin cuenta reserva exitosamente | `tests/e2e/booking/online-booking-flow.spec.ts` |

#### Referencias Técnicas

- **Modelo de Datos:** `appointments`, `clients` (source = "online_booking"), `working_hours`, `travel_blocks`, `profiles` (account_status)
- **API Endpoints:** `GET /public/availability`, `POST /public/bookings`
- **Componentes UI:** `BookingWizard`, `DatePicker`, `SlotGrid`, `ClientForm` (sin auth), `ConfirmationScreen`, `ProfessionalInactiveMessage`

---

### US-14: Sincronización con Google Calendar

#### Definición

**Como** profesional,  
**quiero** que mis citas se sincronicen con mi Google Calendar,  
**para** ver todo en un solo lugar y recibir notificaciones nativas.

#### Criterios de Aceptación

**Escenario 1: Conectar cuenta de Google Calendar**
- **Dado que** quiero sincronizar
- **Cuando** autorizo acceso a mi calendario de Google
- **Entonces** la conexión queda activa y se guarda el token

**Escenario 2: Nueva cita se crea en GCal**
- **Dado que** tengo sync activa
- **Cuando** creo una cita en TimeFlowPro
- **Entonces** aparece como evento en mi Google Calendar

**Escenario 3: Cancelar cita actualiza GCal**
- **Dado que** cancelo una cita
- **Cuando** el cambio se procesa
- **Entonces** el evento en GCal se elimina o marca cancelado

**Escenario 4: Sincronización bidireccional (opcional MVP)**
- **Dado que** creo evento directo en GCal
- **Cuando** el sistema sincroniza
- **Entonces** el bloque aparece ocupado en TimeFlowPro

**Escenario 5: Desconectar Google Calendar**
- **Dado que** quiero dejar de sincronizar
- **Cuando** desconecto la cuenta
- **Entonces** los tokens se eliminan y no se sincronizan nuevas citas

**Escenario 6: Token expirado se refresca automáticamente**
- **Dado que** mi token de acceso expiró
- **Cuando** el sistema necesita sincronizar
- **Entonces** usa el refresh_token para obtener uno nuevo

#### Prioridad y Estimación

| Prioridad | Estimación | Dependencias |
|-----------|------------|--------------|
| 🟡 Alta | L (8 pts) | US-08, US-11 |

#### Especificación de Tests

| Tipo | Descripción | Ubicación |
|------|-------------|-----------|
| Unit | Mapeo de cita a evento GCal | `tests/unit/gcal/appointment-to-event.test.ts` |
| Unit | Lógica de refresh de token | `tests/unit/gcal/token-refresh.test.ts` |
| Integration | Crear evento en Google Calendar | `tests/integration/gcal/create-event.test.ts` |
| Integration | Actualizar evento en Google Calendar | `tests/integration/gcal/update-event.test.ts` |
| E2E | Conectar GCal y verificar sync | `tests/e2e/gcal/connect-and-sync.spec.ts` |

#### Referencias Técnicas

- **Modelo de Datos:** `google_calendar_tokens`, `google_calendar_events`
- **API Endpoints:** `POST /gcal/connect`, `DELETE /gcal/disconnect`
- **Edge Functions:** `sync-to-gcal`, `gcal-webhook-handler`
- **Componentes UI:** `GoogleCalendarConnect`, `SyncStatus`

---

### US-15: Notificaciones vía Google Calendar

#### Definición

**Como** cliente/profesional,  
**quiero** recibir recordatorios de citas a través de Google Calendar,  
**para** no olvidar mis compromisos.

#### Criterios de Aceptación

**Escenario 1: Cliente recibe invitación**
- **Dado que** un cliente con email reserva una cita
- **Cuando** la cita se sincroniza
- **Entonces** el cliente recibe invitación de calendario

**Escenario 2: Recordatorio configurable**
- **Dado que** el profesional configuró recordatorio de 1 hora antes
- **Cuando** se crea el evento en GCal
- **Entonces** el evento tiene reminder de 60 min

**Escenario 3: Cancelación notifica a cliente**
- **Dado que** el profesional cancela la cita
- **Cuando** se actualiza GCal
- **Entonces** el cliente recibe actualización de cancelación

#### Prioridad y Estimación

| Prioridad | Estimación | Dependencias |
|-----------|------------|--------------|
| 🟡 Alta | M (5 pts) | US-14 |

#### Especificación de Tests

| Tipo | Descripción | Ubicación |
|------|-------------|-----------|
| Unit | Configuración de reminders en evento | `tests/unit/gcal/event-reminders.test.ts` |
| Integration | Envío de invitación a cliente | `tests/integration/gcal/client-invitation.test.ts` |
| E2E | Verificar que cliente recibe notificación | `tests/e2e/gcal/client-notification.spec.ts` |

#### Referencias Técnicas

- **Modelo de Datos:** `appointments`, `clients`, `google_calendar_events`
- **API:** Google Calendar API (attendees, reminders)
- **Componentes UI:** `NotificationSettings`

---

### US-16: Configuración de Trial por Superadmin

#### Definición

**Como** superadmin del sistema,  
**quiero** configurar la duración por defecto del período de prueba (trial),  
**para** controlar cuánto tiempo tienen los nuevos profesionales antes de requerir activación.

#### Criterios de Aceptación

**Escenario 1: Configurar duración de trial por defecto**
- **Dado que** soy superadmin en el panel de configuración
- **Cuando** establezco "Duración de trial" = 14 días
- **Entonces** todos los nuevos registros tendrán 14 días de prueba

**Escenario 2: Valor por defecto inicial**
- **Dado que** el sistema se instala por primera vez
- **Cuando** no hay configuración
- **Entonces** el trial por defecto es 7 días

**Escenario 3: Cambio no afecta trials existentes**
- **Dado que** hay profesionales con trial de 7 días en curso
- **Cuando** cambio la duración a 14 días
- **Entonces** los trials existentes mantienen su fecha original
- **Y** solo los nuevos registros usan 14 días

**Escenario 4: Deshabilitar trial (activación manual requerida)**
- **Dado que** quiero revisar cada registro manualmente
- **Cuando** establezco "Duración de trial" = 0 días
- **Entonces** las nuevas cuentas se crean en estado `pending_activation`
- **Y** requieren activación manual del admin

#### Prioridad y Estimación

| Prioridad | Estimación | Dependencias |
|-----------|------------|--------------|
| 🔴 Crítica | S (3 pts) | US-01 |

#### Especificación de Tests

| Tipo | Descripción | Ubicación |
|------|-------------|-----------|
| Unit | Cálculo de fecha de expiración con config | `tests/unit/admin/trial-config.test.ts` |
| Integration | Aplicación de config a nuevo registro | `tests/integration/admin/trial-config-apply.test.ts` |
| E2E | Admin cambia config y nuevo usuario recibe trial correcto | `tests/e2e/admin/trial-configuration.spec.ts` |

#### Referencias Técnicas

- **Modelo de Datos:** `system_config` (nueva tabla), `profiles`
- **API Endpoints:** `GET/PATCH /admin/config`
- **Componentes UI:** `AdminConfigPanel`, `TrialDurationInput`

---

### US-17: Dashboard de Gestión de Profesionales

#### Definición

**Como** superadmin del sistema,  
**quiero** ver y gestionar todos los profesionales registrados desde un dashboard centralizado,  
**para** activar, suspender o extender trials según sea necesario.

#### Criterios de Aceptación

**Escenario 1: Ver lista de todos los profesionales**
- **Dado que** accedo al dashboard de admin
- **Cuando** veo la sección "Profesionales"
- **Entonces** veo tabla con: nombre, email, estado, fecha registro, días restantes trial

**Escenario 2: Filtrar por estado**
- **Dado que** quiero ver solo trials por vencer
- **Cuando** filtro por "Trial < 3 días"
- **Entonces** veo solo profesionales cuyo trial vence pronto

**Escenario 3: Activar cuenta manualmente**
- **Dado que** un profesional completó su trial y quiero activarlo
- **Cuando** hago clic en "Activar cuenta"
- **Entonces** el estado cambia a `active`
- **Y** el profesional puede usar el sistema sin restricciones

**Escenario 4: Extender trial**
- **Dado que** un profesional necesita más tiempo de prueba
- **Cuando** hago clic en "Extender trial" e ingreso 7 días
- **Entonces** la fecha de expiración se extiende 7 días
- **Y** el profesional recibe notificación

**Escenario 5: Suspender cuenta**
- **Dado que** un profesional no pagó o violó términos
- **Cuando** hago clic en "Suspender cuenta"
- **Entonces** el estado cambia a `suspended`
- **Y** el profesional no puede acceder al sistema
- **Y** su portal de reservas muestra "No disponible"

**Escenario 6: Reactivar cuenta suspendida**
- **Dado que** el profesional regularizó su situación
- **Cuando** hago clic en "Reactivar"
- **Entonces** el estado cambia a `active`

#### Prioridad y Estimación

| Prioridad | Estimación | Dependencias |
|-----------|------------|--------------|
| 🔴 Crítica | M (5 pts) | US-16 |

#### Especificación de Tests

| Tipo | Descripción | Ubicación |
|------|-------------|-----------|
| Unit | Transiciones de estado válidas | `tests/unit/admin/account-status-transitions.test.ts` |
| Unit | Cálculo de días restantes de trial | `tests/unit/admin/trial-days-remaining.test.ts` |
| Integration | CRUD de estados de cuenta | `tests/integration/admin/account-management.test.ts` |
| E2E | Admin activa y suspende profesional | `tests/e2e/admin/manage-professionals.spec.ts` |

#### Referencias Técnicas

- **Modelo de Datos:** `profiles` (account_status, trial_expires_at)
- **API Endpoints:** `GET /admin/professionals`, `PATCH /admin/professionals/:id/status`
- **Componentes UI:** `AdminDashboard`, `ProfessionalsTable`, `StatusActions`, `ExtendTrialModal`

---

### US-18: Notificaciones de Registro y Trial

#### Definición

**Como** superadmin,  
**quiero** recibir notificaciones cuando un profesional se registra o su trial está por vencer,  
**para** tomar acción oportuna.

#### Criterios de Aceptación

**Escenario 1: Email al registrarse nuevo profesional**
- **Dado que** un nuevo profesional se registra
- **Cuando** completa el registro
- **Entonces** el superadmin recibe email con:
  - Nombre y email del profesional
  - Fecha de expiración del trial
  - Link directo al dashboard de admin

**Escenario 2: Dashboard muestra trials por vencer**
- **Dado que** hay 5 profesionales con trial que vence en < 3 días
- **Cuando** el admin abre el dashboard
- **Entonces** ve badge con "5" en sección "Trials por vencer"
- **Y** la lista está ordenada por urgencia (menos días primero)

**Escenario 3: Email de recordatorio de trial por vencer**
- **Dado que** un trial vence en 2 días
- **Cuando** el sistema ejecuta job diario
- **Entonces** el admin recibe email con lista de trials por vencer

**Escenario 4: Configurar umbral de alerta**
- **Dado que** quiero ser notificado con más anticipación
- **Cuando** configuro "Alertar cuando trial < 5 días"
- **Entonces** las notificaciones usan ese umbral

#### Prioridad y Estimación

| Prioridad | Estimación | Dependencias |
|-----------|------------|--------------|
| 🟡 Alta | S (3 pts) | US-17 |

#### Especificación de Tests

| Tipo | Descripción | Ubicación |
|------|-------------|-----------|
| Unit | Filtrado de trials por vencer | `tests/unit/admin/trials-expiring-filter.test.ts` |
| Integration | Envío de email a admin | `tests/integration/admin/admin-notifications.test.ts` |
| E2E | Admin ve badge de trials por vencer | `tests/e2e/admin/trial-alerts.spec.ts` |

#### Referencias Técnicas

- **Modelo de Datos:** `profiles`, `system_config` (admin_email, alert_threshold)
- **API Endpoints:** `GET /admin/trials-expiring`
- **Edge Functions:** `notify-admin-new-registration`, `notify-trials-expiring` (cron)
- **Componentes UI:** `TrialAlertsBadge`, `ExpiringTrialsList`

---

### US-19: Cuenta en Modo Solo Lectura

#### Definición

**Como** sistema,  
**quiero** que las cuentas con trial expirado entren en modo "solo lectura",  
**para** que el profesional pueda ver su información pero no crear nuevas citas.

#### Criterios de Aceptación

**Escenario 1: Trial expira automáticamente**
- **Dado que** el trial de un profesional vence hoy
- **Cuando** pasa la medianoche (zona horaria del profesional)
- **Entonces** el estado cambia automáticamente a `readonly`

**Escenario 2: Profesional en readonly puede ver datos**
- **Dado que** mi cuenta está en modo readonly
- **Cuando** inicio sesión
- **Entonces** puedo ver mi calendario, clientes y citas existentes
- **Pero** veo banner: "Tu período de prueba ha expirado. Contacta al administrador."

**Escenario 3: Profesional en readonly NO puede crear**
- **Dado que** mi cuenta está en modo readonly
- **Cuando** intento crear una cita
- **Entonces** veo mensaje: "Función no disponible. Tu cuenta está en modo solo lectura."
- **Y** el botón de crear está deshabilitado

**Escenario 4: Profesional en readonly NO puede editar**
- **Dado que** mi cuenta está en modo readonly
- **Cuando** intento editar una cita existente
- **Entonces** veo mensaje de restricción
- **Y** los formularios están en modo solo lectura

**Escenario 5: Portal público muestra inactivo**
- **Dado que** mi cuenta está en readonly
- **Cuando** un cliente accede a mi portal de reservas
- **Entonces** ve: "Este profesional no está disponible actualmente"
- **Y** NO puede ver servicios ni reservar

**Escenario 6: Citas existentes se mantienen**
- **Dado que** mi cuenta pasa a readonly
- **Cuando** reviso mis citas futuras
- **Entonces** las citas ya agendadas NO se cancelan
- **Y** siguen sincronizadas con Google Calendar

#### Prioridad y Estimación

| Prioridad | Estimación | Dependencias |
|-----------|------------|--------------|
| 🔴 Crítica | M (5 pts) | US-01, US-17 |

#### Especificación de Tests

| Tipo | Descripción | Ubicación |
|------|-------------|-----------|
| Unit | Verificación de permisos por estado | `tests/unit/auth/readonly-permissions.test.ts` |
| Unit | Lógica de expiración automática | `tests/unit/auth/trial-expiration-logic.test.ts` |
| Integration | Cron job de expiración de trials | `tests/integration/admin/trial-expiration-job.test.ts` |
| Integration | Bloqueo de acciones en readonly | `tests/integration/auth/readonly-restrictions.test.ts` |
| E2E | Profesional con trial expirado ve restricciones | `tests/e2e/auth/readonly-mode.spec.ts` |

#### Referencias Técnicas

- **Modelo de Datos:** `profiles` (account_status: 'trial' | 'active' | 'readonly' | 'suspended')
- **API Endpoints:** Middleware de verificación de permisos en todas las rutas de mutación
- **Edge Functions:** `expire-trials-cron` (ejecuta diariamente)
- **Componentes UI:** `ReadOnlyBanner`, `DisabledFormOverlay`, `ProfessionalUnavailablePage`

---

## 4.3 Historias de Usuario - Fase 2 (Post-MVP)

---

### US-20: Cálculo Automático de Traslado (Google Maps)

#### Definición

**Como** profesional móvil,  
**quiero** que el sistema calcule automáticamente el tiempo de traslado usando Google Maps,  
**para** no tener que configurarlo manualmente.

#### Criterios de Aceptación

**Escenario 1: Cálculo automático al crear cita**
- **Dado que** tengo coordenadas de mis ubicaciones
- **Cuando** creo cita en ubicación diferente a la anterior
- **Entonces** el sistema consulta Google Maps y sugiere tiempo de traslado

**Escenario 2: Considerar tráfico en hora pico**
- **Dado que** la cita es a las 18:00 (hora pico)
- **Cuando** se calcula el traslado
- **Entonces** se usa traffic model para tiempo realista

**Escenario 3: Fallback a tiempo manual si falla API**
- **Dado que** Google Maps no responde
- **Cuando** intento crear cita
- **Entonces** el sistema usa el tiempo manual configurado

#### Prioridad y Estimación

| Prioridad | Estimación | Dependencias |
|-----------|------------|--------------|
| 🟡 Alta | L (8 pts) | US-07 |

#### Referencias Técnicas

- **API Externa:** Google Maps Directions API
- **Modelo de Datos:** `location_travel_times` (actualizado), `travel_blocks`
- **Edge Functions:** `calculate-travel-time`

---

### US-21: Sugerencias de Optimización de Jornada

#### Definición

**Como** profesional,  
**quiero** ver sugerencias para reorganizar mi agenda y reducir tiempos muertos,  
**para** ser más productivo.

#### Criterios de Aceptación

**Escenario 1: Detectar hueco evitable**
- **Dado que** tengo 30 min libres entre dos citas
- **Cuando** la siguiente cita podría moverse
- **Entonces** veo sugerencia: "Mover cita de 11:30 a 11:00 elimina 30 min de espera"

**Escenario 2: Sugerir agrupar por ubicación**
- **Dado que** tengo citas alternadas entre Gym y Hotel
- **Cuando** podría agruparlas
- **Entonces** veo sugerencia de reordenar

#### Prioridad y Estimación

| Prioridad | Estimación | Dependencias |
|-----------|------------|--------------|
| 🟢 Media | L (8 pts) | US-09, US-16 |

---

### US-22: Pagos con MercadoPago

#### Definición

**Como** cliente,  
**quiero** pagar mi cita al momento de reservar,  
**para** asegurar mi lugar y evitar no-shows.

#### Criterios de Aceptación

**Escenario 1: Pago exitoso**
- **Dado que** completo mi reserva
- **Cuando** pago con MercadoPago
- **Entonces** la cita queda confirmada automáticamente

**Escenario 2: Pago rechazado**
- **Dado que** mi pago es rechazado
- **Cuando** intento confirmar
- **Entonces** la cita no se crea y veo mensaje de error

**Escenario 3: Reembolso por cancelación**
- **Dado que** el profesional cancela mi cita pagada
- **Cuando** la cancelación se procesa
- **Entonces** recibo reembolso automático

#### Prioridad y Estimación

| Prioridad | Estimación | Dependencias |
|-----------|------------|--------------|
| 🟢 Media | L (8 pts) | US-13 |

---

### US-23: Gestión Multi-Profesional (Equipos)

#### Definición

**Como** administrador de un centro (clínica, gym),  
**quiero** gestionar múltiples profesionales desde una cuenta,  
**para** tener visibilidad centralizada.

#### Criterios de Aceptación

**Escenario 1: Agregar profesional al equipo**
- **Dado que** soy admin de "Iron Gym"
- **Cuando** invito a Felipe a mi equipo
- **Entonces** Felipe puede operar bajo mi cuenta

**Escenario 2: Ver agenda consolidada**
- **Dado que** tengo 3 profesionales
- **Cuando** veo el dashboard
- **Entonces** veo todas las citas del día

#### Prioridad y Estimación

| Prioridad | Estimación | Dependencias |
|-----------|------------|--------------|
| 🟢 Media | L (8 pts) | US-01, US-02 |

---

### US-24: Reportes y Estadísticas

#### Definición

**Como** profesional,  
**quiero** ver reportes de citas, ingresos y clientes,  
**para** entender mi negocio.

#### Criterios de Aceptación

**Escenario 1: Reporte mensual de citas**
- **Dado que** quiero ver mi mes
- **Cuando** abro reportes
- **Entonces** veo: total citas, completadas, canceladas, no-shows

**Escenario 2: Ingresos por período**
- **Dado que** quiero ver ingresos
- **Cuando** filtro por mes
- **Entonces** veo total facturado por servicio

#### Prioridad y Estimación

| Prioridad | Estimación | Dependencias |
|-----------|------------|--------------|
| 🟢 Media | M (5 pts) | US-11 |

---

### US-25: Importación Masiva de Clientes

#### Definición

**Como** profesional con clientes existentes,  
**quiero** importar mi lista desde Excel/CSV,  
**para** no ingresarlos uno a uno.

#### Criterios de Aceptación

**Escenario 1: Importar CSV válido**
- **Dado que** tengo CSV con nombre, email, teléfono
- **Cuando** lo subo
- **Entonces** los clientes se crean con source = "import"

**Escenario 2: Detectar duplicados por email**
- **Dado que** un email ya existe
- **Cuando** importo
- **Entonces** veo cuántos fueron omitidos por duplicado

#### Prioridad y Estimación

| Prioridad | Estimación | Dependencias |
|-----------|------------|--------------|
| 🟢 Media | S (3 pts) | US-05 |

---

### US-26: Recordatorios Automáticos (WhatsApp)

#### Definición

**Como** profesional,  
**quiero** enviar recordatorios automáticos por WhatsApp,  
**para** reducir no-shows.

#### Criterios de Aceptación

**Escenario 1: Recordatorio 24 horas antes**
- **Dado que** una cita es mañana
- **Cuando** pasan 24 horas antes
- **Entonces** el cliente recibe WhatsApp con detalles

**Escenario 2: Cliente confirma por WhatsApp**
- **Dado que** el cliente responde "Sí"
- **Cuando** el sistema procesa
- **Entonces** la cita cambia a "confirmed"

#### Prioridad y Estimación

| Prioridad | Estimación | Dependencias |
|-----------|------------|--------------|
| 🟢 Media | L (8 pts) | US-08 |

---

## 4.4 Matriz de Trazabilidad

### Historias → Modelo de Datos

| Historia | Tablas Involucradas |
|----------|---------------------|
| US-01, US-02 | `profiles` (+ `account_status`, `trial_expires_at`), `auth.users` |
| US-03 | `locations` |
| US-04 | `services`, `location_services` |
| US-05 | `clients` |
| US-06 | `working_hours` |
| US-07 | `location_travel_times` |
| US-08, US-11 | `appointments`, `travel_blocks`, `client_service_durations` |
| US-09 | `appointments`, `travel_blocks`, `locations` |
| US-10 | `client_service_durations` |
| US-12, US-13 | `profiles`, `services`, `locations`, `appointments`, `clients` |
| US-14, US-15 | `google_calendar_tokens`, `google_calendar_events` |
| **US-16, US-17, US-18** | `system_config` (nueva), `profiles` |
| **US-19** | `profiles` (account_status transitions) |

### Historias → Endpoints API (Preview)

| Historia | Endpoints Principales |
|----------|----------------------|
| US-01 | `POST /auth/google` |
| US-02 | `PATCH /profiles/:id` |
| US-03 | `CRUD /locations` |
| US-04 | `CRUD /services` |
| US-05 | `CRUD /clients` |
| US-06 | `CRUD /working-hours` |
| US-07 | `CRUD /travel-times` |
| US-08 | `POST /appointments` |
| US-09 | `GET /appointments?date=X` |
| US-10 | `GET /clients/:id/suggested-duration` |
| US-11 | `PUT /appointments/:id/complete`, `PUT /appointments/:id/cancel` |
| US-12 | `GET /public/professionals/:slug` |
| US-13 | `GET /public/availability`, `POST /public/bookings` |
| US-14 | `POST /gcal/connect`, `POST /gcal/sync` |
| **US-16** | `GET/PATCH /admin/config` |
| **US-17** | `GET /admin/professionals`, `PATCH /admin/professionals/:id/status` |
| **US-18** | `GET /admin/trials-expiring` |
| **US-19** | Middleware de permisos + Cron `expire-trials`

---

## 4.5 Checklist de Validación

### Formato y Claridad
- [x] ¿Cumple la tríada? (Rol + Acción + Beneficio)
- [x] ¿Lenguaje natural? (El cliente lo entiende sin saber programar)
- [x] ¿Evita tecnicismos en la definición? (No menciona tablas, APIs)
- [x] ¿Terminología genérica? (profesional, cliente, servicio - no kinesiólogo, paciente)

### Testabilidad
- [x] ¿Criterios binarios? (Pass/Fail, no ambiguos)
- [x] ¿Cubren happy path y errores?
- [x] ¿Formato Gherkin? (Dado que... Cuando... Entonces...)
- [x] ¿Tests definidos por historia? (Unit, Integration, E2E)

### Valor y Alcance
- [x] ¿Cada historia es independiente o dependencias explícitas?
- [x] ¿Historias pequeñas? (M o L, no XL)
- [x] ¿Prioridad justificada?
- [x] ¿Fase claramente definida? (MVP vs Post-MVP)

### Coherencia con PRD
- [x] ¿Traza con Modelo de Datos? (Sección 3)
- [x] ¿Traza con Funcionalidades? (Sección 1.2)
- [x] ¿Cubre todos los actores? (Profesional, Cliente, Sistema)

---

## 4.6 Referencias

| Documento | Ubicación |
|-----------|-----------|
| Ficha del Proyecto | [`0-FichaProyecto.md`](./0-FichaProyecto.md) |
| Descripción General | [`1-DescripcionGeneral.md`](./1-DescripcionGeneral.md) |
| Arquitectura del Sistema | [`2-ArquitecturaSistema.md`](./2-ArquitecturaSistema.md) |
| Modelo de Datos | [`3-ModeloDatos.md`](./3-ModeloDatos.md) |

---

**Última actualización:** Enero 2026  
**Versión del documento:** 1.1.0  
**Total Historias MVP:** 19  
**Total Historias Fase 2:** 7  
**Story Points MVP:** ~94 pts

---

## 📋 Cambios en v1.1.0

- **US-01 actualizada:** Incluye trial automático y estados de cuenta
- **US-13 actualizada:** Explícito que cliente NO necesita cuenta + bloqueo de portal inactivo
- **US-16 nueva:** Configuración de Trial por Superadmin
- **US-17 nueva:** Dashboard de Gestión de Profesionales
- **US-18 nueva:** Notificaciones de Registro y Trial
- **US-19 nueva:** Cuenta en Modo Solo Lectura
- **US-20 a US-26:** Renumeradas (antes US-16 a US-22)

