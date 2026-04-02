import UnifiedPagination from "@/components/shared/UnifiedPagination";
import { usersApi } from "@/lib/api-client";
import Question from "../cards/Question";

interface Props {
  searchParams: { [key: string]: string | undefined };
  userId: any;
  currentUserId?: string | null;
}

const QuestionsTab = async ({ searchParams, userId, currentUserId }: Props) => {
  const page = searchParams.page ? +searchParams.page : 1;
  let questions: any[] = [];
  let isNext = false;

  try {
    const res = await usersApi.getQuestions(userId.toString(), { page }) as any;
    questions = res?.questions || [];
    isNext = res?.isNext || false;
  } catch {}

  return (
    <>
      {questions.map((question: any) => (
        <Question
          key={question._id}
          _id={question._id}
          currentUserId={currentUserId}
          title={question.title}
          slug={question.slug}
          tags={question.tags}
          author={question.author}
          upvotes={question.upvotes}
          views={question.views}
          answers={question.answers}
          createdAt={question.createdAt}
        />
      ))}
      <div className="mt-3">
        <UnifiedPagination pageNumber={page} isNext={isNext} showPageNumbers />
      </div>
    </>
  );
};

export default QuestionsTab;
