"use client";

import React from "react";
import Link from "next/link";
import StarRating from "../shared/StarRating";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

interface Review {
  _id: string;
  rating: number;
  review: string;
  createdAt: Date;
  user: { _id: string; name: string; picture?: string; username: string };
}

interface Props {
  review: Review;
  isAdmin?: boolean;
  onDelete?: (id: string) => void;
}

const ReviewCard = ({ review, isAdmin = false, onDelete }: Props) => {
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = async () => {
    if (!confirm("Bạn có chắc muốn xóa đánh giá này?")) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/reviews/${review._id}`, { method: "DELETE" });
      if (res.ok) onDelete?.(review._id);
      else alert("Có lỗi xảy ra khi xóa đánh giá");
    } catch { alert("Có lỗi xảy ra"); }
    finally { setIsDeleting(false); }
  };

  return (
    <div className="background-light900_dark200 light-border rounded-lg border p-6">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Link href={`/profile/${review.user._id}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={review.user.picture || "/assets/images/default-avatar.svg"} alt={review.user.name} className="rounded-full object-cover" style={{ width: 40, height: 40 }} />
          </Link>
          <div>
            <Link href={`/profile/${review.user._id}`} className="text-dark100_light900 hover:text-primary-500">
              <p className="font-semibold">{review.user.name}</p>
            </Link>
            <p className="text-dark400_light700 text-sm">@{review.user.username}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <StarRating rating={review.rating} showNumber={false} size="sm" />
          <p className="text-dark400_light700 text-xs">
            {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true, locale: vi })}
          </p>
        </div>
      </div>
      <p className="text-dark100_light900 whitespace-pre-wrap">{review.review}</p>
      {isAdmin && (
        <div className="mt-4 flex justify-end">
          <button onClick={handleDelete} disabled={isDeleting} className="text-red-500 hover:text-red-600 disabled:opacity-50">
            {isDeleting ? "Đang xóa..." : "🗑️ Xóa đánh giá"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
