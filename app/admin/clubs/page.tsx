import { adminApi } from "@/lib/api-client";
import { auth } from "@/lib/auth";
import AdminClubTable from "@/components/admin/clubs/AdminClubTable";
import AdminClubHeader from "@/components/admin/clubs/AdminClubHeader";
import UnifiedPagination from "@/components/shared/UnifiedPagination";
import { Suspense } from "react";

interface Props {
  searchParams: { [key: string]: string | undefined };
}

export default async function AdminClubsPage({ searchParams }: Props) {
  const session = await auth();
  const token = (session as any)?.apiToken;

  let result: any = { clubs: [], totalClubs: 0, isNext: false };
  let creators: any[] = [];

  try {
    result = await adminApi.getClubs({
      page: searchParams.page || "1",
      pageSize: "20",
      q: searchParams.q || "",
      filter: searchParams.filter || "",
      province: searchParams.province || "all",
      martialArt: searchParams.martialArt || "all",
      status: searchParams.status || "all",
      createdBy: searchParams.createdBy || "all",
    }, token) as any;
  } catch {
    // API chưa chạy
  }

  return (
    <div className="space-y-6">
      {/* Page Header with filter — inside Suspense for useSearchParams */}
      <Suspense fallback={
        <div className="border-l-4 border-l-orange-500 pl-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-dark400_light700">Management</p>
          <h1 className="mt-0.5 text-2xl font-bold text-dark100_light900">Clubs</h1>
        </div>
      }>
        <AdminClubHeader creators={creators} totalClubs={result.totalClubs} />
      </Suspense>

      {/* Table */}
      <Suspense fallback={
        <div className="flex items-center justify-center rounded-xl border border-light-700 dark:border-dark-400 background-light900_dark200 py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
        </div>
      }>
        <AdminClubTable clubs={result.clubs || []} />
      </Suspense>

      {/* Footer stats + Pagination */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-dark400_light700">
          Tổng số: <span className="font-semibold text-dark100_light900">{result.totalClubs}</span> câu lạc bộ
        </p>
        <UnifiedPagination
          pageNumber={searchParams.page ? +searchParams.page : 1}
          isNext={result.isNext}
          showPageNumbers
        />
      </div>
    </div>
  );
}
