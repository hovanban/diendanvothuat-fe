import { adminApi } from "@/lib/api-client";
import { auth } from "@/lib/auth";
import MartialArtFilters from "@/components/admin/MartialArtFilters";
import MartialArtActionsMenu from "@/components/admin/MartialArtActionsMenu";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

interface Props {
  searchParams: { [key: string]: string | undefined };
}

export default async function AdminMartialArtsPage({ searchParams }: Props) {
  const session = await auth();
  const token = (session as any)?.apiToken;

  let result: any = { martialArts: [], totalMartialArts: 0, isNext: false };
  try {
    result = await adminApi.getMartialArts(token) as any;
    if (Array.isArray(result)) result = { martialArts: result, totalMartialArts: result.length, isNext: false };
  } catch {
    // API chưa chạy
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="border-l-4 border-l-slate-500 pl-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-dark400_light700">Management</p>
          <h1 className="mt-0.5 text-2xl font-bold text-dark100_light900">Martial Arts</h1>
          <p className="mt-1 text-sm text-dark400_light700">
            {result.totalMartialArts} môn võ
          </p>
        </div>
        <Link
          href="/admin/martial-arts/create"
          className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Tạo Môn Võ
        </Link>
      </div>

      {/* Filters */}
      <Suspense fallback={null}>
        <MartialArtFilters />
      </Suspense>

      {/* Grid */}
      {result.martialArts?.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {result.martialArts.map((martialArt: any) => (
            <div
              key={martialArt._id}
              className="group overflow-hidden rounded-xl border border-light-700 dark:border-dark-400 border-l-4 border-l-slate-500 background-light900_dark200 transition-all duration-200 hover:shadow-md"
            >
              {/* Thumbnail */}
              {martialArt.thumbnail && (
                <div className="relative h-40 w-full overflow-hidden">
                  <Image
                    src={martialArt.thumbnail}
                    alt={martialArt.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
              )}

              <div className="p-5">
                {/* Name + Badges */}
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/admin/martial-arts/${martialArt._id}`}
                      className="block text-base font-bold text-dark100_light900 hover:text-primary-500 transition-colors truncate"
                    >
                      {martialArt.name}
                    </Link>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {martialArt.isFeatured && (
                        <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-[11px] font-semibold text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300">
                          Nổi bật
                        </span>
                      )}
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                        martialArt.isHidden
                          ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                          : "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${martialArt.isHidden ? "bg-red-500" : "bg-green-500"}`} />
                        {martialArt.isHidden ? "Ẩn" : "Hiện"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {martialArt.description && (
                  <p className="mb-4 text-sm text-dark400_light700 line-clamp-2 leading-relaxed">
                    {martialArt.description}
                  </p>
                )}

                {/* Stats */}
                <div className="mb-4 flex items-center gap-4 text-xs text-dark400_light700">
                  <div className="flex items-center gap-1.5">
                    <svg className="h-3.5 w-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-semibold text-dark100_light900">{(martialArt.questionCount || 0).toLocaleString()}</span>
                    <span>câu hỏi</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <svg className="h-3.5 w-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <span className="font-semibold text-dark100_light900">{(martialArt.followerCount || 0).toLocaleString()}</span>
                    <span>followers</span>
                  </div>
                </div>

                {/* Meta + Actions */}
                <div className="flex items-center justify-between border-t border-light-700 dark:border-dark-400 pt-3">
                  <div className="text-[11px] text-dark400_light700 font-mono">
                    /{martialArt.slug} · #{martialArt.order}
                  </div>
                  <MartialArtActionsMenu
                    martialArtId={martialArt._id}
                    martialArtName={martialArt.name}
                    isHidden={martialArt.isHidden}
                    questionCount={martialArt.questionCount}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-light-700 dark:border-dark-400 background-light900_dark200 py-16 px-4">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
            <svg className="h-7 w-7 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <p className="text-base font-semibold text-dark100_light900">Chưa có môn võ nào</p>
          <p className="mt-1 text-sm text-dark400_light700">Tạo môn võ đầu tiên để bắt đầu</p>
          <Link
            href="/admin/martial-arts/create"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Tạo Môn Võ
          </Link>
        </div>
      )}
    </div>
  );
}
