import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons'
import { faStar as faStarOutline } from '@fortawesome/free-regular-svg-icons'

/**
 * Display mode:  <StarRating value={4} />
 * Input mode:    <StarRating value={rating} onChange={setRating} interactive />
 */
export default function StarRating({ value = 0, onChange, interactive = false, size = 18 }) {
  const [hovered, setHovered] = useState(0)
  const display = interactive && hovered ? hovered : value

  return (
    <div
      className={`star-rating${interactive ? ' star-rating-interactive' : ''}`}
      role={interactive ? 'radiogroup' : 'img'}
      aria-label={interactive ? 'Rating' : `Rated ${value} out of 5 stars`}
      onMouseLeave={() => interactive && setHovered(0)}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className="star"
          style={{ width: size, height: size }}
          role={interactive ? 'radio' : undefined}
          aria-checked={interactive ? value === n : undefined}
          aria-label={interactive ? `${n} star${n > 1 ? 's' : ''}` : undefined}
          tabIndex={interactive ? 0 : undefined}
          onMouseEnter={() => interactive && setHovered(n)}
          onClick={() => interactive && onChange?.(n)}
          onKeyDown={(e) => {
            if (interactive && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault()
              onChange?.(n)
            }
          }}
        >
          <FontAwesomeIcon icon={n <= display ? faStarSolid : faStarOutline} />
        </span>
      ))}
    </div>
  )
}
