import UnifiedPagination from "@/components/shared/UnifiedPagination";
import { clubsApi } from "@/lib/api-client";
import ClubCard from "@/components/cards/ClubCard";
import Link from "next/link";

interface Props {
  searchParams: { [key: string]: string | undefined };
  userId: string;
  currentUserId?: string | null;
}

const ClubsTab = async ({ searchParams, userId, currentUserId }: Props) => {
  let clubs: any[] = [];
  let isNext = false;

  try {
    const result = await clubsApi.getAll({
      owner: userId,
      page: searchParams.page || "1",
      pageSize: "10",
    }) as any;
    clubs = result?.clubs || result || [];
    isNext = result?.isNext || false;
  } catch {
    // API chưa chạy
  }

  const isOwner = currentUserId === userId;

  return (
    <>
      {clubs.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:gap-5">
          {clubs.map((club: any) => (
            <ClubCard key={club._id} club={club} isOwner={isOwner} />
          ))}
        </div>
      ) : (
        <div className="paragraph-regular text-dark200_light800 text-center py-10">
          <p className="mb-4">
            {isOwner ? "Bạn chưa tạo câu lạc bộ nào." : "User này chưa tạo câu lạc bộ nào."}
          </p>
          {isOwner && (
            <Link
              href="/clb/create"
              className="primary-gradient min-h-[46px] px-6 py-3 text-light-900 rounded-lg inline-block"
            >
              Tạo câu lạc bộ đầu tiên
            </Link>
          )}
        </div>
      )}

      {clubs.length > 0 && (
        <div className="mt-4">
          <UnifiedPagination
            pageNumber={searchParams?.page ? +searchParams.page : 1}
            isNext={isNext}
            showPageNumbers
          />
        </div>
      )}
    </>
  );
};

export default ClubsTab;
