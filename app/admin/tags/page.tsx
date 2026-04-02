import { adminApi } from "@/lib/api-client";
import { auth } from "@/lib/auth";
import TagFilters from "@/components/admin/TagFilters";
import TagActionsMenu from "@/components/admin/TagActionsMenu";
import Link from "next/link";
import { Suspense } from "react";

interface Props {
  searchParams: { [key: string]: string | undefined };
}

export default async function AdminTagsPage({ searchParams }: Props) {
  const session = await auth();
  const token = (session as any)?.apiToken;

  let result: any = { tags: [], totalTags: 0, isNext: false };
  try {
    result = await adminApi.getTags({
      page: searchParams.page || "1",
      pageSize: "20",
      q: searchParams.q || "",
      filter: searchParams.filter || "recent",
    }, token) as any;
  } catch {
    // API chưa chạy
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="border-l-4 border-l-teal-500 pl-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-dark400_light700">Management</p>
          <h1 className="mt-0.5 text-2xl font-bold text-dark100_light900">Tags</h1>
          <p className="mt-1 text-sm text-dark400_light700">
            {result.totalTags.toLocaleString()} total tags
          </p>
        </div>
      </div>

      {/* Filters */}
      <Suspense fallback={null}>
        <TagFilters />
      </Suspense>

      {/* Tags Grid */}
      {result.tags?.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {result.tags.map((tag: any) => (
            <div
              key={tag._id}
              className="group relative overflow-hidden rounded-xl border border-light-700 dark:border-dark-400 border-l-4 border-l-teal-500 background-light900_dark200 p-5 transition-all duration-200 hover:shadow-md"
            >
              {/* Header */}
              <div className="mb-3 flex items-start justify-between gap-3">
                <Link
                  href={`/admin/tags/${tag._id}`}
                  className="flex-1 text-base font-bold text-dark100_light900 hover:text-teal-600 dark:hover:text-teal-400 transition-colors line-clamp-1"
                >
                  #{tag.name}
                </Link>
                <TagActionsMenu tagId={tag._id} tagName={tag.name} questionCount={tag.questionCount} />
              </div>

              {/* Description */}
              {tag.description && (
                <p className="mb-4 text-sm text-dark400_light700 line-clamp-2 leading-relaxed">
                  {tag.description}
                </p>
              )}

              {/* Stats */}
              <div className="flex items-center gap-4 border-t border-light-700 dark:border-dark-400 pt-3">
                <div className="flex items-center gap-1.5 text-xs text-dark400_light700">
                  <svg className="h-3.5 w-3.5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-semibold text-dark100_light900">{(tag.questionCount || 0).toLocaleString()}</span>
                  <span>questions</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-dark400_light700">
                  <svg className="h-3.5 w-3.5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span className="font-semibold text-dark100_light900">{(tag.followerCount || 0).toLocaleString()}</span>
                  <span>followers</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-light-700 dark:border-dark-400 background-light900_dark200 py-16 px-4">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900/30">
            <svg className="h-7 w-7 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <p className="text-base font-semibold text-dark100_light900">No tags found</p>
          <p className="mt-1 text-sm text-dark400_light700">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Load More */}
      {result.isNext && (
        <div className="flex justify-center pt-2">
          <Link
            href={`/admin/tags?page=${(searchParams.page ? +searchParams.page : 1) + 1}${searchParams.q ? `&q=${searchParams.q}` : ""}${searchParams.filter ? `&filter=${searchParams.filter}` : ""}`}
            className="inline-flex items-center gap-2 rounded-lg border border-light-700 dark:border-dark-400 px-6 py-2.5 text-sm font-medium text-dark100_light900 transition-colors hover:background-light800_dark300"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            Load More
          </Link>
        </div>
      )}
    </div>
  );
}
