'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Save, User } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { useAuthContext } from '@/components/providers/auth-provider'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { TimezoneSelect } from '@/components/ui/timezone-select'
import { useAuth } from '@/hooks/use-auth'
import { getMessage } from '@/lib/messages/client'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/database.types'

import { SlugInput } from './slug-input'

type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

/**
 * Profile form validation schema
 */
const profileSchema = z.object({
  full_name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  phone: z.string().optional(),
  slug: z
    .string()
    .min(3, 'El slug debe tener al menos 3 caracteres')
    .max(30, 'El slug no puede tener más de 30 caracteres')
    .regex(/^[a-z0-9-]+$/, 'Solo letras minúsculas, números y guiones'),
  timezone: z.string(),
})

type ProfileFormData = z.infer<typeof profileSchema>

/**
 * Profile form component for editing user profile
 *
 * @description Allows users to edit their personal information,
 * public URL slug, and timezone settings
 *
 * @ticket T-1-05
 */
export function ProfileForm() {
  const [isLoading, setIsLoading] = useState(false)
  const { profile, user } = useAuth()
  const { canMutate } = useAuthContext()
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
    watch,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: profile?.full_name ?? '',
      phone: profile?.phone ?? '',
      slug: profile?.slug ?? '',
      timezone: profile?.timezone ?? 'America/Santiago',
    },
  })

  const onSubmit = async (data: ProfileFormData) => {
    if (!canMutate) {
      toast.error(getMessage('account.trial.readOnlyMode'))
      return
    }

    if (!user?.id) {
      toast.error('Usuario no autenticado')
      return
    }

    try {
      setIsLoading(true)

      const updateData: ProfileUpdate = {
        full_name: data.full_name,
        phone: data.phone ?? null,
        slug: data.slug,
        timezone: data.timezone,
        updated_at: new Date().toISOString(),
      }

      /* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call */
      const { error } = await (supabase as any)
        .from('profiles')
        .update(updateData)
        .eq('id', user.id)
      /* eslint-enable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call */

      if (error) throw error

      toast.success('Perfil actualizado correctamente')
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Error al actualizar el perfil')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Información Personal
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <Avatar
              src={profile?.avatar_url ?? undefined}
              fallback={profile?.full_name?.charAt(0) ?? 'U'}
              size="xl"
            />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                {profile?.full_name ?? 'Usuario'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Tu foto se sincroniza desde Google
              </p>
            </div>
          </div>

          {/* Nombre */}
          <div className="space-y-2">
            <label
              htmlFor="full_name"
              className="text-sm font-medium text-gray-900 dark:text-gray-100"
            >
              Nombre completo
            </label>
            <Input
              id="full_name"
              {...register('full_name')}
              placeholder="Felipe González"
              error={errors.full_name?.message}
              disabled={!canMutate}
            />
          </div>

          {/* Teléfono */}
          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Teléfono
            </label>
            <Input
              id="phone"
              {...register('phone')}
              placeholder="+56 9 1234 5678"
              disabled={!canMutate}
            />
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
              URL pública
            </label>
            <SlugInput
              value={watch('slug')}
              onChange={(value) => setValue('slug', value, { shouldDirty: true })}
              error={errors.slug?.message}
              disabled={!canMutate}
            />
          </div>

          {/* Zona horaria */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Zona horaria
            </label>
            <TimezoneSelect
              value={watch('timezone')}
              onChange={(value) => setValue('timezone', value, { shouldDirty: true })}
              disabled={!canMutate}
            />
          </div>
        </CardContent>

        <CardFooter className="border-t bg-gray-50 dark:bg-gray-800/50">
          <Button
            type="submit"
            isLoading={isLoading}
            disabled={!isDirty || !canMutate}
            className="ml-auto"
          >
            <Save className="mr-2 h-4 w-4" />
            Guardar cambios
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
