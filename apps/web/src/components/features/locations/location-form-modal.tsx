'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { MapPin } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { ColorPicker } from '@/components/ui/color-picker'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { useLocations } from '@/hooks/use-locations'
import { getMessage } from '@/lib/messages/client'
import type { Location } from '@/types/location.types'

/**
 * Form validation schema
 */
const locationSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  address: z.string(),
  color: z.string(),
  is_active: z.boolean(),
})

type LocationFormData = z.infer<typeof locationSchema>

interface LocationFormModalProps {
  /** Whether the modal is open */
  isOpen: boolean
  /** Callback to close the modal */
  onClose: () => void
  /** Location to edit (null for create mode) */
  location: Location | null
}

/**
 * Modal for creating or editing a location
 *
 * @description Uses React Hook Form with Zod validation
 * Following the pattern from profile-form.tsx
 *
 * @ticket T-2-02
 */
export function LocationFormModal({ isOpen, onClose, location }: LocationFormModalProps) {
  const { createLocationAsync, updateLocationAsync, isCreating, isUpdating } = useLocations()

  const isEditing = !!location
  const isLoading = isCreating || isUpdating

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<LocationFormData>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      name: '',
      address: '',
      color: '#3F83F8',
      is_active: true,
    },
  })

  // Reset form when modal opens/closes or location changes
  useEffect(() => {
    if (isOpen) {
      if (location) {
        reset({
          name: location.name,
          address: location.address ?? '',
          color: location.color ?? '#3F83F8',
          is_active: location.is_active,
        })
      } else {
        reset({
          name: '',
          address: '',
          color: '#3F83F8',
          is_active: true,
        })
      }
    }
  }, [isOpen, location, reset])

  const onSubmit = async (data: LocationFormData) => {
    try {
      if (isEditing && location) {
        await updateLocationAsync({
          id: location.id,
          input: {
            name: data.name,
            address: data.address || undefined,
            color: data.color,
            is_active: data.is_active,
          },
        })
      } else {
        await createLocationAsync({
          name: data.name,
          address: data.address || undefined,
          color: data.color,
          is_active: data.is_active,
        })
      }
      onClose()
    } catch {
      // Error is handled by the hook with toast
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            {isEditing ? getMessage('locations.edit') : getMessage('locations.add')}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="space-y-4">
          {/* Name field */}
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {getMessage('locations.fields.name')} *
            </label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Ej: Gimnasio Principal"
              error={errors.name?.message}
            />
          </div>

          {/* Address field */}
          <div className="space-y-2">
            <label
              htmlFor="address"
              className="text-sm font-medium text-gray-900 dark:text-gray-100"
            >
              {getMessage('locations.fields.address')}
            </label>
            <Input
              id="address"
              {...register('address')}
              placeholder="Ej: Av. Principal 123, Santiago"
            />
          </div>

          {/* Color picker */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {getMessage('locations.fields.color')}
            </label>
            <ColorPicker
              value={watch('color')}
              onChange={(color) => setValue('color', color, { shouldDirty: true })}
            />
          </div>

          {/* Active toggle */}
          <div className="flex items-center justify-between">
            <label
              htmlFor="is_active"
              className="text-sm font-medium text-gray-900 dark:text-gray-100"
            >
              Ubicación activa
            </label>
            <Switch
              id="is_active"
              checked={watch('is_active')}
              onCheckedChange={(checked) => setValue('is_active', checked, { shouldDirty: true })}
            />
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="ghost" onClick={handleClose} disabled={isLoading}>
              {getMessage('common.cancel')}
            </Button>
            <Button type="submit" isLoading={isLoading}>
              {getMessage('common.save')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
