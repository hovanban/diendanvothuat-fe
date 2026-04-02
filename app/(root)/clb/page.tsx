import { Suspense } from "react";
import { clubsApi, provincesApi, martialArtsApi } from "@/lib/api-client";
import ClubCard from "@/components/cards/ClubCard";
import ClubFilters from "@/components/shared/ClubFilters";
import NoResult from "@/components/shared/NoResult";
import UnifiedPagination from "@/components/shared/UnifiedPagination";
import CreateClubButton from "@/components/shared/CreateClubButton";

interface SearchParamsProps {
  searchParams: {
    page?: string;
    q?: string;
    province?: string;
    martialArt?: string;
  };
}

export const revalidate = 600;

export default async function ClubsPage({ searchParams }: SearchParamsProps) {
  const page = searchParams.page ? +searchParams.page : 1;
  const params: Record<string, any> = { page, pageSize: 12 };
  if (searchParams.q) params.q = searchParams.q;
  if (searchParams.province && searchParams.province !== "all") params.provinceId = searchParams.province;
  if (searchParams.martialArt && searchParams.martialArt !== "all") params.martialArtId = searchParams.martialArt;

  let clubs: any[] = [];
  let isNext = false;
  let provinces: any[] = [];
  let martialArts: any[] = [];

  try {
    const [clubsRes, provincesRes, martialArtsRes] = await Promise.all([
      clubsApi.getAll(params) as any,
      provincesApi.getAll() as any,
      martialArtsApi.getAll() as any,
    ]);

    clubs = clubsRes?.clubs || [];
    isNext = clubsRes?.isNext || false;
    provinces = provincesRes || [];
    martialArts = martialArtsRes || [];
  } catch (e) {
    // API chưa chạy
  }

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-dark100_light900">Câu lạc bộ Võ thuật</h1>
          <p className="mt-0.5 text-sm text-dark400_light700">Tìm câu lạc bộ gần bạn và tham gia luyện tập</p>
        </div>
        <CreateClubButton />
      </div>

      <Suspense fallback={null}>
        <ClubFilters provinces={provinces} martialArts={martialArts} />
      </Suspense>

      <div className="mt-4">
        {clubs.length > 0 ? (
          clubs.map((club: any) => (
            <ClubCard key={club._id} club={club} />
          ))
        ) : (
          <NoResult
            title="Không tìm thấy câu lạc bộ nào"
            description="Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác"
            link="/"
            linkTitle="Về trang chủ"
          />
        )}
      </div>

      {isNext && (
        <div className="mt-6">
          <UnifiedPagination pageNumber={page} isNext={isNext} showPageNumbers />
        </div>
      )}
    </>
  );
}
