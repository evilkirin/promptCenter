
import React, { useState } from 'react';
import { StarIcon } from './IconComponents';

interface RatingProps {
  rating: number;
  onRate?: (newRating: number) => void;
  readOnly?: boolean;
}

const Rating: React.FC<RatingProps> = ({ rating, onRate, readOnly = false }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleRate = (rate: number) => {
    if (onRate && !readOnly) {
      onRate(rate);
    }
  };

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const displayRating = hoverRating || rating;
        const isFilled = star <= displayRating;
        return (
          <button
            key={star}
            onClick={() => handleRate(star)}
            onMouseEnter={!readOnly ? () => setHoverRating(star) : undefined}
            onMouseLeave={!readOnly ? () => setHoverRating(0) : undefined}
            disabled={readOnly}
            className={`
              w-6 h-6 transition-colors duration-200
              ${isFilled ? 'text-yellow-400' : 'text-gray-600'}
              ${!readOnly && 'hover:text-yellow-300 cursor-pointer'}
            `}
          >
            <StarIcon />
          </button>
        );
      })}
       <span className="ml-2 text-sm font-semibold text-yellow-400">{rating.toFixed(1)}</span>
    </div>
  );
};

export default Rating;
