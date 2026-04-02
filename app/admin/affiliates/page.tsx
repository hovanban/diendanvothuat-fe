import { adminApi } from "@/lib/api-client";
import { auth } from "@/lib/auth";
import StatsCard from "@/components/admin/StatsCard";
import UnifiedPagination from "@/components/shared/UnifiedPagination";
import UserAvatar from "@/components/shared/UserAvatar";
import Link from "next/link";

interface Props {
  searchParams: { [key: string]: string | undefined };
}

const sortOptions = [
  { label: "Top Conversions", sortBy: "conversions", sortOrder: "desc" },
  { label: "Top Clicks", sortBy: "clicks", sortOrder: "desc" },
  { label: "Mới nhất", sortBy: "joinedAt", sortOrder: "desc" },
];

export default async function AdminAffiliatesPage({ searchParams }: Props) {
  const session = await auth();
  const token = (session as any)?.apiToken;

  let result: any = { affiliates: [], totalAffiliates: 0, totalPages: 1, hasMore: false };
  let overallStats: any = {
    totalAffiliates: 0,
    totalClicks: 0,
    clicksThisMonth: 0,
    totalConversions: 0,
    conversionsThisMonth: 0,
    overallConversionRate: 0,
  };

  try {
    result = await adminApi.getAffiliates({
      page: searchParams.page || "1",
      pageSize: "20",
      q: searchParams.q || "",
      sortBy: searchParams.sortBy || "conversions",
      sortOrder: searchParams.sortOrder || "desc",
    }, token) as any;
    overallStats = result?.stats || overallStats;
  } catch {
    // API chưa chạy
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-l-4 border-l-purple-500 pl-4">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-dark400_light700">Management</p>
        <h1 className="mt-0.5 text-2xl font-bold text-dark100_light900">Affiliates</h1>
        <p className="mt-1 text-sm text-dark400_light700">
          {result.totalAffiliates} affiliates đang hoạt động
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Affiliates"
          value={overallStats.totalAffiliates}
          color="purple"
          description="Tổng số người tham gia"
          icon={
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
        />
        <StatsCard
          title="Total Clicks"
          value={overallStats.totalClicks.toLocaleString()}
          color="blue"
          description={`${overallStats.clicksThisMonth} clicks tháng này`}
          icon={
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
          }
        />
        <StatsCard
          title="Total Conversions"
          value={overallStats.totalConversions.toLocaleString()}
          color="green"
          description={`${overallStats.conversionsThisMonth} conversions tháng này`}
          icon={
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatsCard
          title="Conversion Rate"
          value={`${overallStats.overallConversionRate}%`}
          color="orange"
          description="Tỷ lệ chuyển đổi trung bình"
          icon={
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
        />
      </div>

      {/* Search & Sort Bar */}
      <div className="flex flex-col gap-3 rounded-xl border border-light-700 dark:border-dark-400 background-light900_dark200 p-4 sm:flex-row sm:items-center">
        <form action="/admin/affiliates" method="GET" className="flex-1">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dark400_light700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              name="q"
              defaultValue={searchParams.q}
              placeholder="Tìm theo tên, username, email, code..."
              className="w-full rounded-lg border border-light-700 dark:border-dark-400 bg-transparent py-2.5 pl-10 pr-4 text-sm text-dark100_light900 placeholder:text-dark400_light700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
            {/* Preserve sort params */}
            {searchParams.sortBy && <input type="hidden" name="sortBy" value={searchParams.sortBy} />}
            {searchParams.sortOrder && <input type="hidden" name="sortOrder" value={searchParams.sortOrder} />}
          </div>
        </form>
        <div className="flex gap-2 flex-wrap">
          {sortOptions.map((opt) => (
            <Link
              key={opt.label}
              href={`/admin/affiliates?sortBy=${opt.sortBy}&sortOrder=${opt.sortOrder}${searchParams.q ? `&q=${searchParams.q}` : ""}`}
              className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                searchParams.sortBy === opt.sortBy || (!searchParams.sortBy && opt.sortBy === "conversions")
                  ? "bg-primary-500 text-white"
                  : "border border-light-700 dark:border-dark-400 text-dark100_light900 hover:background-light800_dark300"
              }`}
            >
              {opt.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-light-700 dark:border-dark-400 background-light900_dark200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-light-700 dark:border-dark-400 background-light800_dark300">
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-widest text-dark400_light700">User</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-widest text-dark400_light700">Affiliate Code</th>
                <th className="px-5 py-3.5 text-center text-[11px] font-semibold uppercase tracking-widest text-dark400_light700">Total Clicks</th>
                <th className="px-5 py-3.5 text-center text-[11px] font-semibold uppercase tracking-widest text-dark400_light700">Conversions</th>
                <th className="px-5 py-3.5 text-center text-[11px] font-semibold uppercase tracking-widest text-dark400_light700">Conv. Rate</th>
                <th className="px-5 py-3.5 text-center text-[11px] font-semibold uppercase tracking-widest text-dark400_light700">This Month</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-widest text-dark400_light700">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-light-700 dark:divide-dark-400">
              {result.affiliates?.length > 0 ? result.affiliates.map((affiliate: any) => (
                <tr key={affiliate._id} className="group transition-colors hover:background-light800_dark300">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <UserAvatar picture={affiliate.picture} name={affiliate.name} username={affiliate.username} size={38} />
                      <div>
                        <Link
                          href={`/admin/users/${affiliate._id}`}
                          className="block text-sm font-semibold text-dark100_light900 hover:text-primary-500 transition-colors"
                        >
                          {affiliate.name}
                        </Link>
                        <p className="text-xs text-dark400_light700">@{affiliate.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <code className="rounded-md bg-purple-100 px-2.5 py-1 text-xs font-mono font-semibold text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                      {affiliate.affiliateCode}
                    </code>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="text-sm font-bold text-dark100_light900">{(affiliate.totalClicks || 0).toLocaleString()}</span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="text-sm font-bold text-green-600 dark:text-green-400">{(affiliate.totalConversions || 0).toLocaleString()}</span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      affiliate.conversionRate >= 10
                        ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                        : affiliate.conversionRate >= 5
                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300"
                        : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                    }`}>
                      {affiliate.conversionRate}%
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <div className="text-sm font-medium text-dark100_light900">{(affiliate.clicksThisMonth || 0).toLocaleString()} <span className="text-xs text-dark400_light700 font-normal">clicks</span></div>
                    <div className="text-xs text-dark400_light700">{affiliate.conversionsThisMonth || 0} conversions</div>
                  </td>
                  <td className="px-5 py-4 text-sm text-dark400_light700 whitespace-nowrap">
                    {affiliate.affiliateJoinedAt
                      ? new Date(affiliate.affiliateJoinedAt).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })
                      : "N/A"}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                        <svg className="h-7 w-7 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-base font-semibold text-dark100_light900">
                        {searchParams.q ? "Không tìm thấy affiliate nào" : "Chưa có affiliate nào"}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {result.totalPages > 1 && (
        <UnifiedPagination
          pageNumber={searchParams.page ? +searchParams.page : 1}
          isNext={result.hasMore}
          totalPages={result.totalPages}
          showPageNumbers
        />
      )}
    </div>
  );
}
