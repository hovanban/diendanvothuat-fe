"use client";

import Image from "next/image";
import Link from "next/link";
import StarRating from "../shared/StarRating";
import { htmlToText } from "@/lib/utils";

interface Club {
  _id: string;
  name: string;
  slug: string;
  thumbnail?: string;
  description?: string;
  activityTime?: string;
  isApproved: boolean;
  averageRating?: number;
  totalReviews?: number;
  totalMembers?: number;
  martialArt?: { _id: string; name: string };
  province?: { _id: string; name: string };
}

interface Props {
  club: Club;
  isOwner?: boolean;
}


export default function ClubCard({ club, isOwner }: Props) {
  const excerpt = club.description ? htmlToText(club.description).slice(0, 120) : "";

  return (
    <article className="flex gap-4 border-b border-light-700 dark:border-dark-400 py-5 first:pt-0">
      {/* Thumbnail */}
      <Link href={`/clb/${club.slug}`} className="shrink-0">
        {club.thumbnail ? (
          <div className="relative h-20 w-20 overflow-hidden rounded-lg bg-light-700 dark:bg-dark-400">
            <Image src={club.thumbnail} alt={club.name} fill className="object-cover" unoptimized />
          </div>
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-primary-500/10 text-primary-500 shrink-0">
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0">
        {/* Name */}
        <Link href={`/clb/${club.slug}`} className="group">
          <h3 className="text-[15px] font-semibold leading-snug text-dark200_light900 group-hover:text-primary-500 transition-colors line-clamp-1">
            {club.name}
          </h3>
        </Link>

        {/* Meta tags */}
        <div className="mt-1 flex flex-wrap items-center gap-2">
          {club.martialArt && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary-500/10 px-2 py-0.5 text-[11px] font-medium text-primary-600 dark:text-primary-400">
              {club.martialArt.name}
            </span>
          )}
          {club.province && (
            <span className="inline-flex items-center gap-1 text-xs text-dark400_light700">
              <svg className="h-3 w-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {club.province.name}
            </span>
          )}
          {club.activityTime && (
            <span className="inline-flex items-center gap-1 text-xs text-dark400_light700">
              <svg className="h-3 w-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {club.activityTime}
            </span>
          )}
        </div>

        {/* Excerpt */}
        {excerpt && (
          <p className="mt-1.5 text-sm leading-relaxed text-dark400_light700 line-clamp-2">
            {excerpt}
          </p>
        )}

        {/* Rating + owner action */}
        <div className="mt-2 flex items-center justify-between gap-3">
          {club.totalReviews && club.totalReviews > 0 ? (
            <StarRating
              rating={club.averageRating || 0}
              totalReviews={club.totalReviews}
              size="sm"
              showNumber={true}
            />
          ) : (
            <span className="text-xs text-dark400_light700">Chưa có đánh giá</span>
          )}

          {isOwner && (
            <Link
              href={`/clb/edit/${club._id}`}
              className="text-xs font-medium text-primary-500 hover:underline shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              Chỉnh sửa
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
