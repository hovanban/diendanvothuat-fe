import { adminApi } from "@/lib/api-client";
import { auth } from "@/lib/auth";
import CommentFilters from "@/components/admin/CommentFilters";
import CommentActionsMenu from "@/components/admin/CommentActionsMenu";
import Link from "next/link";
import { Suspense } from "react";

interface Props {
  searchParams: { [key: string]: string | undefined };
}

export default async function AdminCommentsPage({ searchParams }: Props) {
  const session = await auth();
  const token = (session as any)?.apiToken;

  let result: any = { comments: [], totalComments: 0, isNext: false };
  try {
    result = await adminApi.getComments({
      page: searchParams.page || "1",
      pageSize: "20",
      q: searchParams.q || "",
      filter: searchParams.filter || "",
      statusFilter: searchParams.status || "all",
      userFilter: searchParams.user || "",
    }, token) as any;
  } catch {
    // API chưa chạy
  }

  const page = searchParams.page ? +searchParams.page : 1;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="border-l-4 border-l-pink-500 pl-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-dark400_light700">Management</p>
          <h1 className="mt-0.5 text-2xl font-bold text-dark100_light900">Comments</h1>
          <p className="mt-1 text-sm text-dark400_light700">
            {result.totalComments.toLocaleString()} total answers &amp; replies
          </p>
        </div>
      </div>

      {/* Filters */}
      <Suspense fallback={null}>
        <CommentFilters />
      </Suspense>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-light-700 dark:border-dark-400 background-light900_dark200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-light-700 dark:border-dark-400 background-light800_dark300">
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-widest text-dark400_light700">Author</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-widest text-dark400_light700">Content</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-widest text-dark400_light700">Question</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-widest text-dark400_light700">Type</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-widest text-dark400_light700">Votes</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-widest text-dark400_light700">Created</th>
                <th className="px-5 py-3.5 text-right text-[11px] font-semibold uppercase tracking-widest text-dark400_light700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-light-700 dark:divide-dark-400">
              {result.comments?.map((comment: any) => (
                <tr key={comment._id} className="group transition-colors hover:background-light800_dark300">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      {comment.author?.picture?.startsWith("http") ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={comment.author.picture}
                          alt={comment.author.name}
                          className="h-8 w-8 shrink-0 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pink-100 dark:bg-pink-900/30 text-xs font-bold text-pink-600 dark:text-pink-400">
                          {comment.author?.name?.charAt(0) || "?"}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-semibold text-dark100_light900 leading-tight">{comment.author?.name}</p>
                        <p className="text-xs text-dark400_light700">@{comment.author?.username}</p>
                        {comment.author?.isBlocked && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-red-500 font-medium">
                            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                            </svg>
                            Blocked
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 max-w-sm">
                    <p className="text-sm text-dark300_light900 line-clamp-2 leading-relaxed">
                      {(comment.content || "").replace(/<[^>]*>/g, "").substring(0, 120)}
                      {(comment.content || "").replace(/<[^>]*>/g, "").length > 120 && "..."}
                    </p>
                  </td>
                  <td className="px-5 py-4 max-w-xs">
                    {comment.question ? (
                      <Link
                        href={`/question/${comment.question.slug}`}
                        target="_blank"
                        className="block text-sm font-medium text-dark100_light900 hover:text-primary-500 transition-colors line-clamp-2"
                      >
                        {comment.question.title}
                      </Link>
                    ) : (
                      <span className="text-xs text-dark400_light700">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    {comment.parentAnswer ? (
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-1 text-[11px] font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                        Reply
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-pink-100 px-2.5 py-1 text-[11px] font-semibold text-pink-700 dark:bg-pink-900/40 dark:text-pink-300">
                        Answer
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-dark400_light700">
                        <svg className="h-3.5 w-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                        <span className="font-semibold text-dark100_light900">{comment.upvotes?.length || 0}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-dark400_light700">
                        <svg className="h-3.5 w-3.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                        <span className="font-semibold text-dark100_light900">{comment.downvotes?.length || 0}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <p className="text-xs text-dark400_light700">
                      {new Date(comment.createdAt).toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <CommentActionsMenu
                      commentId={comment._id.toString()}
                      authorId={comment.author?._id?.toString() || ""}
                      authorName={comment.author?.name || ""}
                      isUserBlocked={comment.author?.isBlocked || false}
                      questionSlug={comment.question?.slug}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {result.comments?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-pink-100 dark:bg-pink-900/30">
              <svg className="h-7 w-7 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-base font-semibold text-dark100_light900">No comments found</p>
            <p className="mt-1 text-sm text-dark400_light700">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {result.totalComments > 20 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-dark400_light700">
            Showing <span className="font-semibold text-dark100_light900">{(page - 1) * 20 + 1}</span>–<span className="font-semibold text-dark100_light900">{Math.min(page * 20, result.totalComments)}</span> of <span className="font-semibold text-dark100_light900">{result.totalComments}</span> comments
          </p>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={`/admin/comments?page=${page - 1}${searchParams.q ? `&q=${searchParams.q}` : ""}${searchParams.status ? `&status=${searchParams.status}` : ""}${searchParams.filter ? `&filter=${searchParams.filter}` : ""}`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-light-700 dark:border-dark-400 px-4 py-2 text-sm font-medium text-dark100_light900 transition-colors hover:background-light800_dark300"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </Link>
            )}
            {result.isNext && (
              <Link
                href={`/admin/comments?page=${page + 1}${searchParams.q ? `&q=${searchParams.q}` : ""}${searchParams.status ? `&status=${searchParams.status}` : ""}${searchParams.filter ? `&filter=${searchParams.filter}` : ""}`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-light-700 dark:border-dark-400 px-4 py-2 text-sm font-medium text-dark100_light900 transition-colors hover:background-light800_dark300"
              >
                Next
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
