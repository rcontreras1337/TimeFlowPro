'use client'

import { Calendar, MapPin, User, Settings } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'

interface NavItem {
  href: string
  icon: React.ComponentType<{ className?: string }>
  label: string
}

const navItems: NavItem[] = [
  { href: '/dashboard', icon: Calendar, label: 'Agenda' },
  { href: '/locations', icon: MapPin, label: 'Ubicaciones' },
  { href: '/clients', icon: User, label: 'Clientes' },
  { href: '/settings', icon: Settings, label: 'Ajustes' },
]

/**
 * Mobile bottom navigation component
 * Shows on mobile screens with subtle active indicator
 */
export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-dark-200/50 bg-dark-500/95 backdrop-blur-lg md:hidden">
      <div className="mx-auto flex h-16 max-w-md items-center justify-around px-4">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 px-3 py-2 transition-colors',
                'min-h-[44px] min-w-[44px]', // Touch target
                isActive ? 'text-primary-500' : 'text-gray-400 hover:text-gray-300'
              )}
            >
              <Icon
                className={cn('h-5 w-5', isActive && 'drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]')}
              />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
      {/* Safe area for iOS */}
      <div className="h-safe-area-inset-bottom bg-dark-500" />
    </nav>
  )
}
