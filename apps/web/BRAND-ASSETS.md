# 🎨 TimeFlowPro - Brand Assets

## Estructura de Archivos

```
public/
├── logo.svg                 # Logo principal (modo claro)
├── logo-dark.svg           # Logo para modo oscuro
├── logo-icon.svg           # Ícono solo (sin texto)
├── favicon.svg             # Favicon vectorial (32x32)
├── favicon.ico             # Favicon tradicional (generado)
├── apple-touch-icon.png    # Ícono iOS (180x180)
├── manifest.json           # PWA manifest
├── icon-192.png            # PWA icon (generado)
├── icon-512.png            # PWA icon (generado)
└── og-image.png            # Open Graph (generado)

src/styles/
├── globals.css             # Estilos globales + imports
└── tokens/
    ├── colors.css          # Paleta de colores
    ├── typography.css      # Sistema tipográfico
    └── spacing.css         # Espaciado y layout
```

---

## 🎨 Paleta de Colores (Dark Theme)

### Background - Dark Charcoal

| Variable   | Hex       | Uso               |
| ---------- | --------- | ----------------- |
| `dark-500` | `#0F0F14` | Fondo principal   |
| `dark-400` | `#141418` | Cards elevadas    |
| `dark-300` | `#18181B` | Superficies hover |
| `dark-200` | `#1E1E27` | Bordes sutiles    |

### Primary - Soft Indigo

| Variable      | Hex       | Uso             |
| ------------- | --------- | --------------- |
| `primary-400` | `#818CF8` | Highlight       |
| `primary-500` | `#6366F1` | Color principal |
| `primary-600` | `#4F46E5` | Hover           |
| `primary-700` | `#4338CA` | Active          |

### Secondary - Violet (para gradientes)

| Variable        | Hex       | Uso        |
| --------------- | --------- | ---------- |
| `secondary-400` | `#A78BFA` | Highlight  |
| `secondary-500` | `#8B5CF6` | Gradientes |
| `secondary-600` | `#7C3AED` | Hover      |

### Accent - Cyan (uso moderado)

| Variable     | Hex       | Uso              |
| ------------ | --------- | ---------------- |
| `accent-400` | `#22D3EE` | Highlight        |
| `accent-500` | `#06B6D4` | CTAs secundarios |
| `accent-600` | `#0891B2` | Hover            |

### Calendar Específicos

| Variable               | Hex       | Uso                 |
| ---------------------- | --------- | ------------------- |
| `calendar-appointment` | `#6366F1` | Citas               |
| `calendar-travel`      | `#F59E0B` | Traslados           |
| `calendar-personal`    | `#8B5CF6` | Bloqueos personales |
| `calendar-available`   | `#10B981` | Disponible          |
| `calendar-unavailable` | `#EF4444` | No disponible       |

---

## 📝 Tipografía

### Font Family

- **Primary:** Plus Jakarta Sans (Google Fonts)
- **Mono:** JetBrains Mono (código)

### Uso con Next.js

```typescript
// app/layout.tsx
import { Plus_Jakarta_Sans } from 'next/font/google'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jakarta',
  display: 'swap',
})
```

---

## 🌟 Design Patterns

### Glassmorphism Cards

```css
.glass-card {
  background: rgba(20, 20, 24, 0.5);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
}
```

**Con Tailwind:**

```html
<div class="rounded-2xl border border-dark-200/30 bg-dark-400/30 backdrop-blur-sm"></div>
```

### Gradient Buttons

```css
.btn-gradient {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  box-shadow: 0 0 20px rgba(99, 102, 241, 0.3);
}
```

**Con Tailwind:**

```html
<button class="bg-gradient-to-r from-primary-500 to-secondary-500 shadow-glow"></button>
```

### Subtle Glow Effects

```css
.icon-glow {
  filter: drop-shadow(0 0 8px rgba(99, 102, 241, 0.5));
}
```

---

## ✅ Checklist de Validación

- [x] Logo SVG optimizado (<10KB)
- [x] Variantes: light, dark, icon-only
- [x] Design tokens en Tailwind config
- [x] Paleta dark theme implementada
- [x] Tipografía con fallbacks del sistema
- [x] PWA manifest configurado
- [ ] Favicons PNG generados
- [ ] OG Image PNG generado

---

## 📋 Referencia Tailwind

```typescript
// tailwind.config.ts - Colores principales
colors: {
  dark: {
    DEFAULT: '#0F0F14',
    300: '#18181B',
    400: '#141418',
    500: '#0F0F14',
  },
  primary: {
    500: '#6366F1',
    600: '#4F46E5',
  },
  secondary: {
    500: '#8B5CF6',
  },
}
```

---

**Referencia:** [tailwind.config.ts](../tailwind.config.ts)
