import Link from "next/link";
import Image from "next/image";
import Filter from "@/components/shared/Filter";
import Votes from "@/components/shared/Votes";
import UnifiedPagination from "@/components/shared/UnifiedPagination";
import AnswerActions from "@/components/shared/AnswerActions";
import ReplyList from "@/components/shared/ReplyList";
import { getTimestamp } from "@/lib/utils";
import { AnswerFilters } from "@/constants/filters";
import { answersApi } from "@/lib/api-client";

interface Props {
  answers: any[];
  userId: any;
  totalAnswers: number;
  filter?: string;
  page?: number;
  isNext: boolean;
  questionId: string;
  isUserBlocked?: boolean;
}

const AllAnswers = async ({
  answers,
  userId,
  totalAnswers,
  filter,
  page,
  isNext,
  questionId,
  isUserBlocked = false,
}: Props) => {
  // Fetch replies for each answer
  const answersWithReplies = await Promise.all(
    answers.map(async (answer) => {
      let replies: any[] = [];
      try {
        const res = await answersApi.getReplies(answer._id.toString()) as any;
        replies = res || [];
      } catch {}
      return { ...answer, replies };
    })
  );

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between">
        <h3 className="primary-text-gradient">{totalAnswers} Answers</h3>
        <Filter filters={AnswerFilters} />
      </div>
      <div>
        {answersWithReplies.map((answer: any) => {
          if (!answer.author) return null;
          const showActionButtons = userId ? userId.toString() === answer.author._id.toString() : false;

          return (
            <article key={answer._id} className="light-border border-b py-3">
              <div className="mb-3 flex flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center sm:gap-2">
                <Link href={`/profile/${answer.author._id}`} className="flex flex-1 items-start gap-1 sm:items-center">
                  {answer.author.picture?.startsWith("http") ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={answer.author.picture} alt="profile" className="rounded-full object-cover max-sm:mt-0.5" style={{ width: "18px", height: "18px" }} />
                  ) : (
                    <Image src={answer.author.picture || "/assets/icons/avatar.svg"} width={18} height={18} alt="profile" className="rounded-full object-cover max-sm:mt-0.5" style={{ width: "18px", height: "18px" }} />
                  )}
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <p className="body-semibold text-dark300_light700">{answer.author.name}</p>
                    <p className="small-regular text-light400_light500 ml-0.5 mt-0.5 line-clamp-1">
                      <span className="max-sm:hidden">• answered </span>
                      {getTimestamp(answer.createdAt)}
                    </p>
                  </div>
                </Link>
                <div className="flex justify-end">
                  <Votes
                    type="Answer"
                    itemId={JSON.stringify(answer._id)}
                    userId={userId ? JSON.stringify(userId) : undefined}
                    upvotes={answer.upvotes?.length || 0}
                    hasupVoted={userId ? answer.upvotes?.includes(userId) : false}
                    downvotes={answer.downvotes?.length || 0}
                    hasdownVoted={userId ? answer.downvotes?.includes(userId) : false}
                  />
                </div>
              </div>

              <AnswerActions
                answerId={answer._id.toString()}
                content={answer.content}
                questionId={questionId}
                authorId={answer.author._id.toString()}
                isOwner={showActionButtons}
                currentUserId={userId ? userId.toString() : ""}
                isUserBlocked={isUserBlocked}
              />

              <ReplyList
                answerId={answer._id.toString()}
                currentUserId={userId ? userId.toString() : null}
                initialReplies={answer.replies}
              />
            </article>
          );
        })}
      </div>

      <div className="mt-3 w-full">
        <UnifiedPagination pageNumber={page ? +page : 1} isNext={isNext} showPageNumbers />
      </div>
    </div>
  );
};

export default AllAnswers;
