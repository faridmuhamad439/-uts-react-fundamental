import React, { useState } from 'react';
import { Star } from 'lucide-react';

export default function StarRating({
  rating = 0,
  maxStars = 5,
  size = 18,
  interactive = false,
  onRatingChange
}) {
  const [hoverRating, setHoverRating] = useState(0);

  const displayRating = interactive && hoverRating > 0 ? hoverRating : rating;

  return (
    <div className={`star-rating-container ${interactive ? 'interactive' : ''}`}>
      {Array.from({ length: maxStars }, (_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= displayRating;

        return (
          <button
            key={starValue}
            type={interactive ? 'button' : undefined}
            disabled={!interactive}
            className={`star-btn ${isFilled ? 'filled' : 'empty'}`}
            onClick={() => interactive && onRatingChange && onRatingChange(starValue)}
            onMouseEnter={() => interactive && setHoverRating(starValue)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            aria-label={`Beri bintang ${starValue}`}
          >
            <Star
              size={size}
              fill={isFilled ? '#f59e0b' : 'none'}
              color={isFilled ? '#f59e0b' : '#9ca3af'}
            />
          </button>
        );
      })}
    </div>
  );
}
