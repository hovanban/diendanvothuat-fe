import { getFormattedNumber, getTimestamp, htmlToText } from "@/lib/utils";
import Link from "next/link";
import EditDeleteAction from "../shared/EditDeleteAction";
import RenderTag from "../shared/RenderTag";

interface QuestionProps {
  _id: string;
  title: string;
  slug: string;
  content?: string;
  tags: { _id: string; name: string; slug?: string }[];
  author: { _id: string; name: string; picture: string; username: string };
  upvotes: string[];
  views: number;
  answers: Array<object>;
  createdAt: Date;
  currentUserId?: string | null;
}


const Question = ({ currentUserId, _id, title, slug, content, tags, author, upvotes, views, answers, createdAt }: QuestionProps) => {
  const showActions = currentUserId && currentUserId === author._id?.toString();
  const excerpt = content ? htmlToText(content).slice(0, 160) : "";

  return (
    <article className="border-b border-light-700 dark:border-dark-400 py-5 first:pt-0">
      {/* Title row */}
      <div className="flex items-start justify-between gap-3">
        <Link href={`/question/${slug}`} className="group flex-1 min-w-0">
          <h3 className="text-[16px] font-semibold leading-snug text-dark200_light900 group-hover:text-primary-500 transition-colors line-clamp-2">
            {title}
          </h3>
        </Link>
        {showActions && (
          <div className="shrink-0 pt-0.5">
            <EditDeleteAction type="Question" itemId={JSON.stringify(_id)} />
          </div>
        )}
      </div>

      {/* Excerpt */}
      {excerpt && (
        <Link href={`/question/${slug}`}>
          <p className="mt-2 text-sm leading-relaxed text-dark400_light700 line-clamp-2">
            {excerpt}
          </p>
        </Link>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <RenderTag key={tag._id} _id={tag._id} name={tag.name} slug={tag.slug || ""} />
          ))}
        </div>
      )}

      {/* Meta row */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
        {/* Author + time */}
        <div className="flex items-center gap-2 min-w-0">
          {author.picture?.startsWith("http") ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={author.picture} alt={author.name} className="h-5 w-5 rounded-full object-cover shrink-0" />
          ) : (
            <div className="h-5 w-5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-[10px] font-bold text-primary-600 dark:text-primary-400 flex items-center justify-center shrink-0">
              {author.name?.charAt(0)}
            </div>
          )}
          <Link href={`/profile/${author._id}`} className="text-xs font-medium text-dark400_light700 hover:text-primary-500 transition-colors truncate">
            {author.name}
          </Link>
          <span className="text-xs text-dark400_light700 shrink-0">·</span>
          <span className="text-xs text-dark400_light700 shrink-0">{getTimestamp(createdAt)}</span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-xs text-dark400_light700">
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {getFormattedNumber(upvotes.length)}
          </span>
          <span className="flex items-center gap-1 text-xs text-dark400_light700">
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            {getFormattedNumber(answers.length)}
          </span>
          <span className="flex items-center gap-1 text-xs text-dark400_light700">
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {getFormattedNumber(views)}
          </span>
        </div>
      </div>
    </article>
  );
};

export default Question;
