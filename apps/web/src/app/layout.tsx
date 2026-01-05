import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google'
import '@/styles/globals.css'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jakarta',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'TimeFlowPro - Gestión Inteligente de Citas',
    template: '%s | TimeFlowPro',
  },
  description:
    'Sistema de agendamiento inteligente para profesionales móviles. Gestiona múltiples ubicaciones, adapta duraciones por cliente y optimiza tu jornada.',
  keywords: ['agenda', 'citas', 'profesionales', 'móvil', 'gestión', 'calendario', 'timeflowpro'],
  authors: [{ name: 'Ruben Contreras', url: 'https://github.com/rcontreras1337' }],
  creator: 'TimeFlowPro',
  publisher: 'TimeFlowPro',
  applicationName: 'TimeFlowPro',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'TimeFlowPro',
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
  openGraph: {
    title: 'TimeFlowPro - Gestión Inteligente de Citas',
    description:
      'Sistema de agendamiento para profesionales móviles con multi-ubicación y duraciones adaptativas.',
    url: '/',
    siteName: 'TimeFlowPro',
    locale: 'es_CL',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'TimeFlowPro - Gestión Inteligente de Citas',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TimeFlowPro - Gestión Inteligente de Citas',
    description: 'Sistema de agendamiento para profesionales móviles.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.svg',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  themeColor: '#0F0F14',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es"
      className={`${plusJakartaSans.variable} ${jetbrainsMono.variable} dark`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-dark-500 font-sans text-white antialiased">{children}</body>
    </html>
  )
}
