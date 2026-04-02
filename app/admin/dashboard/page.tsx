import { adminApi } from "@/lib/api-client";
import { auth } from "@/lib/auth";
import StatsCard from "@/components/admin/StatsCard";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const session = await auth();
  const token = (session as any)?.apiToken;

  let stats: any = {
    totalUsers: 0, activeUsers: 0, blockedUsers: 0, newUsersThisMonth: 0,
    totalQuestions: 0, newQuestionsThisMonth: 0,
    totalAnswers: 0, totalTags: 0,
    totalMartialArts: 0, totalProvinces: 0,
    totalClubs: 0, approvedClubs: 0, pendingClubs: 0, newClubsThisMonth: 0,
    totalLandingPages: 0,
    totalAffiliates: 0, newAffiliatesThisMonth: 0,
    totalAffiliateClicks: 0, affiliateClicksThisMonth: 0,
    totalAffiliateConversions: 0, affiliateConversionsThisMonth: 0,
    affiliateConversionRate: 0,
    topAffiliates: [], affiliateClicksGrowth: [],
    topContributors: [], recentUsers: [], userGrowth: [],
  };

  try {
    stats = await adminApi.getDashboardStats(token) as any;
  } catch { /* API chưa chạy */ }

  const now = new Date();
  const monthName = now.toLocaleString("vi-VN", { month: "long" });

  // Club approval rate
  const clubApprovalPct = stats.totalClubs > 0
    ? Math.round((stats.approvedClubs / stats.totalClubs) * 100) : 0;

  // Affiliate max clicks for bar chart
  const maxClicks = stats.affiliateClicksGrowth?.length > 0
    ? Math.max(...stats.affiliateClicksGrowth.map((g: any) => g.clicks), 1) : 1;

  return (
    <div className="space-y-8">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark100_light900">Tổng quan</h1>
          <p className="mt-1 text-sm text-dark400_light700">
            Dữ liệu cập nhật theo thời gian thực · {now.toLocaleDateString("vi-VN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <Link href="/admin/users" className="rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-500/90 transition-colors">
          + Quản lý
        </Link>
      </div>

      {/* ── Primary stats ── */}
      <section>
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-dark400_light700">Nội dung & Cộng đồng</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Thành viên"
            value={stats.totalUsers.toLocaleString()}
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
            description={`${stats.activeUsers} hoạt động · ${stats.blockedUsers} bị khóa`}
            badge={`+${stats.newUsersThisMonth} ${monthName}`}
            href="/admin/users"
            color="blue"
          />
          <StatsCard
            title="Câu hỏi"
            value={stats.totalQuestions.toLocaleString()}
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>}
            description={`${stats.totalAnswers.toLocaleString()} câu trả lời`}
            badge={`+${stats.newQuestionsThisMonth} ${monthName}`}
            href="/admin/questions"
            color="indigo"
          />
          <StatsCard
            title="Câu lạc bộ"
            value={stats.totalClubs.toLocaleString()}
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>}
            description={`${stats.approvedClubs} đã duyệt · ${stats.pendingClubs} chờ duyệt`}
            badge={stats.pendingClubs > 0 ? `${stats.pendingClubs} chờ duyệt` : `+${stats.newClubsThisMonth} ${monthName}`}
            href="/admin/clubs"
            color={stats.pendingClubs > 0 ? "orange" : "green"}
          />
          <StatsCard
            title="Tags & Môn võ"
            value={stats.totalTags.toLocaleString()}
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>}
            description={`${stats.totalMartialArts} môn võ · ${stats.totalProvinces} tỉnh thành`}
            href="/admin/tags"
            color="teal"
          />
        </div>
      </section>

      {/* ── Affiliate stats ── */}
      <section>
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-dark400_light700">Affiliate</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Affiliates"
            value={stats.totalAffiliates.toLocaleString()}
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>}
            badge={`+${stats.newAffiliatesThisMonth} ${monthName}`}
            href="/admin/affiliates"
            color="purple"
          />
          <StatsCard
            title="Lượt click"
            value={stats.totalAffiliateClicks.toLocaleString()}
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>}
            badge={`${stats.affiliateClicksThisMonth} ${monthName}`}
            color="blue"
          />
          <StatsCard
            title="Conversions"
            value={stats.totalAffiliateConversions.toLocaleString()}
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>}
            badge={`${stats.affiliateConversionsThisMonth} ${monthName}`}
            color="green"
          />
          <StatsCard
            title="Tỷ lệ chuyển đổi"
            value={`${stats.affiliateConversionRate}%`}
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>}
            description="Click → đăng ký thành công"
            color="pink"
          />
        </div>
      </section>

      {/* ── Main content grid ── */}
      <div className="grid gap-6 lg:grid-cols-3">

        {/* Club approval status */}
        <div className="rounded-xl border border-light-700 dark:border-dark-400 background-light900_dark200 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-dark100_light900">Trạng thái CLB</h3>
            <Link href="/admin/clubs" className="text-xs text-primary-500 hover:underline">Xem tất cả →</Link>
          </div>
          <div className="space-y-3">
            <div>
              <div className="mb-1 flex justify-between text-xs">
                <span className="text-dark400_light700">Đã duyệt</span>
                <span className="font-medium text-green-600 dark:text-green-400">{stats.approvedClubs}</span>
              </div>
              <div className="h-2 rounded-full bg-light-700 dark:bg-dark-400 overflow-hidden">
                <div className="h-full rounded-full bg-green-500 transition-all" style={{ width: `${clubApprovalPct}%` }} />
              </div>
            </div>
            <div>
              <div className="mb-1 flex justify-between text-xs">
                <span className="text-dark400_light700">Chờ duyệt</span>
                <span className="font-medium text-orange-600 dark:text-orange-400">{stats.pendingClubs}</span>
              </div>
              <div className="h-2 rounded-full bg-light-700 dark:bg-dark-400 overflow-hidden">
                <div className="h-full rounded-full bg-orange-500 transition-all" style={{ width: `${100 - clubApprovalPct}%` }} />
              </div>
            </div>
            <p className="pt-1 text-center text-2xl font-bold text-dark100_light900">{clubApprovalPct}% <span className="text-sm font-normal text-dark400_light700">đã duyệt</span></p>
          </div>
        </div>

        {/* Top contributors */}
        <div className="rounded-xl border border-light-700 dark:border-dark-400 background-light900_dark200 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-dark100_light900">Top Contributors</h3>
            <Link href="/admin/users?filter=top_contributors" className="text-xs text-primary-500 hover:underline">Xem tất cả →</Link>
          </div>
          <div className="space-y-3">
            {stats.topContributors?.length > 0 ? stats.topContributors.slice(0, 5).map((user: any, i: number) => (
              <div key={user._id} className="flex items-center gap-3">
                <span className={`text-xs font-bold w-4 shrink-0 ${i === 0 ? "text-yellow-500" : i === 1 ? "text-slate-400" : i === 2 ? "text-orange-400" : "text-dark400_light700"}`}>
                  {i + 1}
                </span>
                {user.picture?.startsWith("http") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.picture} alt={user.name} className="size-8 rounded-full object-cover shrink-0" />
                ) : (
                  <div className="size-8 rounded-full bg-primary-500/20 flex items-center justify-center text-xs font-bold text-primary-500 shrink-0">
                    {user.name?.[0]}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-dark100_light900 truncate">{user.name}</p>
                  <p className="text-xs text-dark400_light700 truncate">@{user.username}</p>
                </div>
                <span className="text-sm font-bold text-dark100_light900 shrink-0">{user.reputation?.toLocaleString()}</span>
              </div>
            )) : <p className="text-center text-sm text-dark400_light700 py-4">Chưa có dữ liệu</p>}
          </div>
        </div>

        {/* Recent users */}
        <div className="rounded-xl border border-light-700 dark:border-dark-400 background-light900_dark200 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-dark100_light900">Thành viên mới</h3>
            <Link href="/admin/users?filter=new_users" className="text-xs text-primary-500 hover:underline">Xem tất cả →</Link>
          </div>
          <div className="space-y-3">
            {stats.recentUsers?.length > 0 ? stats.recentUsers.slice(0, 5).map((user: any) => (
              <div key={user._id} className="flex items-center gap-3">
                {user.picture?.startsWith("http") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.picture} alt={user.name} className="size-8 rounded-full object-cover shrink-0" />
                ) : (
                  <div className="size-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-500 shrink-0">
                    {user.name?.[0]}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-dark100_light900 truncate">{user.name}</p>
                  <p className="text-xs text-dark400_light700 truncate">{user.email}</p>
                </div>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                  user.role === "admin"
                    ? "bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300"
                    : "bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300"
                }`}>{user.role}</span>
              </div>
            )) : <p className="text-center text-sm text-dark400_light700 py-4">Chưa có dữ liệu</p>}
          </div>
        </div>
      </div>

      {/* ── Affiliate activity chart ── */}
      {stats.affiliateClicksGrowth?.length > 0 && (
        <section className="rounded-xl border border-light-700 dark:border-dark-400 background-light900_dark200 p-5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-dark100_light900">Hoạt động Affiliate — 7 ngày gần nhất</h3>
              <p className="text-xs text-dark400_light700 mt-0.5">Clicks và conversions theo ngày</p>
            </div>
            <Link href="/admin/affiliates" className="text-xs text-primary-500 hover:underline">Chi tiết →</Link>
          </div>
          <div className="space-y-2.5">
            {stats.affiliateClicksGrowth.map((item: any) => (
              <div key={item._id} className="flex items-center gap-3">
                <span className="w-24 shrink-0 text-xs text-dark400_light700">{item._id}</span>
                <div className="flex-1 flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <div className="h-2 rounded-full bg-blue-400/40 dark:bg-blue-500/40 transition-all" style={{ width: `${(item.clicks / maxClicks) * 100}%`, minWidth: item.clicks > 0 ? "4px" : "0" }} />
                    <span className="text-xs text-dark400_light700">{item.clicks} clicks</span>
                  </div>
                  {item.conversions > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="h-2 rounded-full bg-green-400/60 dark:bg-green-500/60 transition-all" style={{ width: `${(item.conversions / maxClicks) * 100}%`, minWidth: "4px" }} />
                      <span className="text-xs text-green-600 dark:text-green-400">{item.conversions} conversions</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-4 border-t border-light-700 dark:border-dark-400 pt-3">
            <div className="flex items-center gap-2 text-xs text-dark400_light700">
              <div className="h-2 w-6 rounded-full bg-blue-400/40" />Clicks
            </div>
            <div className="flex items-center gap-2 text-xs text-dark400_light700">
              <div className="h-2 w-6 rounded-full bg-green-400/60" />Conversions
            </div>
          </div>
        </section>
      )}

      {/* ── Top Affiliates ── */}
      {stats.topAffiliates?.length > 0 && (
        <section className="rounded-xl border border-light-700 dark:border-dark-400 background-light900_dark200 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-dark100_light900">Top Affiliates theo Conversions</h3>
            <Link href="/admin/affiliates" className="text-xs text-primary-500 hover:underline">Xem tất cả →</Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {stats.topAffiliates.map((affiliate: any, i: number) => (
              <div key={affiliate._id} className="flex flex-col items-center rounded-lg bg-light-800/50 dark:bg-dark-300/50 p-4 text-center">
                <div className="relative mb-2">
                  {affiliate.picture?.startsWith("http") ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={affiliate.picture} alt={affiliate.name} className="size-12 rounded-full object-cover" />
                  ) : (
                    <div className="size-12 rounded-full bg-purple-500/20 flex items-center justify-center text-lg font-bold text-purple-500">
                      {affiliate.name?.[0]}
                    </div>
                  )}
                  {i === 0 && <span className="absolute -top-1 -right-1 text-sm">🥇</span>}
                  {i === 1 && <span className="absolute -top-1 -right-1 text-sm">🥈</span>}
                  {i === 2 && <span className="absolute -top-1 -right-1 text-sm">🥉</span>}
                </div>
                <p className="text-xs font-semibold text-dark100_light900 truncate w-full">{affiliate.name}</p>
                <p className="text-xs text-dark400_light700">@{affiliate.username}</p>
                <p className="mt-2 text-xl font-bold text-primary-500">{affiliate.conversions}</p>
                <p className="text-xs text-dark400_light700">conversions</p>
                {affiliate.affiliateCode && (
                  <code className="mt-1.5 rounded bg-light-700 dark:bg-dark-400 px-1.5 py-0.5 text-xs text-dark300_light700">{affiliate.affiliateCode}</code>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Quick actions ── */}
      <section>
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-dark400_light700">Thao tác nhanh</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { href: "/admin/clubs?status=pending", label: "Duyệt CLB chờ", desc: `${stats.pendingClubs} đang chờ`, color: "bg-orange-500" },
            { href: "/admin/users", label: "Quản lý users", desc: `${stats.totalUsers} tổng`, color: "bg-blue-500" },
            { href: "/admin/questions", label: "Quản lý câu hỏi", desc: `${stats.totalQuestions} câu hỏi`, color: "bg-indigo-500" },
            { href: "/admin/affiliates", label: "Affiliate", desc: `${stats.totalAffiliates} affiliates`, color: "bg-purple-500" },
          ].map((action) => (
            <Link key={action.href} href={action.href}
              className="flex items-center gap-3 rounded-xl border border-light-700 dark:border-dark-400 background-light900_dark200 p-4 hover:shadow-md transition-all duration-200 group">
              <div className={`size-8 rounded-lg ${action.color} flex items-center justify-center text-white text-sm shrink-0`}>→</div>
              <div>
                <p className="text-sm font-medium text-dark100_light900 group-hover:text-primary-500 transition-colors">{action.label}</p>
                <p className="text-xs text-dark400_light700">{action.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}
