import Question from "@/components/cards/Question";
import NoResult from "@/components/shared/NoResult";
import UnifiedPagination from "@/components/shared/UnifiedPagination";
import AskQuestionButton from "@/components/shared/AskQuestionButton";
import { questionsApi } from "@/lib/api-client";
import { auth } from "@/lib/auth";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Trang Chủ - Diễn Đàn Võ Thuật" };
export const revalidate = 300;

interface Props {
  searchParams: { [key: string]: string | undefined };
}

export default async function Home({ searchParams }: Props) {
  const session = await auth();
  const userId = session?.user?.id;

  let questions: any[] = [];
  let isNext = false;

  try {
    const result = await questionsApi.getAll({
      searchQuery: searchParams.q || "",
      filter: searchParams.filter || "",
      page: searchParams.page || "1",
      pageSize: "15",
      ...(searchParams.martialArt ? { martialArt: searchParams.martialArt } : {}),
    }) as any;

    questions = result?.questions || [];
    isNext = result?.isNext || false;
  } catch (e) {
    // API chưa chạy
  }

  return (
    <>
      {/* Page header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-dark100_light900">Diễn Đàn Võ Thuật</h1>
          <p className="mt-0.5 text-sm text-dark400_light700">Chia sẻ, học hỏi, thảo luận về võ thuật</p>
        </div>
        <AskQuestionButton />
      </div>

      {/* Question list */}
      <div className="mt-4">
        {questions.length > 0 ? (
          <div>
            {questions.map((question: any) => (
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
                currentUserId={userId}
              />
            ))}
          </div>
        ) : (
          <NoResult
            title="Chưa có bài viết nào"
            description="Hãy là người đầu tiên chia sẻ! Đăng bài và bắt đầu thảo luận về võ thuật."
            link="/ask-question"
            linkTitle="Đăng bài"
          />
        )}
      </div>

      {isNext && (
        <div className="mt-6">
          <UnifiedPagination
            pageNumber={searchParams?.page ? +searchParams.page : 1}
            isNext={isNext}
            showPageNumbers
          />
        </div>
      )}
    </>
  );
}
