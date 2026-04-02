"use client";

import React from "react";

interface Props {
  rating: number;
  totalReviews?: number;
  size?: "sm" | "md" | "lg";
  showNumber?: boolean;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

const SIZE = { sm: "h-4 w-4", md: "h-5 w-5", lg: "h-6 w-6" };
const TEXT = { sm: "text-sm", md: "text-base", lg: "text-lg" };

const StarRating = ({ rating, totalReviews, size = "md", showNumber = true, interactive = false, onRatingChange }: Props) => {
  const [hover, setHover] = React.useState(0);
  const display = interactive && hover > 0 ? hover : rating;

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= display;
          const partial = !filled && star - 1 < display ? ((display % 1) * 100).toFixed(0) : null;
          return (
            <div
              key={star}
              className={`relative ${interactive ? "cursor-pointer" : ""}`}
              onMouseEnter={() => interactive && setHover(star)}
              onMouseLeave={() => interactive && setHover(0)}
              onClick={() => interactive && onRatingChange?.(star)}
            >
              <svg
                className={`${SIZE[size]} ${filled ? "fill-yellow-500" : partial ? "fill-none" : "fill-gray-300 dark:fill-gray-600"}`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                {partial && (
                  <defs>
                    <linearGradient id={`p-${star}`}>
                      <stop offset={`${partial}%`} stopColor="#eab308" />
                      <stop offset={`${partial}%`} stopColor="currentColor" className="text-gray-300 dark:text-gray-600" />
                    </linearGradient>
                  </defs>
                )}
                <path fill={partial ? `url(#p-${star})` : undefined} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
          );
        })}
      </div>
      {showNumber && (
        <div className={`${TEXT[size]} text-dark400_light700`}>
          <span className="font-semibold text-dark100_light900">{rating.toFixed(1)}</span>
          {totalReviews !== undefined && <span className="ml-1">({totalReviews})</span>}
        </div>
      )}
    </div>
  );
};

export default StarRating;
