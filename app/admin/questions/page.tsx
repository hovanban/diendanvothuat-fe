import { adminApi } from "@/lib/api-client";
import { auth } from "@/lib/auth";
import QuestionFilters from "@/components/admin/QuestionFilters";
import QuestionActionsMenu from "@/components/admin/QuestionActionsMenu";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

interface Props {
  searchParams: { [key: string]: string | undefined };
}

export default async function AdminQuestionsPage({ searchParams }: Props) {
  const session = await auth();
  const token = (session as any)?.apiToken;

  let result: any = { questions: [], totalQuestions: 0, isNext: false };
  let martialArts: any[] = [];

  try {
    const [questionsRes, maRes] = await Promise.all([
      adminApi.getQuestions({
        page: searchParams.page || "1",
        pageSize: "20",
        q: searchParams.q || "",
        filter: searchParams.filter || "",
        statusFilter: searchParams.status || "all",
        tagFilter: searchParams.tag || "",
        martialArtFilter: searchParams.martialArt || "",
      }, token) as any,
      adminApi.getMartialArts(token) as any,
    ]);
    result = questionsRes;
    martialArts = maRes?.martialArts || maRes || [];
  } catch {
    // API chưa chạy
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="border-l-4 border-l-indigo-500 pl-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-dark400_light700">Management</p>
          <h1 className="mt-0.5 text-2xl font-bold text-dark100_light900">Questions</h1>
          <p className="mt-1 text-sm text-dark400_light700">
            {result.totalQuestions.toLocaleString()} total questions
          </p>
        </div>
      </div>

      {/* Filters */}
      <Suspense fallback={null}>
        <QuestionFilters martialArts={martialArts} />
      </Suspense>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-light-700 dark:border-dark-400 background-light900_dark200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-light-700 dark:border-dark-400 background-light800_dark300">
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-widest text-dark400_light700">Question</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-widest text-dark400_light700">Author</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-widest text-dark400_light700">Martial Art</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-widest text-dark400_light700">Tags</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-widest text-dark400_light700">Status</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-widest text-dark400_light700">Stats</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-widest text-dark400_light700">Created</th>
                <th className="px-5 py-3.5 text-right text-[11px] font-semibold uppercase tracking-widest text-dark400_light700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-light-700 dark:divide-dark-400">
              {result.questions?.map((question: any) => (
                <tr key={question._id} className="group transition-colors hover:background-light800_dark300">
                  <td className="px-5 py-4 max-w-xs">
                    <Link
                      href={`/admin/questions/${question._id}`}
                      className="block text-sm font-semibold text-dark100_light900 line-clamp-2 hover:text-primary-500 transition-colors"
                    >
                      {question.title}
                    </Link>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full">
                        <Image
                          src={question.author?.picture || "/assets/icons/avatar.svg"}
                          alt={question.author?.name || ""}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-dark100_light900 leading-tight">{question.author?.name}</p>
                        <p className="text-xs text-dark400_light700">@{question.author?.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    {question.martialArt ? (
                      <span className="inline-flex items-center rounded-full bg-primary-500/10 px-2.5 py-1 text-[11px] font-semibold text-primary-500">
                        {question.martialArt.name}
                      </span>
                    ) : (
                      <span className="text-xs text-dark400_light700">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1">
                      {question.tags?.slice(0, 2).map((tag: any) => (
                        <span
                          key={tag._id}
                          className="inline-flex items-center rounded-full border border-light-700 dark:border-dark-400 px-2 py-0.5 text-[11px] text-dark300_light900"
                        >
                          {tag.name}
                        </span>
                      ))}
                      {question.tags?.length > 2 && (
                        <span className="text-[11px] text-dark400_light700">+{question.tags.length - 2}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      question.isHidden
                        ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                        : "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${question.isHidden ? "bg-red-500" : "bg-green-500"}`} />
                      {question.isHidden ? "Hidden" : "Visible"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-dark400_light700">
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span>{(question.views || 0).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-dark400_light700">
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span>{question.answers?.length || 0}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-dark400_light700">
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                        <span>{question.upvotes?.length || 0}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-dark400_light700 whitespace-nowrap">
                    {new Date(question.createdAt).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <QuestionActionsMenu
                      questionId={question._id}
                      isHidden={question.isHidden}
                      isApproved={question.isApproved}
                      questionTitle={question.title}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {result.questions?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30">
              <svg className="h-7 w-7 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-base font-semibold text-dark100_light900">No questions found</p>
            <p className="mt-1 text-sm text-dark400_light700">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
