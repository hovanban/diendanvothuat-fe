import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { usersApi } from "@/lib/api-client";
import Question from "@/components/cards/Question";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import UnifiedPagination from "@/components/shared/UnifiedPagination";
import LocalSearch from "@/components/shared/search/LocalSearch";
import { QuestionFilters } from "@/constants/filters";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Yêu thích — Diễn đàn Võ thuật" };

interface SearchParamsProps {
  searchParams: { q?: string; filter?: string; page?: string };
}

export default async function CollectionPage({ searchParams }: SearchParamsProps) {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");

  const token = (session as any).apiToken;
  const page = searchParams.page ? +searchParams.page : 1;
  const params: Record<string, any> = { page };
  if (searchParams.q) params.q = searchParams.q;
  if (searchParams.filter) params.filter = searchParams.filter;

  let questions: any[] = [];
  let isNext = false;

  try {
    const res = await usersApi.getSaved(params, token) as any;
    questions = res?.questions || [];
    isNext = res?.isNext || false;
  } catch {}

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-dark100_light900">Bài viết yêu thích</h1>
          <p className="mt-0.5 text-sm text-dark400_light700">Những bài viết bạn đã lưu</p>
        </div>
      </div>

      <div className="mt-4 flex gap-3 max-sm:flex-col sm:items-center">
        <Suspense fallback={null}>
          <LocalSearch route="/collection" iconPosition="left" imgSrc="/assets/icons/search.svg" placeholder="Tìm bài viết đã lưu…" otherClasses="flex-1" />
          <Filter filters={QuestionFilters} otherClasses="min-h-[40px] sm:min-w-[160px]" />
        </Suspense>
      </div>

      <div className="mt-4">
        {questions.length > 0 ? (
          questions.map((question: any) => (
            <Question
              key={question._id}
              _id={question._id}
              title={question.title}
              slug={question.slug}
              content={question.content}
              tags={question.tags}
              author={question.author}
              upvotes={question.upvotes}
              views={question.views}
              answers={question.answers}
              createdAt={question.createdAt}
            />
          ))
        ) : (
          <NoResult
            title="Chưa có bài viết nào được lưu"
            description="Hãy khám phá và lưu những bài viết thú vị!"
            link="/ask-question"
            linkTitle="Đăng bài"
          />
        )}
      </div>

      {isNext && (
        <div className="mt-6">
          <UnifiedPagination pageNumber={page} isNext={isNext} showPageNumbers />
        </div>
      )}
    </>
  );
}
