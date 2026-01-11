'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'

import type { Location } from '@/types/location.types'

import { LocationCard } from './location-card'

interface SortableLocationCardProps {
  location: Location
  onEdit: () => void
  onDelete: () => void
  canMutate: boolean
}

/**
 * Wrapper component that makes LocationCard draggable
 *
 * @description Uses @dnd-kit/sortable for drag and drop functionality
 * Shows drag handle when user can mutate
 *
 * @ticket T-2-02
 */
export function SortableLocationCard({
  location,
  onEdit,
  onDelete,
  canMutate,
}: SortableLocationCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: location.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className="relative">
      {/* Drag handle - only visible when canMutate */}
      {canMutate && (
        <button
          type="button"
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 p-1 rounded cursor-grab text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 active:cursor-grabbing"
          {...attributes}
          {...listeners}
          aria-label="Arrastrar para reordenar"
        >
          <GripVertical className="h-5 w-5" />
        </button>
      )}
      <LocationCard location={location} onEdit={onEdit} onDelete={onDelete} canMutate={canMutate} />
    </div>
  )
}
