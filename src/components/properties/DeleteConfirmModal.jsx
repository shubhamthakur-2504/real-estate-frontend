import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function DeleteConfirmModal({
  isOpen,
  property,
  onConfirm,
  onCancel,
  isDeleting,
}) {
  if (!isOpen || !property) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-black/35 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={() => !isDeleting && onCancel()}
    >
      <Card
        className="w-full max-w-sm p-6 border border-light dark:border-dark shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-light-primary dark:text-dark-primary mb-2">
          Delete Property
        </h3>
        <p className="text-light-secondary dark:text-dark-secondary mb-6">
          Are you sure you want to delete "{property.title}"? This action cannot be undone.
        </p>

        <div className="flex items-center gap-3">
          <Button
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
          <Button
            onClick={onCancel}
            disabled={isDeleting}
            variant="outline"
          >
            Cancel
          </Button>
        </div>
      </Card>
    </div>
  )
}
