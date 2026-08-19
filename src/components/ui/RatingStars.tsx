import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  reviewCount?: number;
  size?: number;
  showCount?: boolean;
}

const RatingStars: React.FC<RatingStarsProps> = ({ rating, reviewCount, size = 14, showCount = true }) => {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5" aria-label={`Rating: ${rating} out of 5 stars`}>
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            size={size}
            className={star <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'fill-stone-200 text-stone-200'}
          />
        ))}
      </div>
      {showCount && reviewCount !== undefined && (
        <span className="text-xs text-stone-500 font-sans">({reviewCount.toLocaleString()})</span>
      )}
    </div>
  );
};

export default RatingStars;
