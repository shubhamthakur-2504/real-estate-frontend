import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X, AlertCircle } from 'lucide-react'

export function AddNoteModal({
  lead,
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
}) {
  const [note, setNote] = useState('')
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (isOpen) {
      setNote('')
      setErrors({})
    }
  }, [isOpen])

  const validateForm = () => {
    const newErrors = {}
    if (!note.trim()) newErrors.note = 'Note cannot be empty'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(note)
    }
  }

  if (!isOpen || !lead) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-black/35 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={() => !isSubmitting && onClose()}
    >
      <Card
        className="w-full max-w-md max-h-[90vh] overflow-y-auto scrollbar-hide p-6 border border-light dark:border-dark shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-light-primary dark:text-dark-primary">
            Add Note
          </h3>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-light-secondary dark:text-dark-secondary hover:text-light-primary dark:hover:text-dark-primary disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lead Info */}
        <div className="mb-4 p-3 bg-light-bg dark:bg-dark-bg rounded border border-light dark:border-dark">
          <p className="text-light-secondary dark:text-dark-secondary text-sm">
            <span className="font-medium">Lead:</span> {lead.buyerName || 'N/A'}
          </p>
          <p className="text-light-secondary dark:text-dark-secondary text-sm">
            <span className="font-medium">Property:</span> {lead.property?.title || 'N/A'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Note */}
          <div>
            <label className="block text-sm font-medium text-light-primary dark:text-dark-primary mb-2">
              Note <span className="text-red-500">*</span>
            </label>
            <textarea
              value={note}
              onChange={(e) => {
                setNote(e.target.value)
                if (errors.note) setErrors({})
              }}
              disabled={isSubmitting}
              placeholder="Enter your note here..."
              rows={6}
              className="w-full px-3 py-2 border border-light dark:border-dark rounded bg-light-bg dark:bg-dark-bg text-light-primary dark:text-dark-primary placeholder:text-light-secondary dark:placeholder:text-dark-secondary focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 resize-none"
            />
            {errors.note && (
              <div className="mt-2 flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                <AlertCircle size={14} />
                {errors.note}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary text-primary-foreground hover:brightness-110 disabled:opacity-50"
            >
              {isSubmitting ? 'Adding...' : 'Add Note'}
            </Button>
            <Button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              variant="outline"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
