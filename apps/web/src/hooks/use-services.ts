'use client'

/**
 * useServices Hook
 *
 * TanStack Query hook for service management with optimistic updates.
 *
 * @ticket T-2-03
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { getMessage } from '@/lib/messages/client'
import { serviceService } from '@/services/services/service.service'
import type { CreateServiceInput, UpdateServiceInput } from '@/types/service.types'

const QUERY_KEY = ['services']

/**
 * Hook for managing services with TanStack Query
 *
 * @returns Service state and mutation functions
 */
export function useServices() {
  const queryClient = useQueryClient()

  // Query: Get all services
  const {
    data: services = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => serviceService.getAll(),
  })

  // Mutation: Create service
  const createMutation = useMutation({
    mutationFn: (input: CreateServiceInput) => serviceService.create(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success(getMessage('services.create.success'))
    },
    onError: (error: Error) => {
      toast.error(error.message || getMessage('services.create.error'))
    },
  })

  // Mutation: Update service
  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateServiceInput }) =>
      serviceService.update(id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success(getMessage('services.update.success'))
    },
    onError: (error: Error) => {
      toast.error(error.message || getMessage('services.update.error'))
    },
  })

  // Mutation: Delete service
  const deleteMutation = useMutation({
    mutationFn: (id: string) => serviceService.delete(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success(getMessage('services.delete.success'))
    },
    onError: (error: Error) => {
      // Check if error is the "hasAppointments" error
      if (error.message === 'services.delete.hasAppointments') {
        toast.error(getMessage('services.delete.hasAppointments'))
      } else {
        toast.error(error.message || getMessage('services.delete.error'))
      }
    },
  })

  // Mutation: Toggle online booking
  const toggleOnlineBookingMutation = useMutation({
    mutationFn: (id: string) => serviceService.toggleOnlineBooking(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  // Mutation: Toggle active
  const toggleActiveMutation = useMutation({
    mutationFn: (id: string) => serviceService.toggleActive(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  // Mutation: Reorder services
  const reorderMutation = useMutation({
    mutationFn: (orderedIds: string[]) => serviceService.reorder(orderedIds),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  return {
    // Data
    services,
    isLoading,
    error,
    refetch,

    // Mutations
    createService: createMutation.mutate,
    createServiceAsync: createMutation.mutateAsync,
    updateService: updateMutation.mutate,
    updateServiceAsync: updateMutation.mutateAsync,
    deleteService: deleteMutation.mutate,
    deleteServiceAsync: deleteMutation.mutateAsync,
    toggleOnlineBooking: toggleOnlineBookingMutation.mutate,
    toggleActive: toggleActiveMutation.mutate,
    reorderServices: reorderMutation.mutate,

    // Loading states
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}

/**
 * Hook for getting a single service by ID
 *
 * @param id - Service UUID
 * @returns Service data and loading state
 */
export function useService(id: string) {
  const {
    data: service,
    isLoading,
    error,
  } = useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: () => serviceService.getById(id),
    enabled: !!id,
  })

  return {
    service,
    isLoading,
    error,
  }
}
