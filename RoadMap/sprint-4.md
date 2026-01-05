# 🌐 Sprint 4: Portal Público y Reservas Online

## 📊 Resumen

| Métrica               | Valor                                                                    |
| --------------------- | ------------------------------------------------------------------------ |
| **Tickets**           | 9                                                                        |
| **Story Points**      | 44                                                                       |
| **Duración estimada** | 2 semanas                                                                |
| **Objetivo**          | Portal público por slug, wizard de reserva, cancelación y reagendamiento |

---

## 📋 Lista de Tickets

| ID     | Título                       | Tipo     | Pts | HDU          | Estado       | Bloqueado por  |
| ------ | ---------------------------- | -------- | --- | ------------ | ------------ | -------------- |
| T-4-01 | Portal público por slug      | Frontend | 5   | US-12        | ⬜ Pendiente | T-2-04         |
| T-4-02 | API Disponibilidad pública   | Backend  | 5   | US-12, US-13 | ⬜ Pendiente | T-3-04         |
| T-4-03 | Wizard de reserva online     | Frontend | 8   | US-13        | ⬜ Pendiente | T-4-01, T-4-02 |
| T-4-04 | Términos y condiciones       | Backend  | 3   | US-23        | ⬜ Pendiente | T-4-02         |
| T-4-05 | Completar/Cancelar extensión | Backend  | 5   | US-11        | ⬜ Pendiente | T-3-03         |
| T-4-06 | UI Completar cita            | Frontend | 3   | US-11        | ⬜ Pendiente | T-4-05, T-3-05 |
| T-4-07 | Duración adaptativa refinada | Backend  | 5   | US-10        | ⬜ Pendiente | T-4-05         |
| T-4-08 | Cancelación por cliente      | Backend  | 5   | US-20        | ⬜ Pendiente | T-4-03         |
| T-4-09 | Reagendamiento de citas      | Backend  | 5   | US-21        | ⬜ Pendiente | T-4-03         |

---

## 🔗 Diagrama de Dependencias

```mermaid
flowchart TD
    T204["T-2-04<br/>🛠️ Services"] --> T401["T-4-01<br/>🌐 Portal"]
    T304["T-3-04<br/>⚡ Availability"] --> T402["T-4-02<br/>📡 API Pública"]

    T401 --> T403["T-4-03<br/>🧙 Wizard"]
    T402 --> T403
    T402 --> T404["T-4-04<br/>📜 T&C"]

    T303["T-3-03<br/>📅 Citas"] --> T405["T-4-05<br/>✅ Complete"]
    T405 --> T406["T-4-06<br/>🖥️ UI Complete"]
    T305["T-3-05<br/>📆 Calendar"] --> T406

    T405 --> T407["T-4-07<br/>⏱️ Duración"]

    T403 --> T408["T-4-08<br/>❌ Cancel"]
    T403 --> T409["T-4-09<br/>🔄 Reschedule"]

    style T401 fill:#8B5CF6,color:#fff
    style T402 fill:#10B981,color:#fff
    style T403 fill:#EC4899,color:#fff
    style T404 fill:#F59E0B,color:#fff
    style T405 fill:#3B82F6,color:#fff
    style T406 fill:#60A5FA,color:#000
    style T407 fill:#6366F1,color:#fff
    style T408 fill:#EF4444,color:#fff
    style T409 fill:#14B8A6,color:#fff
```

---

## 📝 HDUs Cubiertas

- **US-12:** Portal Público del Profesional
- **US-13:** Reservar Cita Online (sin cuenta)
- **US-20:** Cancelación de Cita por Cliente
- **US-21:** Reagendamiento de Cita
- **US-23:** Términos y Condiciones al Reservar

---

## ✅ Checklist de Completado

- [ ] Portal público accesible por slug
- [ ] SEO metadata dinámica
- [ ] Wizard de 6 pasos funciona
- [ ] Cliente puede reservar sin cuenta
- [ ] Términos y condiciones obligatorios
- [ ] Cancelación con anticipación mínima
- [ ] Reagendamiento funciona
- [ ] Todos los mensajes en español via YML

---

**Referencia completa:** [Documentacion/6-TicketsTrabajo.md](../Documentacion/6-TicketsTrabajo.md)
