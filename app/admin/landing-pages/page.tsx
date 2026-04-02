import { adminApi } from "@/lib/api-client";
import { auth } from "@/lib/auth";
import UnifiedPagination from "@/components/shared/UnifiedPagination";
import Link from "next/link";

interface Props {
  searchParams: { [key: string]: string | undefined };
}

export default async function AdminLandingPagesPage({ searchParams }: Props) {
  const session = await auth();
  const token = (session as any)?.apiToken;

  let result: any = { landingPages: [], total: 0, isNext: false, totalPages: 1 };
  let martialArts: any[] = [];
  let provinces: any[] = [];

  try {
    const [lpRes, maRes, pvRes] = await Promise.all([
      adminApi.getLandingPages({
        page: searchParams.page || "1",
        pageSize: "20",
        q: searchParams.q || "",
        martialArt: searchParams.martialArt || "",
        province: searchParams.province || "",
      }, token) as any,
      adminApi.getMartialArts(token) as any,
      adminApi.getProvinces(token) as any,
    ]);
    result = lpRes;
    martialArts = maRes?.martialArts || maRes || [];
    provinces = Array.isArray(pvRes) ? pvRes : (pvRes?.provinces || []);
  } catch {
    // API chưa chạy
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="border-l-4 border-l-purple-500 pl-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-dark400_light700">Management</p>
          <h1 className="mt-0.5 text-2xl font-bold text-dark100_light900">Landing Pages</h1>
          <p className="mt-1 text-sm text-dark400_light700">
            {result.total} landing pages SEO cho môn võ + tỉnh thành
          </p>
        </div>
        <Link
          href="/admin/landing-pages/create"
          className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 self-start sm:self-auto"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Tạo Landing Page
        </Link>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-light-700 dark:border-dark-400 background-light900_dark200 p-4">
        <form className="flex flex-wrap gap-3" action="/admin/landing-pages" method="GET">
          <div className="relative flex-1 min-w-[200px]">
            <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dark400_light700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              name="q"
              defaultValue={searchParams.q}
              placeholder="Tìm kiếm landing page..."
              className="w-full rounded-lg border border-light-700 dark:border-dark-400 bg-transparent py-2.5 pl-10 pr-4 text-sm text-dark100_light900 placeholder:text-dark400_light700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <select
            name="martialArt"
            defaultValue={searchParams.martialArt || ""}
            className="rounded-lg border border-light-700 dark:border-dark-400 bg-transparent px-3 py-2.5 text-sm text-dark100_light900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            <option value="">Tất cả môn võ</option>
            {martialArts.map((ma: any) => (
              <option key={ma._id} value={ma._id}>{ma.name}</option>
            ))}
          </select>
          <select
            name="province"
            defaultValue={searchParams.province || ""}
            className="rounded-lg border border-light-700 dark:border-dark-400 bg-transparent px-3 py-2.5 text-sm text-dark100_light900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            <option value="">Tất cả tỉnh</option>
            {provinces.map((pv: any) => (
              <option key={pv._id} value={pv._id}>{pv.name}</option>
            ))}
          </select>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
            </svg>
            Lọc
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-light-700 dark:border-dark-400 background-light900_dark200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-light-700 dark:border-dark-400 background-light800_dark300">
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-widest text-dark400_light700">Slug</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-widest text-dark400_light700">Title</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-widest text-dark400_light700">Môn võ</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-widest text-dark400_light700">Tỉnh</th>
                <th className="px-5 py-3.5 text-center text-[11px] font-semibold uppercase tracking-widest text-dark400_light700">Clubs</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-widest text-dark400_light700">Created</th>
                <th className="px-5 py-3.5 text-right text-[11px] font-semibold uppercase tracking-widest text-dark400_light700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-light-700 dark:divide-dark-400">
              {result.landingPages?.map((lp: any) => (
                <tr key={lp._id} className="group transition-colors hover:background-light800_dark300">
                  <td className="px-5 py-4">
                    <Link
                      href={`/hoc-vo/${lp.slug}`}
                      target="_blank"
                      className="inline-flex items-center gap-1.5 rounded-md bg-purple-100 px-2.5 py-1 text-xs font-mono font-semibold text-purple-700 hover:bg-purple-200 transition-colors dark:bg-purple-900/40 dark:text-purple-300 dark:hover:bg-purple-900/60"
                    >
                      /{lp.slug}
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </Link>
                  </td>
                  <td className="px-5 py-4 max-w-xs">
                    <p className="text-sm font-medium text-dark100_light900 line-clamp-1">{lp.title}</p>
                  </td>
                  <td className="px-5 py-4">
                    {lp.martialArt?.name ? (
                      <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {lp.martialArt.name}
                      </span>
                    ) : (
                      <span className="text-xs text-dark400_light700">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    {lp.province?.name ? (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-1 text-[11px] font-semibold text-green-700 dark:bg-green-900/40 dark:text-green-300">
                        {lp.province.name}
                      </span>
                    ) : (
                      <span className="text-xs text-dark400_light700">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="text-sm font-bold text-dark100_light900">{lp.clubCount || 0}</span>
                  </td>
                  <td className="px-5 py-4 text-sm text-dark400_light700 whitespace-nowrap">
                    {new Date(lp.createdAt).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/admin/landing-pages/${lp._id}/edit`}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-light-700 dark:border-dark-400 px-3 py-1.5 text-xs font-semibold text-dark100_light900 transition-colors hover:background-light800_dark300"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {result.landingPages?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
              <svg className="h-7 w-7 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <p className="text-base font-semibold text-dark100_light900">Chưa có landing page nào</p>
            <p className="mt-1 text-sm text-dark400_light700">Tạo landing page đầu tiên để bắt đầu SEO</p>
            <Link
              href="/admin/landing-pages/create"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Tạo Landing Page
            </Link>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-dark400_light700">
          Tổng số: <span className="font-semibold text-dark100_light900">{result.total}</span> landing pages
        </p>
        <UnifiedPagination
          pageNumber={searchParams.page ? +searchParams.page : 1}
          isNext={result.isNext}
          totalPages={result.totalPages}
          showPageNumbers
        />
      </div>
    </div>
  );
}
