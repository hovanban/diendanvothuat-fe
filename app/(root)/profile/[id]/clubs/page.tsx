import { usersApi } from "@/lib/api-client";
import { auth } from "@/lib/auth";
import ClubsTab from "@/components/shared/ClubsTab";
import UnifiedPagination from "@/components/shared/UnifiedPagination";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Props {
  params: { id: string };
  searchParams: { [key: string]: string | undefined };
}

export async function generateMetadata({ params }: Omit<Props, "searchParams">): Promise<Metadata> {
  try {
    const user = await usersApi.getById(params.id) as any;
    return { title: `CLB của ${user?.name || user?.username} - Diễn đàn Võ thuật` };
  } catch {
    return { title: "Câu lạc bộ - Diễn đàn Võ thuật" };
  }
}

export default async function ClubsPage({ params, searchParams }: Props) {
  const session = await auth();
  const userId = (session?.user as any)?.id;

  let userInfo: any;
  try {
    userInfo = await usersApi.getById(params.id) as any;
  } catch {
    notFound();
  }

  if (!userInfo) notFound();

  const isOwnProfile = userId === params.id || userId === (userInfo._id || userInfo.id)?.toString();

  return (
    <>
      <div className="mb-6">
        <Link
          href={`/profile/${params.id}`}
          className="flex items-center gap-2 text-primary-500 hover:underline mb-4"
        >
          <Image src="/assets/icons/arrow-left.svg" alt="back" width={20} height={20} className="invert-colors" />
          Quay lại Profile
        </Link>

        <div className="flex items-center gap-3">
          {userInfo.picture?.startsWith("http") ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={userInfo.picture} alt="profile picture" className="rounded-full object-cover" style={{ width: 60, height: 60 }} />
          ) : (
            <Image src={userInfo.picture || "/assets/icons/avatar.svg"} alt="profile picture" width={60} height={60} className="rounded-full object-cover" />
          )}
          <div>
            <h1 className="h2-bold text-dark100_light900">Câu lạc bộ của {userInfo.name}</h1>
            <p className="paragraph-regular text-dark200_light800">@{userInfo.username}</p>
          </div>
        </div>
      </div>

      <div className="mb-6 flex gap-4 border-b border-light-700 dark:border-dark-400">
        <Link href={`/profile/${params.id}`} className="paragraph-semibold text-dark400_light700 hover:text-primary-500 pb-3 border-b-2 border-transparent">
          Câu hỏi & Trả lời
        </Link>
        <Link href={`/profile/${params.id}/clubs`} className="paragraph-semibold text-primary-500 pb-3 border-b-2 border-primary-500">
          Câu lạc bộ
        </Link>
      </div>

      <div className="background-light900_dark300 rounded-lg p-6 border border-light-700 dark:border-dark-400">
        <div className="flex items-center justify-between mb-4">
          <h2 className="h3-semibold text-dark200_light900">🥋 Câu lạc bộ đã tạo</h2>
          {isOwnProfile && (
            <Link href="/clb/create">
              <button className="paragraph-medium primary-gradient text-light-900 min-h-[46px] px-4 py-3 rounded-lg">
                + Tạo CLB mới
              </button>
            </Link>
          )}
        </div>
        <ClubsTab searchParams={searchParams} userId={userInfo._id || userInfo.id} currentUserId={userId} />
      </div>
    </>
  );
}
