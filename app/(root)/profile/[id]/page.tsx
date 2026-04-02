import { usersApi } from "@/lib/api-client";
import { auth } from "@/lib/auth";
import { getFormattedNumber } from "@/lib/utils";
import ProfileActions from "@/components/shared/ProfileActions";
import QuestionsTab from "@/components/shared/QuestionsTab";
import AnswersTab from "@/components/shared/AnswersTab";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

interface Props {
  params: { id: string };
  searchParams: { [key: string]: string | undefined };
}

export async function generateMetadata({ params }: Omit<Props, "searchParams">): Promise<Metadata> {
  try {
    const user = await usersApi.getById(params.id) as any;
    return { title: `${user?.username || user?.name}'s Profile - Diễn đàn Võ thuật` };
  } catch {
    return { title: "Profile - Diễn đàn Võ thuật" };
  }
}

export default async function ProfilePage({ params, searchParams }: Props) {
  const session = await auth();
  const userId = (session?.user as any)?.id;

  let userInfo: any;
  try {
    userInfo = await usersApi.getById(params.id) as any;
  } catch {
    notFound();
  }

  if (!userInfo) notFound();

  const isOwnProfile = userId === params.id || userId === userInfo._id?.toString();

  const totalQuestions = userInfo.totalQuestions || 0;
  const totalAnswers = userInfo.totalAnswers || 0;
  const totalClubs = userInfo.totalClubs || 0;
  const badges = userInfo.badgeCounts || { GOLD: 0, SILVER: 0, BRONZE: 0 };
  const reputation = userInfo.reputation || 0;

  return (
    <>
      {/* Profile header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          {userInfo.picture?.startsWith("http") ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={userInfo.picture} alt="profile picture" className="h-16 w-16 rounded-full object-cover shrink-0" />
          ) : (
            <Image src={userInfo.picture || "/assets/icons/avatar.svg"} alt="profile picture" width={64} height={64} className="rounded-full object-cover shrink-0" />
          )}
          <div>
            <h1 className="text-xl font-bold text-dark100_light900">{userInfo.name}</h1>
            <p className="text-sm text-dark400_light700 mt-0.5">@{userInfo.username}</p>
            {reputation > 0 && (
              <p className="text-xs text-dark400_light700 mt-1">{reputation} điểm uy tín</p>
            )}
          </div>
        </div>
        <ProfileActions isOwnProfile={isOwnProfile} />
      </div>

      {/* Stats row */}
      <div className="mt-5 flex items-center gap-6 border-b border-light-700 dark:border-dark-400 pb-5">
        <div className="text-center">
          <p className="text-lg font-bold text-dark100_light900">{getFormattedNumber(totalQuestions)}</p>
          <p className="text-xs text-dark400_light700 mt-0.5">Bài viết</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-dark100_light900">{getFormattedNumber(totalAnswers)}</p>
          <p className="text-xs text-dark400_light700 mt-0.5">Trả lời</p>
        </div>
        {totalClubs > 0 && (
          <div className="text-center">
            <p className="text-lg font-bold text-dark100_light900">{getFormattedNumber(totalClubs)}</p>
            <p className="text-xs text-dark400_light700 mt-0.5">CLB</p>
          </div>
        )}
        {(badges.GOLD > 0 || badges.SILVER > 0 || badges.BRONZE > 0) && (
          <div className="ml-auto flex items-center gap-3">
            {badges.GOLD > 0 && (
              <span className="flex items-center gap-1 text-xs text-dark400_light700">
                <span className="text-yellow-500 font-bold">{badges.GOLD}</span> vàng
              </span>
            )}
            {badges.SILVER > 0 && (
              <span className="flex items-center gap-1 text-xs text-dark400_light700">
                <span className="text-slate-400 font-bold">{badges.SILVER}</span> bạc
              </span>
            )}
            {badges.BRONZE > 0 && (
              <span className="flex items-center gap-1 text-xs text-dark400_light700">
                <span className="text-amber-600 font-bold">{badges.BRONZE}</span> đồng
              </span>
            )}
          </div>
        )}
      </div>

      {/* Questions */}
      <div className="mt-6">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-dark400_light700 mb-4">Bài viết</p>
        <QuestionsTab searchParams={searchParams} userId={userInfo._id} currentUserId={userId} />
      </div>

      {/* Answers */}
      <div className="mt-8">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-dark400_light700 mb-4">Câu trả lời</p>
        <AnswersTab searchParams={searchParams} userId={userInfo._id} currentUserId={userId} />
      </div>
    </>
  );
}
