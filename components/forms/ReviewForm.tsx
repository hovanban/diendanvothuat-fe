"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useSignIn } from "@/components/providers/SignInProvider";
import StarRating from "../shared/StarRating";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";

interface Props { clubId: string; onReviewSubmitted?: () => void; }

const ReviewForm = ({ clubId, onReviewSubmitted }: Props) => {
  const { data: session } = useSession();
  const { openSignIn } = useSignIn();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const token = (session as any)?.apiToken;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!session) { openSignIn(); return; }
    if (rating === 0) { setError("Vui lòng chọn số sao"); return; }
    if (review.length < 10) { setError("Đánh giá phải có ít nhất 10 ký tự"); return; }
    if (review.length > 1000) { setError("Đánh giá không được vượt quá 1000 ký tự"); return; }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clubs/${clubId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ rating, content: review }),
      });
      if (res.ok) {
        setRating(0); setReview(""); setOpen(false);
        onReviewSubmitted?.();
        alert("Đánh giá của bạn đã được gửi thành công!");
      } else {
        const data = await res.json();
        setError(data.message || "Có lỗi xảy ra");
      }
    } catch { setError("Có lỗi xảy ra khi gửi đánh giá"); }
    finally { setIsSubmitting(false); }
  };

  if (!session) {
    return (
      <div className="flex items-center gap-3">
        <p className="text-dark400_light700">Bạn cần đăng nhập để đánh giá CLB này</p>
        <Button onClick={openSignIn} className="primary-gradient text-light-900">Đăng nhập</Button>
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="primary-gradient text-light-900">⭐ Viết đánh giá</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-dark100_light900">Đánh giá CLB này</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-dark100_light900 mb-2 block font-medium">Chọn số sao:</label>
            <StarRating rating={rating} showNumber={false} size="lg" interactive onRatingChange={setRating} />
          </div>
          <div>
            <label className="text-dark100_light900 mb-2 block font-medium">Nội dung đánh giá:</label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Chia sẻ trải nghiệm của bạn... (tối thiểu 10 ký tự)"
              className="background-light800_dark300 text-dark100_light900 light-border min-h-[150px] w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
              maxLength={1000}
            />
            <p className="text-dark400_light700 mt-1 text-sm">{review.length}/1000 ký tự</p>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="border-light-700 dark:border-dark-400">Hủy</Button>
            <Button type="submit" disabled={isSubmitting} className="primary-gradient text-light-900 disabled:opacity-50">
              {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewForm;
