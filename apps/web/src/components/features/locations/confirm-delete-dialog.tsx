'use client'

import { AlertTriangle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { getMessage } from '@/lib/messages/client'

interface ConfirmDeleteDialogProps {
  /** Whether the dialog is open */
  isOpen: boolean
  /** Callback to close the dialog */
  onClose: () => void
  /** Callback when delete is confirmed */
  onConfirm: () => void
  /** Whether deletion is in progress */
  isLoading?: boolean
  /** Name of the item to delete (for display) */
  itemName: string
}

/**
 * Confirmation dialog before deleting a location
 *
 * @description Shows warning message and requires explicit confirmation
 *
 * @ticket T-2-02
 */
export function ConfirmDeleteDialog({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  itemName,
}: ConfirmDeleteDialogProps) {
  const handleClose = () => {
    if (!isLoading) {
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <AlertTriangle className="h-5 w-5" />
            {getMessage('locations.delete.confirm')}
          </DialogTitle>
          <DialogDescription className="pt-2">
            ¿Estás seguro de que deseas eliminar <strong>{itemName}</strong>? Esta acción no se
            puede deshacer.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="pt-4">
          <Button type="button" variant="ghost" onClick={handleClose} disabled={isLoading}>
            {getMessage('common.cancel')}
          </Button>
          <Button type="button" variant="danger" onClick={onConfirm} isLoading={isLoading}>
            {getMessage('common.delete')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
