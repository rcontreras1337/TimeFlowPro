'use client'

import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  MapPin,
  Settings,
  Shield,
  User,
  Users,
} from 'lucide-react'
import type { Route } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

import { Button } from '@/components/ui'
import { getMessage } from '@/lib/messages/client'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils/cn'

export type UserRole = 'superadmin' | 'professional'

interface NavItem {
  href: Route
  label: string
  icon: React.ElementType
  adminOnly?: boolean
}

const navItems: NavItem[] = [
  {
    href: '/dashboard' as Route,
    label: getMessage('navigation.dashboard'),
    icon: LayoutDashboard,
  },
  {
    href: '/locations' as Route,
    label: getMessage('navigation.locations'),
    icon: MapPin,
  },
  {
    href: '/services' as Route,
    label: getMessage('navigation.services'),
    icon: Calendar,
  },
  {
    href: '/clients' as Route,
    label: getMessage('navigation.clients'),
    icon: User,
  },
  {
    href: '/settings' as Route,
    label: getMessage('navigation.settings'),
    icon: Settings,
  },
  // Admin-only items
  {
    href: '/admin' as Route,
    label: getMessage('navigation.adminPanel'),
    icon: Shield,
    adminOnly: true,
  },
  {
    href: '/admin/professionals' as Route,
    label: getMessage('admin.dashboard.professionals'),
    icon: Users,
    adminOnly: true,
  },
]

interface AppSidebarProps {
  userRole: UserRole
}

/**
 * Unified App Sidebar Navigation
 * Shows navigation items based on user role
 * Hidden on mobile (use BottomNav instead)
 *
 * @ticket Sprint 1 Refinements
 */
export function AppSidebar({ userRole }: AppSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const supabase = createClient()

  const filteredItems = navItems.filter((item) => !item.adminOnly || userRole === 'superadmin')

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const roleLabel =
    userRole === 'superadmin'
      ? getMessage('navigation.admin')
      : getMessage('navigation.professional')

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-50 flex flex-col',
        'bg-dark-400 border-r border-dark-200/50',
        'transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64',
        'hidden lg:flex'
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-dark-200/50">
        {!isCollapsed && (
          <Link href={'/dashboard' as Route} className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
              <Image
                src="/logo-icon.svg"
                alt="TimeFlowPro"
                width={20}
                height={20}
                className="h-5 w-5"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-white text-sm">TimeFlowPro</span>
              <span className="text-xs text-primary-400">{roleLabel}</span>
            </div>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn('text-gray-400 hover:text-white', isCollapsed && 'mx-auto')}
        >
          {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-1">
          {filteredItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors',
                    'min-h-[44px]', // Touch target
                    isActive
                      ? 'bg-primary-500/20 text-primary-400'
                      : 'text-gray-400 hover:bg-dark-300 hover:text-white',
                    isCollapsed && 'justify-center px-2'
                  )}
                  title={isCollapsed ? item.label : undefined}
                >
                  <item.icon className="h-6 w-6 flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="truncate text-sm font-medium">{item.label}</span>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer - Logout */}
      <div className="border-t border-dark-200/50 p-3">
        <button
          onClick={() => void handleLogout()}
          className={cn(
            'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 transition-colors',
            'min-h-[44px]', // Touch target
            'text-gray-400 hover:bg-red-500/20 hover:text-red-400',
            isCollapsed && 'justify-center px-2'
          )}
          title={isCollapsed ? getMessage('auth.logout.button') : undefined}
        >
          <LogOut className="h-6 w-6 flex-shrink-0" />
          {!isCollapsed && (
            <span className="text-sm font-medium">{getMessage('auth.logout.button')}</span>
          )}
        </button>
      </div>
    </aside>
  )
}
