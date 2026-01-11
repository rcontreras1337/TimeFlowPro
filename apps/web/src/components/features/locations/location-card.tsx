'use client'

import { Edit, MapPin, MoreVertical, Trash2 } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getMessage } from '@/lib/messages/client'
import type { Location } from '@/types/location.types'

interface LocationCardProps {
  /** Location data */
  location: Location
  /** Callback when edit is clicked */
  onEdit: () => void
  /** Callback when delete is clicked */
  onDelete: () => void
  /** Whether the user can perform mutations */
  canMutate: boolean
}

/**
 * Card component for displaying a single location
 *
 * @description Shows location name, address, status badge, and action menu
 * Based on specification from T-2-02 ticket
 *
 * @ticket T-2-02
 */
export function LocationCard({ location, onEdit, onDelete, canMutate }: LocationCardProps) {
  const color = location.color ?? '#3F83F8'

  return (
    <Card className="relative overflow-hidden">
      {/* Color indicator bar */}
      <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: color }} />

      <CardContent className="p-5 pt-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            {/* Icon with dynamic color background */}
            <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}20` }}>
              <MapPin className="h-5 w-5" style={{ color }} />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                {location.name}
              </h3>
              {location.address && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                  {location.address}
                </p>
              )}
            </div>
          </div>

          {/* Actions menu */}
          {canMutate && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm" className="h-8 w-8 shrink-0">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Opciones</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  {getMessage('common.edit')}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={onDelete}
                  className="text-red-600 dark:text-red-400 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {getMessage('common.delete')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Status badges */}
        <div className="flex items-center gap-2 mt-4">
          <Badge variant={location.is_active ? 'success' : 'secondary'}>
            {location.is_active ? getMessage('account.status.active') : 'Inactiva'}
          </Badge>
          {location.latitude && location.longitude && (
            <Badge variant="default">📍 Con coordenadas</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
