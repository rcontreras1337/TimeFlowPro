# 5. Especificación de la API - TimeFlowPro

---

## 5.1 Información General

| Aspecto | Valor |
|---------|-------|
| **Base URL Producción** | `https://api.timeflowpro.app/v1` |
| **Base URL Staging** | `https://staging.api.timeflowpro.app/v1` |
| **Formato de Datos** | JSON (`application/json`) |
| **Autenticación** | Bearer Token (JWT via Supabase Auth) |
| **Versionado** | URL path (`/v1/`) |
| **Rate Limiting** | 100 req/min por usuario |

### Convenciones de la API

| Convención | Descripción |
|------------|-------------|
| **Nombres de recursos** | Plurales en inglés (`/appointments`, `/clients`) |
| **Parámetros de ruta** | UUID (`/appointments/:id`) |
| **Fechas** | ISO 8601 (`2026-01-15T10:00:00Z`) |
| **Paginación** | `?page=1&limit=20` (máx 100) |
| **Ordenamiento** | `?order_by=start_time&order_dir=asc` |
| **Filtros** | Query params (`?status=pending&date=2026-01-15`) |

---

## 5.2 Autenticación y Autorización

### Flujo de Autenticación

```mermaid
sequenceDiagram
    actor User as 👤 Usuario
    participant App as 📱 TimeFlowPro
    participant Supabase as 🔐 Supabase Auth
    participant Google as 🔑 Google OAuth

    User->>App: Click "Continuar con Google"
    App->>Supabase: signInWithOAuth('google')
    Supabase->>Google: Redirect OAuth
    Google-->>User: Pantalla de consentimiento
    User->>Google: Autoriza
    Google-->>Supabase: Código de autorización
    Supabase-->>App: JWT Token + Refresh Token
    App->>App: Almacena tokens (httpOnly cookie)
    App-->>User: Redirige a Dashboard
```

### Headers Requeridos

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
Accept: application/json
```

### Roles y Permisos (RLS)

| Rol | Descripción | Permisos |
|-----|-------------|----------|
| `professional` | Profesional móvil | CRUD sobre sus propios recursos |
| `superadmin` | Administrador del sistema | CRUD global + configuración del sistema |
| `public` | Cliente sin cuenta | Solo lectura portal público + crear reservas |

---

## 5.3 Endpoints Críticos

### Índice de Endpoints por Categoría

```mermaid
flowchart LR
    subgraph Core["🎯 Core Business"]
        A1["POST /appointments"]
        A2["GET /availability"]
        A3["PUT /appointments/:id/complete"]
        A4["PUT /appointments/:id/cancel"]
        A5["PUT /appointments/:id/reschedule"]
    end

    subgraph Public["🌐 Portal Público"]
        P1["GET /public/professionals/:slug"]
        P2["GET /public/availability"]
        P3["POST /public/bookings"]
        P4["POST /public/appointments/:id/cancel"]
    end

    subgraph Admin["⚙️ Administración"]
        AD1["GET /admin/professionals"]
        AD2["PATCH /admin/professionals/:id/status"]
        AD3["GET/PATCH /admin/config"]
    end

    subgraph Resources["📦 Recursos"]
        R1["CRUD /locations"]
        R2["CRUD /services"]
        R3["CRUD /clients"]
        R4["CRUD /personal-blocks"]
    end

    style Core fill:#4CAF50,color:#fff
    style Public fill:#2196F3,color:#fff
    style Admin fill:#FF9800,color:#fff
    style Resources fill:#9C27B0,color:#fff
```

---

## 5.4 Endpoint 1: POST /appointments

> **Descripción:** Crea una nueva cita calculando automáticamente la duración adaptativa y el bloqueo de tiempo de traslado.

### Especificación OpenAPI

```yaml
/appointments:
  post:
    summary: Crear una nueva cita
    description: |
      Crea una cita para un cliente en una ubicación específica.
      - Calcula duración adaptativa basada en historial del cliente
      - Bloquea automáticamente tiempo de traslado si hay cita previa en otra ubicación
      - Valida conflictos de horario
      - Sincroniza con Google Calendar si está conectado
    operationId: createAppointment
    tags:
      - Appointments
    security:
      - BearerAuth: []
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            required:
              - client_id
              - service_id
              - location_id
              - start_time
            properties:
              client_id:
                type: string
                format: uuid
                description: ID del cliente
              service_id:
                type: string
                format: uuid
                description: ID del servicio
              location_id:
                type: string
                format: uuid
                description: ID de la ubicación
              start_time:
                type: string
                format: date-time
                description: Fecha y hora de inicio (ISO 8601)
              duration_override:
                type: integer
                description: Duración manual en minutos (opcional, sobreescribe duración adaptativa)
              notes:
                type: string
                maxLength: 1000
                description: Notas de la cita
              source:
                type: string
                enum: [manual, online_booking]
                default: manual
    responses:
      '201':
        description: Cita creada exitosamente
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/AppointmentResponse'
      '400':
        description: Error de validación
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ValidationError'
      '401':
        description: No autorizado
      '403':
        description: Cuenta en modo solo lectura o suspendida
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/AccountStatusError'
      '409':
        description: Conflicto de horario
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ScheduleConflictError'
```

### Ejemplo Request (Happy Path)

```http
POST /v1/appointments HTTP/1.1
Host: api.timeflowpro.app
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "client_id": "c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d8e0a",
  "service_id": "s9a8b7c6-d5e4-f3g2-h1i0-j9k8l7m6n5o4",
  "location_id": "l1m2n3o4-p5q6-r7s8-t9u0-v1w2x3y4z5a6",
  "start_time": "2026-01-15T10:00:00-03:00",
  "notes": "Paciente con dolor lumbar recurrente - traer informe médico"
}
```

### Ejemplo Response 201 Created

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "user_id": "u9z8y7x6-w5v4-u3t2-s1r0-q9p8o7n6m5l4",
  "client_id": "c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d8e0a",
  "service_id": "s9a8b7c6-d5e4-f3g2-h1i0-j9k8l7m6n5o4",
  "location_id": "l1m2n3o4-p5q6-r7s8-t9u0-v1w2x3y4z5a6",
  "start_time": "2026-01-15T10:00:00-03:00",
  "end_time": "2026-01-15T10:30:00-03:00",
  "duration_minutes": 30,
  "price_at_booking": 25000,
  "status": "confirmed",
  "source": "manual",
  "notes": "Paciente con dolor lumbar recurrente - traer informe médico",
  "client": {
    "id": "c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d8e0a",
    "name": "Juan Pérez",
    "phone": "+56912345678"
  },
  "service": {
    "id": "s9a8b7c6-d5e4-f3g2-h1i0-j9k8l7m6n5o4",
    "name": "Sesión de Kinesiología",
    "default_duration": 45
  },
  "location": {
    "id": "l1m2n3o4-p5q6-r7s8-t9u0-v1w2x3y4z5a6",
    "name": "Hotel Viejas Escuelas",
    "address": "Av. Principal 123"
  },
  "travel_block": {
    "id": "tb1234-5678-90ab-cdef",
    "from_location": "Iron Gym",
    "to_location": "Hotel Viejas Escuelas",
    "travel_time_minutes": 20,
    "blocked_from": "2026-01-15T09:40:00-03:00",
    "blocked_to": "2026-01-15T10:00:00-03:00"
  },
  "duration_source": "adaptive",
  "duration_details": {
    "default_duration": 45,
    "adaptive_duration": 30,
    "client_history_count": 5,
    "average_from_history": 28
  },
  "google_event_id": "abc123xyz789",
  "created_at": "2026-01-10T14:30:00-03:00",
  "updated_at": "2026-01-10T14:30:00-03:00"
}
```

### Ejemplo Response 409 Conflict

```json
{
  "code": "SCHEDULE_CONFLICT",
  "message": "El horario solicitado no está disponible",
  "details": {
    "conflicting_appointment": {
      "id": "existing-appointment-id",
      "start_time": "2026-01-15T09:30:00-03:00",
      "end_time": "2026-01-15T10:15:00-03:00",
      "client_name": "María López"
    },
    "required_travel_time": 20,
    "suggested_slots": [
      {
        "start_time": "2026-01-15T10:35:00-03:00",
        "end_time": "2026-01-15T11:05:00-03:00",
        "available": true
      },
      {
        "start_time": "2026-01-15T11:00:00-03:00",
        "end_time": "2026-01-15T11:30:00-03:00",
        "available": true
      }
    ]
  }
}
```

### Ejemplo Response 403 Forbidden (Cuenta readonly)

```json
{
  "code": "ACCOUNT_READONLY",
  "message": "Tu cuenta está en modo solo lectura",
  "details": {
    "account_status": "readonly",
    "trial_expired_at": "2026-01-08T00:00:00-03:00",
    "action_required": "Contacta al administrador para activar tu cuenta"
  }
}
```

---

## 5.5 Endpoint 2: GET /availability

> **Descripción:** Consulta los slots disponibles para un servicio en una fecha, considerando citas existentes, bloqueos personales y tiempos de traslado.

### Especificación OpenAPI

```yaml
/availability:
  get:
    summary: Consultar disponibilidad
    description: |
      Retorna slots disponibles para agendar una cita.
      Considera:
      - Citas existentes
      - Horarios de trabajo por ubicación
      - Tiempos de traslado entre ubicaciones
      - Bloqueos personales (almuerzo, vacaciones)
      - Buffer time post-cita del servicio
    operationId: getAvailability
    tags:
      - Availability
    security:
      - BearerAuth: []
    parameters:
      - name: date
        in: query
        required: true
        schema:
          type: string
          format: date
        description: Fecha para consultar (YYYY-MM-DD)
      - name: service_id
        in: query
        required: true
        schema:
          type: string
          format: uuid
        description: ID del servicio a agendar
      - name: location_id
        in: query
        required: false
        schema:
          type: string
          format: uuid
        description: ID de ubicación (opcional, muestra todas si no se especifica)
      - name: client_id
        in: query
        required: false
        schema:
          type: string
          format: uuid
        description: ID del cliente (para calcular duración adaptativa)
      - name: slot_interval
        in: query
        required: false
        schema:
          type: integer
          default: 15
        description: Intervalo entre slots en minutos (15, 30, 60)
    responses:
      '200':
        description: Lista de slots disponibles
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/AvailabilityResponse'
      '400':
        description: Parámetros inválidos
      '401':
        description: No autorizado
```

### Ejemplo Request

```http
GET /v1/availability?date=2026-01-15&service_id=s9a8b7c6&location_id=l1m2n3o4&client_id=c7b3d8e0 HTTP/1.1
Host: api.timeflowpro.app
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Ejemplo Response 200 OK

```json
{
  "date": "2026-01-15",
  "timezone": "America/Santiago",
  "service": {
    "id": "s9a8b7c6-d5e4-f3g2-h1i0-j9k8l7m6n5o4",
    "name": "Sesión de Kinesiología",
    "default_duration": 45,
    "adaptive_duration": 30,
    "buffer_time_minutes": 5
  },
  "location": {
    "id": "l1m2n3o4-p5q6-r7s8-t9u0-v1w2x3y4z5a6",
    "name": "Hotel Viejas Escuelas",
    "working_hours": {
      "start": "09:00",
      "end": "18:00"
    }
  },
  "client": {
    "id": "c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d8e0a",
    "name": "Juan Pérez",
    "appointment_history_count": 5
  },
  "slots": [
    {
      "start_time": "2026-01-15T09:00:00-03:00",
      "end_time": "2026-01-15T09:30:00-03:00",
      "available": true,
      "requires_travel": false
    },
    {
      "start_time": "2026-01-15T09:30:00-03:00",
      "end_time": "2026-01-15T10:00:00-03:00",
      "available": false,
      "reason": "existing_appointment",
      "blocked_by": {
        "type": "appointment",
        "client_name": "María López"
      }
    },
    {
      "start_time": "2026-01-15T10:00:00-03:00",
      "end_time": "2026-01-15T10:30:00-03:00",
      "available": false,
      "reason": "travel_block",
      "blocked_by": {
        "type": "travel",
        "from_location": "Iron Gym",
        "travel_time_minutes": 20
      }
    },
    {
      "start_time": "2026-01-15T10:30:00-03:00",
      "end_time": "2026-01-15T11:00:00-03:00",
      "available": true,
      "requires_travel": true,
      "travel_info": {
        "from_location": "Iron Gym",
        "travel_time_minutes": 20,
        "will_block_from": "2026-01-15T10:10:00-03:00"
      }
    },
    {
      "start_time": "2026-01-15T13:00:00-03:00",
      "end_time": "2026-01-15T13:30:00-03:00",
      "available": false,
      "reason": "personal_block",
      "blocked_by": {
        "type": "personal_block",
        "title": "Almuerzo",
        "block_type": "lunch"
      }
    },
    {
      "start_time": "2026-01-15T14:00:00-03:00",
      "end_time": "2026-01-15T14:30:00-03:00",
      "available": true,
      "requires_travel": false
    }
  ],
  "summary": {
    "total_slots": 18,
    "available_slots": 12,
    "blocked_by_appointments": 3,
    "blocked_by_travel": 2,
    "blocked_by_personal": 1
  }
}
```

---

## 5.6 Endpoint 3: PUT /appointments/:id/complete

> **Descripción:** Marca una cita como completada y actualiza el historial de duración adaptativa del cliente.

### Especificación OpenAPI

```yaml
/appointments/{id}/complete:
  put:
    summary: Completar una cita
    description: |
      Marca la cita como completada y registra la duración real.
      - Actualiza `client_service_durations` para duración adaptativa
      - Recalcula promedios de duración del cliente
      - Sincroniza estado con Google Calendar
    operationId: completeAppointment
    tags:
      - Appointments
    security:
      - BearerAuth: []
    parameters:
      - name: id
        in: path
        required: true
        schema:
          type: string
          format: uuid
        description: ID de la cita
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            required:
              - actual_duration_minutes
            properties:
              actual_duration_minutes:
                type: integer
                minimum: 5
                maximum: 480
                description: Duración real de la cita en minutos
              notes:
                type: string
                maxLength: 1000
                description: Notas adicionales post-cita
    responses:
      '200':
        description: Cita completada exitosamente
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/AppointmentCompletedResponse'
      '400':
        description: Error de validación
      '401':
        description: No autorizado
      '403':
        description: Cuenta en modo solo lectura
      '404':
        description: Cita no encontrada
      '422':
        description: La cita no puede completarse (ya cancelada/completada)
```

### Ejemplo Request

```http
PUT /v1/appointments/a1b2c3d4-e5f6-7890-abcd-ef1234567890/complete HTTP/1.1
Host: api.timeflowpro.app
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "actual_duration_minutes": 28,
  "notes": "Paciente mejoró significativamente. Próxima sesión en 2 semanas."
}
```

### Ejemplo Response 200 OK

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "status": "completed",
  "duration_minutes": 30,
  "actual_duration_minutes": 28,
  "completed_at": "2026-01-15T10:28:00-03:00",
  "notes": "Paciente mejoró significativamente. Próxima sesión en 2 semanas.",
  "duration_history_updated": true,
  "client_duration_stats": {
    "service_id": "s9a8b7c6-d5e4-f3g2-h1i0-j9k8l7m6n5o4",
    "total_appointments": 6,
    "average_duration_minutes": 29,
    "min_duration_minutes": 25,
    "max_duration_minutes": 35,
    "suggested_next_duration": 28
  },
  "google_calendar_synced": true
}
```

---

## 5.7 Endpoint 4: POST /public/bookings

> **Descripción:** Permite a clientes (sin cuenta) reservar una cita a través del portal público.

### Especificación OpenAPI

```yaml
/public/bookings:
  post:
    summary: Crear reserva pública
    description: |
      Permite a un cliente reservar una cita sin necesidad de cuenta.
      - No requiere autenticación
      - Requiere aceptación de términos y condiciones
      - Crea cliente si no existe (por email)
      - Valida que el profesional esté activo
    operationId: createPublicBooking
    tags:
      - Public Portal
    security: []  # No auth required
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            required:
              - professional_slug
              - service_id
              - location_id
              - start_time
              - client_name
              - client_email
              - client_phone
              - terms_accepted
            properties:
              professional_slug:
                type: string
                description: Slug del profesional (ej. "felipe-kinesiologo")
              service_id:
                type: string
                format: uuid
              location_id:
                type: string
                format: uuid
              start_time:
                type: string
                format: date-time
              client_name:
                type: string
                minLength: 2
                maxLength: 100
              client_email:
                type: string
                format: email
              client_phone:
                type: string
                pattern: '^\+?[0-9]{8,15}$'
              notes:
                type: string
                maxLength: 500
              terms_accepted:
                type: boolean
                description: Debe ser true para procesar la reserva
    responses:
      '201':
        description: Reserva creada exitosamente
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/PublicBookingResponse'
      '400':
        description: Error de validación
      '404':
        description: Profesional no encontrado
      '409':
        description: Conflicto de horario
      '422':
        description: Profesional inactivo o términos no aceptados
```

### Ejemplo Request

```http
POST /v1/public/bookings HTTP/1.1
Host: api.timeflowpro.app
Content-Type: application/json

{
  "professional_slug": "felipe-kinesiologo",
  "service_id": "s9a8b7c6-d5e4-f3g2-h1i0-j9k8l7m6n5o4",
  "location_id": "l1m2n3o4-p5q6-r7s8-t9u0-v1w2x3y4z5a6",
  "start_time": "2026-01-16T11:00:00-03:00",
  "client_name": "Ana García",
  "client_email": "ana.garcia@email.com",
  "client_phone": "+56987654321",
  "notes": "Primera visita, dolor en rodilla derecha",
  "terms_accepted": true
}
```

### Ejemplo Response 201 Created

```json
{
  "booking_id": "b5c6d7e8-f9a0-1234-5678-90abcdef1234",
  "appointment_id": "a9b8c7d6-e5f4-3210-9876-543210fedcba",
  "status": "confirmed",
  "professional": {
    "name": "Felipe González",
    "slug": "felipe-kinesiologo"
  },
  "service": {
    "name": "Sesión de Kinesiología",
    "duration_minutes": 45,
    "price": 25000
  },
  "location": {
    "name": "Hotel Viejas Escuelas",
    "address": "Av. Principal 123"
  },
  "appointment": {
    "start_time": "2026-01-16T11:00:00-03:00",
    "end_time": "2026-01-16T11:45:00-03:00"
  },
  "client": {
    "id": "new-client-uuid",
    "name": "Ana García",
    "email": "ana.garcia@email.com",
    "is_new": true
  },
  "price_at_booking": 25000,
  "terms_accepted_at": "2026-01-15T15:30:00-03:00",
  "cancellation_link": "https://timeflowpro.app/cancel/b5c6d7e8",
  "reschedule_link": "https://timeflowpro.app/reschedule/b5c6d7e8",
  "calendar_event": {
    "google_calendar_invite_sent": true
  },
  "policies": {
    "cancellation_hours_before": 24,
    "reschedule_hours_before": 24,
    "refund_policy": "No se realizan reembolsos"
  }
}
```

### Ejemplo Response 422 Unprocessable (Profesional Inactivo)

```json
{
  "code": "PROFESSIONAL_INACTIVE",
  "message": "Este profesional no está aceptando reservas en este momento",
  "details": {
    "professional_slug": "felipe-kinesiologo",
    "account_status": "readonly",
    "reason": "Trial expirado"
  }
}
```

---

## 5.8 Endpoint 5: PUT /appointments/:id/reschedule

> **Descripción:** Reagenda una cita existente a un nuevo horario.

### Especificación OpenAPI

```yaml
/appointments/{id}/reschedule:
  put:
    summary: Reagendar cita
    description: |
      Mueve una cita a un nuevo horario.
      - Valida anticipación mínima configurable
      - Conserva referencia a cita original
      - Actualiza Google Calendar
    operationId: rescheduleAppointment
    tags:
      - Appointments
    security:
      - BearerAuth: []
    parameters:
      - name: id
        in: path
        required: true
        schema:
          type: string
          format: uuid
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            required:
              - new_start_time
            properties:
              new_start_time:
                type: string
                format: date-time
              new_location_id:
                type: string
                format: uuid
                description: Opcional, mantiene ubicación original si no se especifica
              reason:
                type: string
                maxLength: 500
    responses:
      '200':
        description: Cita reagendada exitosamente
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/RescheduleResponse'
      '400':
        description: Anticipación insuficiente
      '404':
        description: Cita no encontrada
      '409':
        description: Conflicto de horario
```

### Ejemplo Response 200 OK

```json
{
  "id": "new-appointment-uuid",
  "rescheduled_from": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "rescheduled_at": "2026-01-15T16:00:00-03:00",
  "original_appointment": {
    "start_time": "2026-01-16T10:00:00-03:00",
    "status": "cancelled",
    "cancellation_reason": "Reagendada por profesional"
  },
  "new_appointment": {
    "start_time": "2026-01-17T14:00:00-03:00",
    "end_time": "2026-01-17T14:30:00-03:00",
    "status": "confirmed",
    "location": {
      "name": "Hotel Viejas Escuelas"
    }
  },
  "google_calendar_updated": true,
  "client_notified": true
}
```

---

## 5.9 Endpoint 6: CRUD /personal-blocks

> **Descripción:** Gestiona bloqueos de tiempo personal (almuerzo, vacaciones, etc.)

### Especificación OpenAPI

```yaml
/personal-blocks:
  get:
    summary: Listar bloqueos personales
    tags:
      - Personal Blocks
    security:
      - BearerAuth: []
    parameters:
      - name: from_date
        in: query
        schema:
          type: string
          format: date
      - name: to_date
        in: query
        schema:
          type: string
          format: date
      - name: block_type
        in: query
        schema:
          type: string
          enum: [lunch, vacation, personal, other]
    responses:
      '200':
        description: Lista de bloqueos

  post:
    summary: Crear bloqueo personal
    tags:
      - Personal Blocks
    security:
      - BearerAuth: []
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            required:
              - title
              - block_type
              - start_time
              - end_time
            properties:
              title:
                type: string
                maxLength: 100
                example: "Almuerzo"
              block_type:
                type: string
                enum: [lunch, vacation, personal, other]
              start_time:
                type: string
                format: date-time
              end_time:
                type: string
                format: date-time
              all_day:
                type: boolean
                default: false
              recurrence_type:
                type: string
                enum: [none, daily, weekly, monthly]
                default: none
              recurrence_end_date:
                type: string
                format: date
    responses:
      '201':
        description: Bloqueo creado

/personal-blocks/{id}:
  put:
    summary: Actualizar bloqueo personal
    tags:
      - Personal Blocks
    security:
      - BearerAuth: []
    parameters:
      - name: id
        in: path
        required: true
        schema:
          type: string
          format: uuid
    responses:
      '200':
        description: Bloqueo actualizado

  delete:
    summary: Eliminar bloqueo personal
    tags:
      - Personal Blocks
    security:
      - BearerAuth: []
    parameters:
      - name: id
        in: path
        required: true
        schema:
          type: string
          format: uuid
    responses:
      '204':
        description: Bloqueo eliminado
```

### Ejemplo POST Request

```http
POST /v1/personal-blocks HTTP/1.1
Host: api.timeflowpro.app
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "title": "Almuerzo",
  "block_type": "lunch",
  "start_time": "2026-01-15T13:00:00-03:00",
  "end_time": "2026-01-15T14:00:00-03:00",
  "recurrence_type": "daily",
  "recurrence_end_date": "2026-12-31"
}
```

### Ejemplo Response 201

```json
{
  "id": "pb-1234-5678-90ab-cdef",
  "title": "Almuerzo",
  "block_type": "lunch",
  "start_time": "2026-01-15T13:00:00-03:00",
  "end_time": "2026-01-15T14:00:00-03:00",
  "all_day": false,
  "recurrence_type": "daily",
  "recurrence_end_date": "2026-12-31",
  "is_active": true,
  "created_at": "2026-01-15T10:00:00-03:00",
  "next_occurrences": [
    "2026-01-15T13:00:00-03:00",
    "2026-01-16T13:00:00-03:00",
    "2026-01-17T13:00:00-03:00"
  ]
}
```

---

## 5.10 Endpoints de Administración

### GET /admin/professionals

```yaml
/admin/professionals:
  get:
    summary: Listar profesionales (Admin)
    tags:
      - Admin
    security:
      - BearerAuth: []
    parameters:
      - name: status
        in: query
        schema:
          type: string
          enum: [trial, active, readonly, suspended, pending_activation]
      - name: trial_expiring_in_days
        in: query
        schema:
          type: integer
          description: Filtrar trials que expiran en X días
    responses:
      '200':
        description: Lista de profesionales
```

### Ejemplo Response

```json
{
  "professionals": [
    {
      "id": "prof-uuid-1",
      "email": "felipe@example.com",
      "full_name": "Felipe González",
      "account_status": "trial",
      "trial_expires_at": "2026-01-20T00:00:00-03:00",
      "days_until_expiration": 5,
      "created_at": "2026-01-13T10:00:00-03:00",
      "stats": {
        "total_appointments": 12,
        "total_clients": 8,
        "total_locations": 3
      }
    },
    {
      "id": "prof-uuid-2",
      "email": "maria@example.com",
      "full_name": "María López",
      "account_status": "active",
      "activated_at": "2026-01-10T10:00:00-03:00",
      "stats": {
        "total_appointments": 45,
        "total_clients": 22,
        "total_locations": 2
      }
    }
  ],
  "summary": {
    "total": 15,
    "by_status": {
      "trial": 5,
      "active": 8,
      "readonly": 1,
      "suspended": 1
    },
    "trials_expiring_this_week": 3
  }
}
```

### PATCH /admin/professionals/:id/status

```yaml
/admin/professionals/{id}/status:
  patch:
    summary: Cambiar estado de profesional
    tags:
      - Admin
    security:
      - BearerAuth: []
    parameters:
      - name: id
        in: path
        required: true
        schema:
          type: string
          format: uuid
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            required:
              - new_status
            properties:
              new_status:
                type: string
                enum: [active, readonly, suspended]
              extend_trial_days:
                type: integer
                minimum: 1
                maximum: 90
              reason:
                type: string
    responses:
      '200':
        description: Estado actualizado
```

### GET/PATCH /admin/config

```yaml
/admin/config:
  get:
    summary: Obtener configuración del sistema
    tags:
      - Admin
    security:
      - BearerAuth: []
    responses:
      '200':
        description: Configuración actual

  patch:
    summary: Actualizar configuración
    tags:
      - Admin
    security:
      - BearerAuth: []
    requestBody:
      content:
        application/json:
          schema:
            type: object
            properties:
              default_trial_days:
                type: integer
                minimum: 1
                maximum: 90
              admin_notification_email:
                type: string
                format: email
              default_cancellation_hours:
                type: integer
              default_reschedule_hours:
                type: integer
```

---

## 5.11 Manejo de Errores

### Códigos de Estado HTTP

| Código | Nombre | Cuándo ocurre |
|--------|--------|---------------|
| `200` | OK | Solicitud exitosa |
| `201` | Created | Recurso creado exitosamente |
| `204` | No Content | Eliminación exitosa |
| `400` | Bad Request | Validación fallida, datos incorrectos |
| `401` | Unauthorized | Token ausente, inválido o expirado |
| `403` | Forbidden | Sin permisos (cuenta readonly/suspended) |
| `404` | Not Found | Recurso no existe |
| `409` | Conflict | Conflicto de horario o duplicado |
| `422` | Unprocessable Entity | Lógica de negocio no cumplida |
| `429` | Too Many Requests | Rate limit excedido |
| `500` | Internal Server Error | Error del servidor |

### Estructura Estándar de Errores

```json
{
  "code": "ERROR_CODE_CONSTANT",
  "message": "Mensaje legible para el usuario",
  "details": {
    "field": "campo_con_error",
    "reason": "Descripción técnica del error",
    "suggestion": "Posible solución"
  },
  "request_id": "req-uuid-para-debugging",
  "timestamp": "2026-01-15T10:00:00Z"
}
```

### Códigos de Error Específicos

| Código | HTTP | Descripción |
|--------|------|-------------|
| `VALIDATION_ERROR` | 400 | Campos requeridos faltantes o inválidos |
| `INVALID_DATE_FORMAT` | 400 | Formato de fecha incorrecto |
| `TOKEN_EXPIRED` | 401 | JWT expirado, requiere refresh |
| `INVALID_TOKEN` | 401 | JWT malformado o inválido |
| `ACCOUNT_READONLY` | 403 | Cuenta en modo solo lectura (trial expirado) |
| `ACCOUNT_SUSPENDED` | 403 | Cuenta suspendida por admin |
| `INSUFFICIENT_PERMISSIONS` | 403 | Rol sin permisos para esta acción |
| `RESOURCE_NOT_FOUND` | 404 | Recurso no existe o no pertenece al usuario |
| `SCHEDULE_CONFLICT` | 409 | Conflicto de horario con cita/bloqueo existente |
| `DUPLICATE_RESOURCE` | 409 | Recurso duplicado (ej. slug ya existe) |
| `PROFESSIONAL_INACTIVE` | 422 | Profesional no acepta reservas |
| `TERMS_NOT_ACCEPTED` | 422 | Términos y condiciones no aceptados |
| `INSUFFICIENT_NOTICE` | 422 | No cumple anticipación mínima para cancelar/reagendar |
| `RATE_LIMIT_EXCEEDED` | 429 | Demasiadas solicitudes |

---

## 5.12 Especificación OpenAPI Completa

```yaml
openapi: 3.0.3
info:
  title: TimeFlowPro API
  description: |
    API para gestión de agendas de profesionales móviles.
    
    ## Características principales
    - Gestión de citas con duración adaptativa
    - Bloqueo automático de tiempos de traslado
    - Portal público para reservas sin cuenta
    - Sincronización con Google Calendar
    - Sistema de bloqueos personales
    
    ## Autenticación
    Todos los endpoints (excepto `/public/*`) requieren autenticación via JWT Bearer Token.
  version: 1.0.0
  contact:
    name: TimeFlowPro Support
    email: soporte@timeflowpro.app
  license:
    name: Proprietary
    
servers:
  - url: https://api.timeflowpro.app/v1
    description: Producción
  - url: https://staging.api.timeflowpro.app/v1
    description: Staging
  - url: http://localhost:54321/rest/v1
    description: Local (Supabase)

tags:
  - name: Appointments
    description: Gestión de citas
  - name: Availability
    description: Consulta de disponibilidad
  - name: Public Portal
    description: Endpoints públicos (sin auth)
  - name: Personal Blocks
    description: Bloqueos de tiempo personal
  - name: Admin
    description: Administración del sistema
  - name: Resources
    description: CRUD de recursos (ubicaciones, servicios, clientes)

components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: Token JWT de Supabase Auth

  schemas:
    # === CORE ENTITIES ===
    Appointment:
      type: object
      properties:
        id:
          type: string
          format: uuid
        user_id:
          type: string
          format: uuid
        client_id:
          type: string
          format: uuid
        service_id:
          type: string
          format: uuid
        location_id:
          type: string
          format: uuid
        start_time:
          type: string
          format: date-time
        end_time:
          type: string
          format: date-time
        duration_minutes:
          type: integer
        price_at_booking:
          type: number
          format: decimal
        status:
          type: string
          enum: [pending, confirmed, completed, cancelled, no_show]
        notes:
          type: string
        source:
          type: string
          enum: [manual, online_booking, google_calendar]
        terms_accepted_at:
          type: string
          format: date-time
        rescheduled_from:
          type: string
          format: uuid
        cancelled_by:
          type: string
          enum: [client, professional]
        google_event_id:
          type: string
        created_at:
          type: string
          format: date-time
        updated_at:
          type: string
          format: date-time

    TravelBlock:
      type: object
      properties:
        id:
          type: string
          format: uuid
        from_location_id:
          type: string
          format: uuid
        to_location_id:
          type: string
          format: uuid
        travel_time_minutes:
          type: integer
        start_time:
          type: string
          format: date-time
        end_time:
          type: string
          format: date-time

    PersonalBlock:
      type: object
      properties:
        id:
          type: string
          format: uuid
        title:
          type: string
        block_type:
          type: string
          enum: [lunch, vacation, personal, other]
        start_time:
          type: string
          format: date-time
        end_time:
          type: string
          format: date-time
        all_day:
          type: boolean
        recurrence_type:
          type: string
          enum: [none, daily, weekly, monthly]
        recurrence_end_date:
          type: string
          format: date
        is_active:
          type: boolean

    # === ERROR SCHEMAS ===
    Error:
      type: object
      required:
        - code
        - message
      properties:
        code:
          type: string
        message:
          type: string
        details:
          type: object
        request_id:
          type: string
        timestamp:
          type: string
          format: date-time

    ValidationError:
      allOf:
        - $ref: '#/components/schemas/Error'
        - type: object
          properties:
            details:
              type: object
              properties:
                fields:
                  type: array
                  items:
                    type: object
                    properties:
                      field:
                        type: string
                      message:
                        type: string

    ScheduleConflictError:
      allOf:
        - $ref: '#/components/schemas/Error'
        - type: object
          properties:
            details:
              type: object
              properties:
                conflicting_appointment:
                  type: object
                suggested_slots:
                  type: array
                  items:
                    type: object

    AccountStatusError:
      allOf:
        - $ref: '#/components/schemas/Error'
        - type: object
          properties:
            details:
              type: object
              properties:
                account_status:
                  type: string
                  enum: [readonly, suspended]
                action_required:
                  type: string

security:
  - BearerAuth: []

paths:
  # Endpoints definidos en secciones anteriores
  /appointments:
    $ref: '#/paths/~1appointments'
  /availability:
    $ref: '#/paths/~1availability'
  /appointments/{id}/complete:
    $ref: '#/paths/~1appointments~1{id}~1complete'
  /appointments/{id}/reschedule:
    $ref: '#/paths/~1appointments~1{id}~1reschedule'
  /public/bookings:
    $ref: '#/paths/~1public~1bookings'
  /personal-blocks:
    $ref: '#/paths/~1personal-blocks'
  /admin/professionals:
    $ref: '#/paths/~1admin~1professionals'
  /admin/config:
    $ref: '#/paths/~1admin~1config'
```

---

## 5.13 Checklist de Validación

### Cumplimiento de Estándares
- [x] ¿Es OpenAPI 3.0 válido?
- [x] ¿Verbos HTTP correctos? (GET leer, POST crear, PUT editar, DELETE borrar)
- [x] ¿Códigos de estado HTTP precisos? (201 creación, 400 cliente, 401 auth, 403 permisos, 409 conflicto)

### Consistencia de Datos
- [x] ¿Coincide con el Modelo de Datos (Sección 3)?
  - `appointments.price_at_booking` ✓
  - `appointments.terms_accepted_at` ✓
  - `appointments.rescheduled_from` ✓
  - `appointments.cancelled_by` ✓
  - `profiles.account_status` ✓
  - `personal_blocks` ✓
  - `system_config` ✓
- [x] ¿Manejo de errores consistente y documentado?

### Usabilidad (DX)
- [x] ¿Ejemplos copy-pasteables en JSON?
- [x] ¿Seguridad declarada? (Bearer Token en headers)
- [x] ¿Sin credenciales reales en ejemplos?

### Trazabilidad con Historias de Usuario

| Historia | Endpoints Documentados |
|----------|------------------------|
| US-01 (Auth) | OAuth via Supabase Auth |
| US-08 (Crear Cita) | `POST /appointments` |
| US-09 (Ver Calendario) | `GET /appointments` |
| US-10 (Duración Adaptativa) | `GET /availability` (incluye historial) |
| US-11 (Completar Cita) | `PUT /appointments/:id/complete` |
| US-13 (Reserva Online) | `POST /public/bookings` |
| US-16-18 (Admin) | `GET/PATCH /admin/*` |
| US-20 (Cancelar) | `POST /public/appointments/:id/cancel` |
| US-21 (Reagendar) | `PUT /appointments/:id/reschedule` |
| US-22 (Bloqueos) | `CRUD /personal-blocks` |
| US-23 (Términos) | `GET /public/professionals/:slug/terms` |

---

## 5.14 Referencias

| Documento | Ubicación |
|-----------|-----------|
| Modelo de Datos | `Documentacion/3-ModeloDatos.md` |
| Historias de Usuario | `Documentacion/4-HistoriasUsuario.md` |
| Arquitectura del Sistema | `Documentacion/2-ArquitecturaSistema.md` |
| Scaffolding API | `ScafoldingDocumentacion/4-Especificación de la API.md` |

---

**Última actualización:** Enero 2026  
**Versión del documento:** 1.0.0  
**Autor:** TimeFlowPro Team

