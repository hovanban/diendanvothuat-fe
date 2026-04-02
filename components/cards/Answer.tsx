import EditDeleteAction from "@/components/shared/EditDeleteAction";
import Metric from "@/components/shared/Metric";
import { getFormattedNumber, getTimestamp } from "@/lib/utils";
import Link from "next/link";

interface Props {
  currentUserId?: string | null;
  _id: string;
  question: {
    _id: string;
    title: string;
  };
  author: {
    _id: string;
    name: string;
    picture: string;
    username: string;
  };
  upvotes: number;
  createdAt: Date;
}

const Answer = ({
  currentUserId,
  _id,
  question,
  author,
  upvotes,
  createdAt,
}: Props) => {
  const authorId = (author._id || (author as any).id || "").toString();
  const showActionButtons = currentUserId && currentUserId === authorId;

  return (
    <Link
      href={`/question/${question._id}/#${_id}`}
      className="card-wrapper rounded-[10px] px-4 py-3 mb-3"
    >
      <div className="flex flex-col-reverse items-start justify-between gap-4 sm:flex-row">
        <div>
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {getTimestamp(createdAt)}
          </span>
          <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
            {question.title}
          </h3>
        </div>

        {currentUserId && showActionButtons && (
          <EditDeleteAction type="Answer" itemId={JSON.stringify(_id)} />
        )}
      </div>

      <div className="flex-between mt-4 w-full flex-wrap gap-3">
        <Metric
          imgUrl={author.picture}
          alt="user avatar"
          value={author.name}
          title={` • asked ${getTimestamp(createdAt)}`}
          href={`/profile/${authorId}`}
          textStyles="body-medium text-dark400_light700"
          isAuthor
          authorUsername={author.username}
        />

        <div className="flex-center gap-3">
          <Metric
            imgUrl="/assets/icons/like.svg"
            alt="like icon"
            value={getFormattedNumber(upvotes)}
            title=" Like"
            textStyles="small-medium text-dark400_light800"
          />
        </div>
      </div>
    </Link>
  );
};

export default Answer;
