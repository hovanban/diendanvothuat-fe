import { Suspense } from "react";
import { tagsApi } from "@/lib/api-client";
import Question from "@/components/cards/Question";
import NoResult from "@/components/shared/NoResult";
import UnifiedPagination from "@/components/shared/UnifiedPagination";
import LocalSearch from "@/components/shared/search/LocalSearch";
import { auth } from "@/lib/auth";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface URLProps {
  params: { slug: string };
  searchParams: { q?: string; page?: string };
}

export async function generateMetadata({ params }: Omit<URLProps, "searchParams">): Promise<Metadata> {
  let tag: any;
  try {
    tag = await tagsApi.getBySlug(params.slug) as any;
  } catch {
    return { title: "Tag - Diễn đàn Võ thuật" };
  }
  const name = tag?.name || params.slug;
  const description = tag?.description || `Câu hỏi và thảo luận về ${name} trên Diễn Đàn Võ Thuật Việt Nam`;
  const url = `${process.env.NEXT_PUBLIC_SERVER_URL || 'https://diendanvothuat.vn'}/tags/${params.slug}`;
  return {
    title: name,
    description,
    alternates: { canonical: url },
    openGraph: { title: name, description, url, locale: 'vi_VN', siteName: 'Diễn Đàn Võ Thuật' },
    twitter: { card: 'summary', title: name, description },
  };
}

const Page = async ({ params, searchParams }: URLProps) => {
  const session = await auth();
  const userId = (session?.user as any)?.id;
  const page = searchParams.page ? +searchParams.page : 1;

  let tagTitle = params.slug;
  let questions: any[] = [];
  let isNext = false;

  try {
    const res = await tagsApi.getQuestions(params.slug, {
      q: searchParams.q || "",
      page,
    }) as any;
    tagTitle = res?.tagTitle || params.slug;
    questions = res?.questions || [];
    isNext = res?.isNext || false;
  } catch {
    // API chưa chạy
  }

  return (
    <>
      <div className="flex items-center justify-between w-full">
        <h1 className="h1-bold text-dark100_light900">{tagTitle}</h1>
        {userId && (
          <Link href={`/ask-question?martialArt=${params.slug}`}>
            <Button className="primary-gradient min-h-[46px] px-4 py-3 text-light-900">
              Đăng bài
            </Button>
          </Link>
        )}
      </div>

      <div className="mt-4 w-full">
        <Suspense fallback={null}>
          <LocalSearch
            route={`/tags/${params.slug}`}
            iconPosition="left"
            imgSrc="/assets/icons/search.svg"
            placeholder="Tìm kiếm câu hỏi trong tag"
            otherClasses="flex-1"
          />
        </Suspense>
      </div>

      <div className="mt-3 flex w-full flex-col gap-4">
        {questions.length > 0 ? (
          questions.map((question: any) => (
            <Question
              key={question._id}
              _id={question._id}
              currentUserId={userId}
              title={question.title}
              slug={question.slug}
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
            title="Không có câu hỏi nào trong tag này"
            description="Hãy là người đầu tiên đặt câu hỏi về chủ đề này!"
            link="/ask-question"
            linkTitle="Đăng bài"
          />
        )}
      </div>

      <div className="mt-3">
        <UnifiedPagination pageNumber={page} isNext={isNext} showPageNumbers />
      </div>
    </>
  );
};

export default Page;
