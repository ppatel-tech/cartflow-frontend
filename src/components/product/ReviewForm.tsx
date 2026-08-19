import { useState, type FormEvent } from 'react'
import { StarRating } from './StarRating'
import { Button } from '../ui/Button'
import type { ReviewRequest } from '../../types/review.types'

interface ReviewFormProps {
  initialData?: ReviewRequest
  onSubmit: (data: ReviewRequest) => Promise<void>
  onCancel?: () => void
}

export function ReviewForm({ initialData, onSubmit, onCancel }: ReviewFormProps) {
  const [rating, setRating] = useState(initialData?.rating ?? 0)
  const [reviewText, setReviewText] = useState(initialData?.review ?? '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (rating === 0) {
      setError('Please select a rating')
      return
    }
    setError('')
    setIsSubmitting(true)
    try {
      await onSubmit({ rating, review: reviewText || undefined })
    } catch {
      setError('Could not submit review')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border border-hairline p-4 rounded-[4px] flex flex-col gap-3">
      <div>
        <label className="font-mono text-xs uppercase tracking-wider text-ink/70 mb-1.5 block">
          Your rating
        </label>
        <StarRating value={rating} onChange={setRating} />
      </div>

      <div>
        <label className="font-mono text-xs uppercase tracking-wider text-ink/70 mb-1.5 block">
          Review (optional)
        </label>
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          rows={3}
          className="w-full px-3 py-2.5 border border-hairline rounded-[4px] font-body text-sm bg-paper outline-none focus:border-forest"
        />
      </div>

      {error && <p className="font-mono text-xs text-brick">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit review'}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}