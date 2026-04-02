import { Suspense } from "react";
import { tagsApi } from "@/lib/api-client";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import UnifiedPagination from "@/components/shared/UnifiedPagination";
import LocalSearch from "@/components/shared/search/LocalSearch";
import { TagFilters } from "@/constants/filters";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Tags - Diễn đàn Võ thuật" };

interface SearchParamsProps {
  searchParams: { q?: string; filter?: string; page?: string };
}

const Page = async ({ searchParams }: SearchParamsProps) => {
  const page = searchParams.page ? +searchParams.page : 1;
  const params: Record<string, any> = { page };
  if (searchParams.q) params.q = searchParams.q;
  if (searchParams.filter) params.filter = searchParams.filter;

  let tags: any[] = [];
  let isNext = false;

  try {
    const res = await tagsApi.getAll(params) as any;
    tags = res?.tags || res || [];
    isNext = res?.isNext || false;
  } catch {
    // API chưa chạy
  }

  return (
    <>
      <div>
        <h1 className="text-xl font-bold text-dark100_light900">Chủ đề</h1>
        <p className="mt-0.5 text-sm text-dark400_light700">Khám phá các chủ đề võ thuật</p>
      </div>

      <div className="mt-4 flex gap-3 max-sm:flex-col sm:items-center">
        <Suspense fallback={null}>
          <LocalSearch
            route="/tags"
            iconPosition="left"
            imgSrc="/assets/icons/search.svg"
            placeholder="Tìm kiếm chủ đề…"
            otherClasses="flex-1"
          />
          <Filter filters={TagFilters} otherClasses="min-h-[40px] sm:min-w-[160px]" />
        </Suspense>
      </div>

      <section className="mt-4">
        {tags.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
            {tags.map((tag: any) => (
              <Link
                href={`/tags/${tag.slug}`}
                key={tag._id}
                className="group flex items-center justify-between border-b border-light-700 dark:border-dark-400 py-4 pr-2 hover:bg-light-800/50 dark:hover:bg-dark-300/50 transition-colors px-1 rounded-sm"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-500/10 text-primary-500">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </span>
                  <span className="text-sm font-semibold text-dark300_light700 group-hover:text-primary-500 transition-colors truncate">
                    {tag.name}
                  </span>
                </div>
                <span className="shrink-0 text-xs font-medium text-dark400_light700 ml-3">
                  {tag.questionsCount || tag.questions?.length || 0} bài
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <NoResult
            title="Không tìm thấy chủ đề nào"
            description="Hãy đăng bài và gắn tag để bắt đầu thảo luận!"
            link="/ask-question"
            linkTitle="Đăng bài"
          />
        )}
      </section>

      {isNext && (
        <div className="mt-6">
          <UnifiedPagination pageNumber={page} isNext={isNext} showPageNumbers />
        </div>
      )}
    </>
  );
};

export default Page;
