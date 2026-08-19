export function StarRating({ value, onChange, readOnly = false }: {
  value: number
  onChange?: (rating: number) => void
  readOnly?: boolean
}) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => onChange?.(star)}
          className={`text-lg leading-none ${readOnly ? 'cursor-default' : 'cursor-pointer'} ${
            star <= value ? 'text-brass' : 'text-hairline'
          }`}
        >
          ★
        </button>
      ))}
    </div>
  )
}