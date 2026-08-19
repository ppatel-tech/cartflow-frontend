import { StarRating } from './StarRating'
import type { ReviewResponse } from '../../types/review.types'

export function ReviewList({
  reviews, currentUserId, onEdit, onDelete,
}: {
  reviews: ReviewResponse[]
  currentUserId?: number
  onEdit: (review: ReviewResponse) => void
  onDelete: (reviewId: number) => void
}) {
  if (reviews.length === 0) {
    return <p className="font-mono text-sm text-ink/50">No reviews yet.</p>
  }

  return (
    <div className="flex flex-col divide-y divide-hairline border-t border-hairline">
      {reviews.map((r) => (
        <div key={r.id} className="py-4">
          <div className="flex justify-between items-start mb-1">
            <div>
              <p className="font-body text-sm text-ink font-medium">{r.reviewerName}</p>
              <StarRating value={r.rating} readOnly />
            </div>
            {currentUserId === r.userId && (
              <div className="flex gap-3 font-mono text-xs">
                <button onClick={() => onEdit(r)} className="text-ink/60 hover:text-ink">Edit</button>
                <button onClick={() => onDelete(r.id)} className="text-brick hover:underline">Delete</button>
              </div>
            )}
          </div>
          {r.review && <p className="font-body text-sm text-ink/70 mt-2">{r.review}</p>}
          <p className="font-mono text-[10px] text-ink/30 mt-2">
            {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        </div>
      ))}
    </div>
  )
}