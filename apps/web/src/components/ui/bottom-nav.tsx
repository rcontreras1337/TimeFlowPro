'use client'

import {
  Calendar,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  Settings,
  Shield,
  User,
  Users,
  X,
} from 'lucide-react'
import type { Route } from 'next'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

import { getMessage } from '@/lib/messages/client'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

export type UserRole = 'superadmin' | 'professional'

interface NavItem {
  href: Route
  icon: React.ComponentType<{ className?: string }>
  label: string
  adminOnly?: boolean
}

const mainNavItems: NavItem[] = [
  { href: '/dashboard' as Route, icon: LayoutDashboard, label: getMessage('navigation.dashboard') },
  { href: '/locations' as Route, icon: MapPin, label: getMessage('navigation.locations') },
  { href: '/clients' as Route, icon: User, label: getMessage('navigation.clients') },
]

const moreNavItems: NavItem[] = [
  { href: '/services' as Route, icon: Calendar, label: getMessage('navigation.services') },
  { href: '/settings' as Route, icon: Settings, label: getMessage('navigation.settings') },
  {
    href: '/admin' as Route,
    icon: Shield,
    label: getMessage('navigation.adminPanel'),
    adminOnly: true,
  },
  {
    href: '/admin/professionals' as Route,
    icon: Users,
    label: getMessage('admin.dashboard.professionals'),
    adminOnly: true,
  },
  {
    href: '/admin/config' as Route,
    icon: Settings,
    label: getMessage('admin.config.title'),
    adminOnly: true,
  },
]

interface BottomNavProps {
  userRole?: UserRole
}

/**
 * Mobile bottom navigation component
 * Shows on mobile screens with large touch targets
 * Includes "More" menu for additional options
 *
 * @ticket Sprint 1 Refinements
 */
export function BottomNav({ userRole = 'professional' }: BottomNavProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const supabase = createClient()

  const filteredMoreItems = moreNavItems.filter(
    (item) => !item.adminOnly || userRole === 'superadmin'
  )

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    setIsMenuOpen(false)
  }

  return (
    <>
      {/* Backdrop when menu is open */}
      {isMenuOpen && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Cerrar menú"
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setIsMenuOpen(false)}
          onKeyDown={(e) => e.key === 'Escape' && setIsMenuOpen(false)}
        />
      )}

      {/* More menu drawer */}
      <div
        className={cn(
          'fixed bottom-16 left-0 right-0 z-50 mx-4 mb-2 rounded-2xl',
          'bg-dark-400 border border-dark-200/50 shadow-xl',
          'transition-all duration-300 md:hidden',
          isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'
        )}
      >
        <div className="p-3 space-y-1">
          {filteredMoreItems.map((item) => {
            const isActive = pathname.startsWith(item.href)
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-4 py-3 transition-colors',
                  'min-h-[48px]', // Touch target
                  isActive
                    ? 'bg-primary-500/20 text-primary-400'
                    : 'text-gray-400 hover:bg-dark-300 hover:text-white'
                )}
              >
                <Icon className="h-6 w-6" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            )
          })}

          {/* Divider */}
          <div className="my-2 border-t border-dark-200/50" />

          {/* Logout button */}
          <button
            onClick={() => void handleLogout()}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-gray-400 hover:bg-red-500/20 hover:text-red-400 transition-colors min-h-[48px]"
          >
            <LogOut className="h-6 w-6" />
            <span className="text-sm font-medium">{getMessage('auth.logout.button')}</span>
          </button>
        </div>
      </div>

      {/* Bottom navigation bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-dark-200/50 bg-dark-500/95 backdrop-blur-lg md:hidden">
        <div className="mx-auto flex h-16 max-w-md items-center justify-around px-2">
          {mainNavItems.map((item) => {
            const isActive = pathname.startsWith(item.href)
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center gap-0.5 px-4 py-2 transition-colors',
                  'min-h-[48px] min-w-[56px]', // Touch target
                  isActive ? 'text-primary-500' : 'text-gray-400 hover:text-gray-300'
                )}
              >
                <Icon
                  className={cn(
                    'h-6 w-6',
                    isActive && 'drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]'
                  )}
                />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            )
          })}

          {/* More button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={cn(
              'flex flex-col items-center justify-center gap-0.5 px-4 py-2 transition-colors',
              'min-h-[48px] min-w-[56px]', // Touch target
              isMenuOpen ? 'text-primary-500' : 'text-gray-400 hover:text-gray-300'
            )}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            <span className="text-[10px] font-medium">{getMessage('navigation.more')}</span>
          </button>
        </div>
        {/* Safe area for iOS */}
        <div className="h-safe-area-inset-bottom bg-dark-500" />
      </nav>
    </>
  )
}
