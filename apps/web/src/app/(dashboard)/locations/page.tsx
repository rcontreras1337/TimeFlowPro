'use client'

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { Plus } from 'lucide-react'
import { useState } from 'react'

import {
  ConfirmDeleteDialog,
  LocationFormModal,
  LocationsSkeleton,
  SortableLocationCard,
} from '@/components/features/locations'
import { useAuthContext } from '@/components/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { useLocations } from '@/hooks/use-locations'
import { getMessage } from '@/lib/messages/client'
import type { Location } from '@/types/location.types'

/**
 * Locations management page
 *
 * @description Main page for managing professional locations
 * Features:
 * - Draggable list of location cards
 * - Create/edit modal
 * - Delete confirmation
 * - Empty state handling
 * - Loading state
 *
 * @ticket T-2-02
 */
export default function LocationsPage() {
  const { locations, isLoading, deleteLocation, isDeleting, reorderLocations } = useLocations()
  const { canMutate } = useAuthContext()

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingLocation, setEditingLocation] = useState<Location | null>(null)

  // Delete confirmation state
  const [deletingLocation, setDeletingLocation] = useState<Location | null>(null)

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleEdit = (location: Location) => {
    setEditingLocation(location)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingLocation(null)
  }

  const handleDeleteClick = (location: Location) => {
    setDeletingLocation(location)
  }

  const handleConfirmDelete = () => {
    if (deletingLocation) {
      deleteLocation(deletingLocation.id)
      setDeletingLocation(null)
    }
  }

  const handleCancelDelete = () => {
    setDeletingLocation(null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = locations.findIndex((loc) => loc.id === active.id)
      const newIndex = locations.findIndex((loc) => loc.id === over.id)
      const reordered = arrayMove(locations, oldIndex, newIndex)
      const orderedIds = reordered.map((loc) => loc.id)
      reorderLocations(orderedIds)
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6" data-testid="locations-page">
        <PageHeader canMutate={canMutate} onAddClick={() => setIsModalOpen(true)} />
        <LocationsSkeleton />
      </div>
    )
  }

  return (
    <div className="space-y-6" data-testid="locations-page">
      {/* Page header */}
      <PageHeader canMutate={canMutate} onAddClick={() => setIsModalOpen(true)} />

      {/* Content */}
      {locations.length === 0 ? (
        <EmptyState
          icon="📍"
          title={getMessage('locations.title')}
          description="Agrega las ubicaciones donde atiendes a tus clientes"
          action={
            canMutate && (
              <Button onClick={() => setIsModalOpen(true)} data-testid="add-location-empty">
                <Plus className="h-4 w-4 mr-2" />
                {getMessage('locations.add')}
              </Button>
            )
          }
        />
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={locations.map((loc) => loc.id)}
            strategy={verticalListSortingStrategy}
          >
            <div
              className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 pl-4"
              data-testid="locations-grid"
            >
              {locations.map((location) => (
                <SortableLocationCard
                  key={location.id}
                  location={location}
                  onEdit={() => handleEdit(location)}
                  onDelete={() => handleDeleteClick(location)}
                  canMutate={canMutate}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Create/Edit Modal */}
      <LocationFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        location={editingLocation}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        isOpen={!!deletingLocation}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        itemName={deletingLocation?.name ?? ''}
      />
    </div>
  )
}

/**
 * Page header component
 */
function PageHeader({ canMutate, onAddClick }: { canMutate: boolean; onAddClick: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {getMessage('locations.title')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">Gestiona los lugares donde atiendes</p>
      </div>
      {canMutate && (
        <Button onClick={onAddClick} data-testid="add-location-btn">
          <Plus className="h-4 w-4 mr-2" />
          {getMessage('locations.add')}
        </Button>
      )}
    </div>
  )
}
