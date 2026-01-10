'use client'

/**
 * useLocations Hook
 *
 * TanStack Query hook for location management with optimistic updates.
 *
 * @ticket T-2-01
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { getMessage } from '@/lib/messages/client'
import { locationService } from '@/services/locations/location.service'
import type { CreateLocationInput, UpdateLocationInput } from '@/types/location.types'

const QUERY_KEY = ['locations']

/**
 * Hook for managing locations with TanStack Query
 *
 * @returns Location state and mutation functions
 */
export function useLocations() {
  const queryClient = useQueryClient()

  // Query: Get all locations
  const {
    data: locations = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => locationService.getAll(),
  })

  // Mutation: Create location
  const createMutation = useMutation({
    mutationFn: (input: CreateLocationInput) => locationService.create(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success(getMessage('locations.create.success'))
    },
    onError: (error: Error) => {
      toast.error(error.message || getMessage('locations.create.error'))
    },
  })

  // Mutation: Update location
  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateLocationInput }) =>
      locationService.update(id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success(getMessage('locations.update.success'))
    },
    onError: (error: Error) => {
      toast.error(error.message || getMessage('locations.update.error'))
    },
  })

  // Mutation: Delete location
  const deleteMutation = useMutation({
    mutationFn: (id: string) => locationService.delete(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success(getMessage('locations.delete.success'))
    },
    onError: (error: Error) => {
      // Check if error is the "hasAppointments" error
      if (error.message === 'locations.delete.hasAppointments') {
        toast.error(getMessage('locations.delete.hasAppointments'))
      } else {
        toast.error(error.message || getMessage('locations.delete.error'))
      }
    },
  })

  // Mutation: Toggle active
  const toggleActiveMutation = useMutation({
    mutationFn: (id: string) => locationService.toggleActive(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  // Mutation: Reorder locations
  const reorderMutation = useMutation({
    mutationFn: (orderedIds: string[]) => locationService.reorder(orderedIds),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  return {
    // Data
    locations,
    isLoading,
    error,
    refetch,

    // Mutations
    createLocation: createMutation.mutate,
    createLocationAsync: createMutation.mutateAsync,
    updateLocation: updateMutation.mutate,
    updateLocationAsync: updateMutation.mutateAsync,
    deleteLocation: deleteMutation.mutate,
    deleteLocationAsync: deleteMutation.mutateAsync,
    toggleActive: toggleActiveMutation.mutate,
    reorderLocations: reorderMutation.mutate,

    // Loading states
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}

/**
 * Hook for getting a single location by ID
 *
 * @param id - Location UUID
 * @returns Location data and loading state
 */
export function useLocation(id: string) {
  const {
    data: location,
    isLoading,
    error,
  } = useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: () => locationService.getById(id),
    enabled: !!id,
  })

  return {
    location,
    isLoading,
    error,
  }
}
