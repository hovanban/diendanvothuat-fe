"use client";

import React, { useRef } from "react";
import ReviewForm from "@/components/forms/ReviewForm";
import ClubReviews, { ClubReviewsRef } from "@/components/shared/ClubReviews";

interface Props {
  clubId: string;
}

const ClubReviewSection = ({ clubId }: Props) => {
  const reviewsRef = useRef<ClubReviewsRef>(null);

  const handleReviewSubmitted = () => {
    reviewsRef.current?.refresh();
  };

  return (
    <div className="mt-12 flex flex-col gap-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="h2-bold text-dark100_light900">Đánh giá từ thành viên</h2>
          <p className="text-dark400_light800">
            Chia sẻ trải nghiệm của bạn để giúp người khác tìm được CLB phù hợp
          </p>
        </div>

        {/* Review Form Button */}
        <div className="flex-shrink-0">
          <ReviewForm clubId={clubId} onReviewSubmitted={handleReviewSubmitted} />
        </div>
      </div>

      {/* Review List */}
      <div className="mt-2">
        <ClubReviews ref={reviewsRef} clubId={clubId} />
      </div>
    </div>
  );
};

export default ClubReviewSection;
