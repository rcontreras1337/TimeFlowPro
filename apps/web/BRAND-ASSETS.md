# 🎨 TimeFlowPro - Brand Assets

## Estructura de Archivos

```
public/
├── logo.svg                 # Logo principal (modo claro)
├── logo-dark.svg           # Logo para modo oscuro
├── logo-icon.svg           # Ícono solo (sin texto)
├── favicon.svg             # Favicon vectorial (32x32)
├── favicon.ico             # Favicon tradicional (generado)
├── apple-touch-icon.svg    # Ícono iOS (180x180 base)
├── apple-touch-icon.png    # Ícono iOS (generado)
├── og-image.svg            # Open Graph image (1200x630)
├── og-image.png            # Open Graph (generado)
├── icon-192.png            # PWA icon (generado)
├── icon-512.png            # PWA icon (generado)
└── site.webmanifest        # PWA manifest

src/styles/
├── globals.css             # Estilos globales + imports
└── tokens/
    ├── colors.css          # Paleta de colores
    ├── typography.css      # Sistema tipográfico
    └── spacing.css         # Espaciado y layout
```

---

## 🖼️ Generación de Assets PNG

Los archivos SVG deben convertirse a PNG para uso en producción. Usar una de estas opciones:

### Opción 1: Usando Sharp (Node.js)

```bash
# Instalar dependencias
pnpm add -D sharp

# Crear script de generación
node scripts/generate-icons.js
```

### Opción 2: Usando Inkscape (CLI)

```bash
# Favicon ICO
inkscape public/favicon.svg --export-filename=public/favicon.ico --export-width=32

# Apple Touch Icon
inkscape public/apple-touch-icon.svg --export-filename=public/apple-touch-icon.png --export-width=180

# PWA Icons
inkscape public/logo-icon.svg --export-filename=public/icon-192.png --export-width=192
inkscape public/logo-icon.svg --export-filename=public/icon-512.png --export-width=512

# OG Image
inkscape public/og-image.svg --export-filename=public/og-image.png --export-width=1200
```

### Opción 3: Usando Online Tool

- [RealFaviconGenerator](https://realfavicongenerator.net/) - Sube `logo-icon.svg`
- [Favicon.io](https://favicon.io/) - Generador de favicons
- [SVG to PNG](https://svgtopng.com/) - Conversión simple

---

## 🎨 Paleta de Colores

### Primary - Azul Profesional

| Variable              | Hex       | Uso             |
| --------------------- | --------- | --------------- |
| `--color-primary-500` | `#3F83F8` | Color principal |
| `--color-primary-600` | `#1C64F2` | Hover           |
| `--color-primary-700` | `#1A56DB` | Active          |

### Secondary - Teal Flow

| Variable                | Hex       | Uso              |
| ----------------------- | --------- | ---------------- |
| `--color-secondary-500` | `#0694A2` | Flujo/Movimiento |
| `--color-secondary-400` | `#16BDCA` | Highlight        |

### Accent - Naranja Energía

| Variable             | Hex       | Uso              |
| -------------------- | --------- | ---------------- |
| `--color-accent-500` | `#FF5A1F` | CTAs importantes |
| `--color-accent-400` | `#FF8A4C` | Highlights       |

### Calendar Específicos

| Variable                 | Hex       | Uso                 |
| ------------------------ | --------- | ------------------- |
| `--color-appointment`    | `#3F83F8` | Citas               |
| `--color-travel-block`   | `#F59E0B` | Traslados           |
| `--color-personal-block` | `#8B5CF6` | Bloqueos personales |
| `--color-available`      | `#10B981` | Disponible          |
| `--color-unavailable`    | `#EF4444` | No disponible       |

---

## 📝 Tipografía

### Font Family

- **Primary:** Plus Jakarta Sans (Google Fonts)
- **Mono:** JetBrains Mono (código)

### Cargar en HTML

```html
<head>
  <!-- Preconnect para performance -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

  <!-- Fonts -->
  <link
    href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
    rel="stylesheet"
  />
</head>
```

### Cargar en Next.js (App Router)

```typescript
// app/layout.tsx
import { Plus_Jakarta_Sans } from 'next/font/google'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-plus-jakarta-sans',
  display: 'swap',
})
```

---

## ✅ Checklist de Validación

- [x] Logo SVG optimizado (<10KB)
- [x] Variantes: light, dark, icon-only
- [x] Design tokens en CSS custom properties
- [x] Paleta accesible (WCAG AA)
- [x] Tipografía con fallbacks del sistema
- [x] Web manifest para PWA
- [ ] Favicons PNG generados
- [ ] OG Image PNG generado

---

## 📋 Uso en Código

### CSS Variables

```css
.my-element {
  background-color: var(--color-primary-500);
  font-family: var(--font-family-sans);
  padding: var(--space-4);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}
```

### Con Tailwind (después de configurar)

```html
<button
  class="bg-primary-500 hover:bg-primary-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md"
>
  Crear Cita
</button>
```

---

**Referencia:** [Documentacion/6-TicketsTrabajo.md - T-0-01](../../../Documentacion/6-TicketsTrabajo.md)
