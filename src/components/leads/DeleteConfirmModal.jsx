import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X, AlertTriangle } from 'lucide-react'

export function DeleteConfirmModal({
  lead,
  isOpen,
  onClose,
  onConfirm,
  isDeleting = false,
}) {
  if (!isOpen || !lead) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-black/35 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={() => !isDeleting && onClose()}
    >
      <Card
        className="w-full max-w-md p-6 border border-light dark:border-dark shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-light-primary dark:text-dark-primary">
            Delete Lead
          </h3>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="text-light-secondary dark:text-dark-secondary hover:text-light-primary dark:hover:text-dark-primary disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Warning */}
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800 flex gap-3">
          <AlertTriangle className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <p className="font-semibold text-red-700 dark:text-red-300">Are you sure?</p>
            <p className="text-sm text-red-600 dark:text-red-400 mt-1">
              This action cannot be undone. The lead will be permanently deleted.
            </p>
          </div>
        </div>

        {/* Lead Info */}
        <div className="mb-6 p-3 bg-light-bg dark:bg-dark-bg rounded border border-light dark:border-dark">
          <p className="text-light-secondary dark:text-dark-secondary text-sm">
            <span className="font-medium">Lead:</span> {lead.buyerName || 'N/A'}
          </p>
          <p className="text-light-secondary dark:text-dark-secondary text-sm">
            <span className="font-medium">Email:</span> {lead.buyerEmail || 'N/A'}
          </p>
          <p className="text-light-secondary dark:text-dark-secondary text-sm">
            <span className="font-medium">Property:</span> {lead.property?.title || 'N/A'}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          <Button
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete Lead'}
          </Button>
          <Button
            onClick={onClose}
            disabled={isDeleting}
            variant="outline"
            className="border-light dark:border-dark"
          >
            Cancel
          </Button>
        </div>
      </Card>
    </div>
  )
}
