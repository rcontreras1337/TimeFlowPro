'use client'

import { ChevronLeft, ChevronRight, LayoutDashboard, LogOut, Settings, Users } from 'lucide-react'
import type { Route } from 'next'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

import { Button } from '@/components/ui'
import { getMessage } from '@/lib/messages/client'
import { cn } from '@/lib/utils/cn'

interface NavItem {
  href: Route
  label: string
  icon: React.ElementType
}

// Mensajes cargados via webpack yaml-loader (client-safe)
const navItems: NavItem[] = [
  {
    href: '/admin' as Route,
    label: getMessage('admin.dashboard.title'),
    icon: LayoutDashboard,
  },
  {
    href: '/admin/professionals' as Route,
    label: getMessage('admin.dashboard.professionals'),
    icon: Users,
  },
  {
    href: '/admin/config' as Route,
    label: getMessage('admin.config.title'),
    icon: Settings,
  },
]

/**
 * Admin Sidebar Navigation
 *
 * @ticket T-1-07
 */
export function AdminSidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <>
      {/* Mobile overlay */}
      <div className="lg:hidden fixed inset-0 z-40 bg-gray-900/50 hidden" />

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col',
          'bg-white dark:bg-dark-200 border-r border-gray-200 dark:border-gray-700',
          'transition-all duration-300',
          isCollapsed ? 'w-16' : 'w-64',
          'hidden lg:flex'
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
          {!isCollapsed && (
            <Link href={'/admin' as Route} className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-icon.svg" alt="TimeFlowPro" className="h-8 w-8" />
              <span className="font-semibold text-gray-900 dark:text-white">Admin</span>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="ml-auto"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 transition-colors',
                      isActive
                        ? 'bg-primary-100 text-primary-900 dark:bg-primary-900 dark:text-primary-100'
                        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-dark-300',
                      isCollapsed && 'justify-center'
                    )}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <Link
            href={'/' as Route}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 transition-colors',
              'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-dark-300',
              isCollapsed && 'justify-center'
            )}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && <span>Volver al sitio</span>}
          </Link>
        </div>
      </aside>
    </>
  )
}
