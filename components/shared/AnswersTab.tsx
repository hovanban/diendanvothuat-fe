import UnifiedPagination from "@/components/shared/UnifiedPagination";
import { usersApi } from "@/lib/api-client";
import Answer from "../cards/Answer";

interface Props {
  searchParams: { [key: string]: string | undefined };
  userId: any;
  currentUserId?: string | null;
}

const AnswersTab = async ({ searchParams, userId, currentUserId }: Props) => {
  const page = searchParams.page ? +searchParams.page : 1;
  let answers: any[] = [];
  let isNext = false;

  try {
    const res = await usersApi.getAnswers(userId.toString(), { page }) as any;
    answers = res?.answers || [];
    isNext = res?.isNext || false;
  } catch {}

  return (
    <>
      {answers.map((answer: any) => (
        <Answer
          key={answer._id}
          currentUserId={currentUserId}
          _id={answer._id}
          question={answer.question}
          author={answer.author}
          upvotes={answer.upvotes?.length || 0}
          createdAt={answer.createdAt}
        />
      ))}
      <div className="mt-3">
        <UnifiedPagination pageNumber={page} isNext={isNext} showPageNumbers />
      </div>
    </>
  );
};

export default AnswersTab;
