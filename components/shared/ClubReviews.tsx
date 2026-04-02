"use client";

import React, { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import ReviewCard from "../cards/ReviewCard";
import UnifiedPagination from "./UnifiedPagination";
import { useSession } from "next-auth/react";

interface Review {
  _id: string; rating: number; review: string; createdAt: Date;
  user: { _id: string; name: string; picture?: string; username: string };
}

export interface ClubReviewsRef { refresh: () => void; }

const ClubReviews = forwardRef<ClubReviewsRef, { clubId: string }>(({ clubId }, ref) => {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isNext, setIsNext] = useState(false);
  const isAdmin = session?.user?.role === "admin";

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clubs/${clubId}/reviews?page=${page}&pageSize=10`);
      const data = await res.json();
      if (data.success) { setReviews(data.reviews); setTotal(data.total); setTotalPages(data.totalPages); setIsNext(data.isNext); }
    } catch { } finally { setLoading(false); }
  };

  useImperativeHandle(ref, () => ({ refresh: () => { setPage(1); fetchReviews(); } }));
  useEffect(() => { fetchReviews(); }, [clubId, page]);

  const handleDelete = (id: string) => {
    setReviews((p) => p.filter((r) => r._id !== id));
    setTotal((p) => p - 1);
    setTimeout(fetchReviews, 500);
  };

  if (loading) return <div className="text-dark400_light700 text-center">Đang tải đánh giá...</div>;
  if (total === 0) return <div className="text-dark400_light700 text-center">Chưa có đánh giá nào cho CLB này</div>;

  return (
    <div>
      <h3 className="text-dark100_light900 mb-4 text-xl font-semibold">Đánh giá từ thành viên ({total})</h3>
      <div className="space-y-4">
        {reviews.map((r) => <ReviewCard key={r._id} review={r} isAdmin={isAdmin} onDelete={handleDelete} />)}
      </div>
      {totalPages > 1 && (
        <div className="mt-6">
          <UnifiedPagination pageNumber={page} isNext={isNext} totalPages={totalPages} totalItems={total} showPageNumbers itemLabel="đánh giá" />
        </div>
      )}
    </div>
  );
});

ClubReviews.displayName = "ClubReviews";
export default ClubReviews;
