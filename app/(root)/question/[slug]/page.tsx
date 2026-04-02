import { questionsApi, answersApi } from "@/lib/api-client";
import { auth } from "@/lib/auth";
import Answer from "@/components/forms/Answer";
import AllAnswers from "@/components/shared/AllAnswers";
import EditDeleteAction from "@/components/shared/EditDeleteAction";
import ParseHTML from "@/components/shared/ParseHTML";
import RenderTag from "@/components/shared/RenderTag";
import Votes from "@/components/shared/Votes";
import FacebookShareButton from "@/components/shared/FacebookShareButton";
import { getFormattedNumber, getTimestamp, htmlToText } from "@/lib/utils";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Props {
  params: { slug: string };
  searchParams: { filter?: string; page?: string };
}

export const revalidate = 120;

export async function generateMetadata({ params }: Omit<Props, "searchParams">): Promise<Metadata> {
  let question: any;
  try {
    const res = await questionsApi.getBySlug(params.slug) as any;
    question = res?.question || res;
  } catch {
    return { title: "Không tìm thấy câu hỏi" };
  }
  if (!question) return { title: "Không tìm thấy câu hỏi" };
  const description = question.content ? htmlToText(question.content).substring(0, 160) : "";
  const url = `${process.env.NEXT_PUBLIC_SERVER_URL || 'https://diendanvothuat.vn'}/question/${question.slug}`;
  return {
    title: question.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: question.title,
      description,
      url,
      type: 'article',
      locale: 'vi_VN',
      siteName: 'Diễn Đàn Võ Thuật',
    },
    twitter: { card: 'summary', title: question.title, description },
  };
}

export default async function QuestionDetailPage({ params, searchParams }: Props) {
  const session = await auth();
  const userId = (session?.user as any)?.id;
  const token = (session as any)?.apiToken;

  let question: any;
  let answersResult: any = { answers: [], isNextAnswer: false };

  try {
    const qRes = await questionsApi.getBySlug(params.slug) as any;
    question = qRes?.question || qRes;
  } catch {
    notFound();
  }

  if (!question) notFound();

  try {
    const aRes = await answersApi.getByQuestion(question._id, {
      sortBy: searchParams.filter || "",
      page: searchParams.page ? +searchParams.page : 1,
    }) as any;
    answersResult = aRes || { answers: [], isNextAnswer: false };
  } catch {}

  const isOwner = userId && question.author?._id === userId;
  const hasSaved = question.savedBy?.includes(userId) || false;
  const hasUpvoted = question.upvotes?.includes(userId) || false;
  const hasDownvoted = question.downvotes?.includes(userId) || false;
  const isBlocked = (session?.user as any)?.isBlocked || false;

  return (
    <article>
      {/* Author + actions row */}
      <div className="flex items-center justify-between gap-3">
        <Link href={`/profile/${question.author?._id}`} className="flex items-center gap-2 group">
          {question.author?.picture?.startsWith("http") ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={question.author.picture} alt="profile" className="h-7 w-7 rounded-full object-cover" />
          ) : (
            <Image src={question.author?.picture || "/assets/icons/avatar.svg"} alt="profile" className="rounded-full object-cover" width={28} height={28} />
          )}
          <span className="text-sm font-medium text-dark400_light700 group-hover:text-primary-500 transition-colors">
            {question.author?.name}
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Votes
            type="Question"
            itemId={JSON.stringify(question._id)}
            userId={userId ? JSON.stringify(userId) : undefined}
            upvotes={question.upvotes?.length || 0}
            hasupVoted={hasUpvoted}
            downvotes={question.downvotes?.length || 0}
            hasdownVoted={hasDownvoted}
            hasSaved={hasSaved}
          />
          {isOwner && <EditDeleteAction type="Question" itemId={JSON.stringify(question._id)} />}
        </div>
      </div>

      {/* Title */}
      <h1 className="mt-4 text-2xl font-bold leading-snug text-dark100_light900 sm:text-[26px]">
        {question.title}
      </h1>

      {/* Meta info */}
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-b border-light-700 dark:border-dark-400 pb-4">
        <span className="flex items-center gap-1.5 text-xs text-dark400_light700">
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {getTimestamp(question.createdAt)}
        </span>
        <span className="flex items-center gap-1.5 text-xs text-dark400_light700">
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          {getFormattedNumber(question.answers?.length || 0)} trả lời
        </span>
        <span className="flex items-center gap-1.5 text-xs text-dark400_light700">
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          {getFormattedNumber(question.views || 0)} lượt xem
        </span>
        <div className="ml-auto">
          <FacebookShareButton title={question.title} description={question.content?.replace(/<[^>]*>/g, "").substring(0, 160)} />
        </div>
      </div>

      {/* Content */}
      <div className="mt-6">
        <ParseHTML data={question.content} />
      </div>

      {/* Tags + share */}
      <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-light-700 dark:border-dark-400 pt-5">
        {question.tags?.map((tag: any) => (
          <RenderTag key={tag._id} _id={tag._id} name={tag.name} slug={tag.slug} />
        ))}
      </div>

      {/* Answers */}
      <div className="mt-8">
        <AllAnswers
          answers={answersResult.answers || []}
          userId={userId || null}
          totalAnswers={question.answers?.length || 0}
          filter={searchParams.filter}
          page={searchParams.page ? +searchParams.page : 1}
          isNext={answersResult.isNextAnswer || false}
          questionId={question._id.toString()}
          isUserBlocked={isBlocked}
        />
      </div>

      {/* Answer form */}
      <div className="mt-4">
        {userId ? (
          isBlocked ? (
            <div className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-5 text-center">
              <p className="font-semibold text-red-600 dark:text-red-400 mb-1">Tài khoản bị hạn chế</p>
              <p className="text-sm text-dark400_light700">Bạn không thể đăng bài hoặc bình luận.</p>
            </div>
          ) : (
            <Answer type="Create" question={question.content} questionId={question._id.toString()} authorId={userId} />
          )
        ) : (
          <div className="rounded-xl border border-light-700 dark:border-dark-400 bg-light-800 dark:bg-dark-300 p-5 text-center">
            <p className="text-sm text-dark400_light700">
              Bạn cần{" "}
              <Link href="/sign-in" className="font-semibold text-primary-500 hover:underline">đăng nhập</Link>
              {" "}để trả lời câu hỏi này.
            </p>
          </div>
        )}
      </div>
    </article>
  );
}
