'use client'

import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { CheckCircle, Clock, Eye, MoreHorizontal, XCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui'
import { getMessage } from '@/lib/messages'
import { createClient } from '@/lib/supabase/client'

interface Professional {
  id: string
  email: string
  full_name: string
  account_status: 'trial' | 'active' | 'readonly' | 'suspended'
  trial_expires_at: string | null
  created_at: string
}

const STATUS_CONFIG: Record<
  string,
  { label: string; variant: 'default' | 'success' | 'warning' | 'destructive' | 'secondary' }
> = {
  trial: { label: 'Trial', variant: 'warning' },
  active: { label: 'Activo', variant: 'success' },
  readonly: { label: 'Solo lectura', variant: 'secondary' },
  suspended: { label: 'Suspendido', variant: 'destructive' },
}

/**
 * Professionals Table Component
 *
 * Client component con tabla de profesionales y acciones.
 *
 * @ticket T-1-07
 */
export function ProfessionalsTable() {
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    void fetchProfessionals()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchProfessionals = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, account_status, trial_expires_at, created_at')
      .eq('role', 'professional')
      .order('created_at', { ascending: false })

    if (error) {
      toast.error('Error al cargar profesionales')
      return
    }

    setProfessionals((data ?? []) as Professional[])
    setIsLoading(false)
  }

  const updateStatus = async (id: string, newStatus: string) => {
    /* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
    const { error } = await (supabase.from('profiles') as any)
      .update({
        account_status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
    /* eslint-enable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */

    if (error) {
      toast.error('Error al actualizar estado')
      return
    }

    const statusLabel = STATUS_CONFIG[newStatus]?.label ?? newStatus
    toast.success(`Estado actualizado a ${statusLabel}`)
    void fetchProfessionals()
  }

  const extendTrial = async (id: string, days: number) => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('trial_expires_at')
      .eq('id', id)
      .single()

    const trialExpiry = (profile as { trial_expires_at: string | null } | null)?.trial_expires_at
    const baseDate = trialExpiry ? new Date(trialExpiry) : new Date()

    const newExpiry = new Date(baseDate)
    newExpiry.setDate(newExpiry.getDate() + days)

    /* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
    const { error } = await (supabase.from('profiles') as any)
      .update({
        trial_expires_at: newExpiry.toISOString(),
        account_status: 'trial',
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
    /* eslint-enable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */

    if (error) {
      toast.error('Error al extender trial')
      return
    }

    toast.success(`Trial extendido ${days} días`)
    void fetchProfessionals()
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="h-48 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{getMessage('admin.dashboard.professionals')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{getMessage('admin.professionals.table.name')}</TableHead>
              <TableHead>{getMessage('admin.professionals.table.email')}</TableHead>
              <TableHead>{getMessage('admin.professionals.table.status')}</TableHead>
              <TableHead>{getMessage('admin.professionals.table.trialEnds')}</TableHead>
              <TableHead>Registrado</TableHead>
              <TableHead className="w-[50px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {professionals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No hay profesionales registrados
                </TableCell>
              </TableRow>
            ) : (
              professionals.map((pro) => (
                <TableRow key={pro.id}>
                  <TableCell className="font-medium">{pro.full_name}</TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">{pro.email}</TableCell>
                  <TableCell>
                    <Badge variant={STATUS_CONFIG[pro.account_status]?.variant}>
                      {STATUS_CONFIG[pro.account_status]?.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {pro.trial_expires_at ? (
                      <span
                        className={
                          new Date(pro.trial_expires_at) < new Date()
                            ? 'text-red-600 dark:text-red-400'
                            : ''
                        }
                      >
                        {formatDistanceToNow(new Date(pro.trial_expires_at), {
                          addSuffix: true,
                          locale: es,
                        })}
                      </span>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">
                    {formatDistanceToNow(new Date(pro.created_at), {
                      addSuffix: true,
                      locale: es,
                    })}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => void updateStatus(pro.id, 'active')}>
                          <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                          {getMessage('admin.professionals.activate')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => void extendTrial(pro.id, 7)}>
                          <Clock className="h-4 w-4 mr-2 text-blue-600" />
                          Extender trial 7 días
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => void extendTrial(pro.id, 14)}>
                          <Clock className="h-4 w-4 mr-2 text-blue-600" />
                          Extender trial 14 días
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => void updateStatus(pro.id, 'readonly')}>
                          <Eye className="h-4 w-4 mr-2 text-yellow-600" />
                          Modo solo lectura
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => void updateStatus(pro.id, 'suspended')}
                          className="text-red-600"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          {getMessage('admin.professionals.suspend')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
