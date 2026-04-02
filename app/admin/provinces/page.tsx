import { adminApi } from "@/lib/api-client";
import { auth } from "@/lib/auth";
import AdminProvinceTable from "@/components/admin/provinces/AdminProvinceTable";
import AdminProvinceHeader from "@/components/admin/provinces/AdminProvinceHeader";
import UnifiedPagination from "@/components/shared/UnifiedPagination";
import { Suspense } from "react";

interface Props {
  searchParams: { [key: string]: string | undefined };
}

export default async function AdminProvincesPage({ searchParams }: Props) {
  const session = await auth();
  const token = (session as any)?.apiToken;

  let result: any = { provinces: [], totalProvinces: 0, isNext: false };
  try {
    const data = await adminApi.getProvinces(token) as any;
    const provinces = Array.isArray(data) ? data : (data?.provinces || []);
    result = { provinces, totalProvinces: provinces.length, isNext: false };
  } catch {
    // API chưa chạy
  }

  return (
    <div className="space-y-6">
      {/* Page Header (client — has dialog state) */}
      <Suspense fallback={
        <div className="border-l-4 border-l-green-500 pl-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-dark400_light700">Management</p>
          <h1 className="mt-0.5 text-2xl font-bold text-dark100_light900">Provinces</h1>
        </div>
      }>
        <AdminProvinceHeader />
      </Suspense>

      {/* Table */}
      <Suspense fallback={
        <div className="flex items-center justify-center rounded-xl border border-light-700 dark:border-dark-400 background-light900_dark200 py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
        </div>
      }>
        <AdminProvinceTable provinces={result.provinces} />
      </Suspense>

      {/* Footer */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-dark400_light700">
          Tổng số: <span className="font-semibold text-dark100_light900">{result.totalProvinces}</span> tỉnh/thành phố
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
