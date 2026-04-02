import { adminApi } from "@/lib/api-client";
import { auth } from "@/lib/auth";
import Link from "next/link";

interface Props {
  params: { id: string };
}

export default async function AdminUserDetailPage({ params }: Props) {
  const session = await auth();
  const token = (session as any)?.apiToken;

  let user: any = null;
  try {
    user = await adminApi.getUser(params.id, token) as any;
  } catch {
    // not found
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-base font-semibold text-dark100_light900">User not found</p>
        <Link href="/admin/users" className="mt-4 text-sm text-primary-500 hover:underline">← Back to Users</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin/users"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-light-700 dark:border-dark-400 text-dark400_light700 transition-colors hover:background-light800_dark300"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div className="border-l-4 border-l-blue-500 pl-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-dark400_light700">Admin / Users</p>
          <h1 className="mt-0.5 text-2xl font-bold text-dark100_light900">User Details</h1>
        </div>
      </div>

      {/* Profile card */}
      <div className="overflow-hidden rounded-xl border border-light-700 dark:border-dark-400 background-light900_dark200">
        <div className="flex items-center gap-5 border-b border-light-700 dark:border-dark-400 p-6">
          {user.picture?.startsWith("http") ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.picture} alt={user.name} className="h-16 w-16 rounded-full object-cover shrink-0" />
          ) : (
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-xl font-bold text-blue-600 dark:text-blue-400">
              {user.name?.charAt(0)}
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold text-dark100_light900">{user.name}</h2>
              {user.role === "admin" && (
                <span className="inline-flex items-center rounded-full bg-purple-100 dark:bg-purple-900/40 px-2.5 py-1 text-[11px] font-semibold text-purple-700 dark:text-purple-300">ADMIN</span>
              )}
              {user.isBlocked && (
                <span className="inline-flex items-center rounded-full bg-red-100 dark:bg-red-900/40 px-2.5 py-1 text-[11px] font-semibold text-red-700 dark:text-red-300">BLOCKED</span>
              )}
            </div>
            <p className="text-sm text-dark400_light700">@{user.username}</p>
            <p className="text-sm text-dark400_light700">{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 divide-x divide-y divide-light-700 dark:divide-dark-400 sm:grid-cols-4">
          {[
            { label: "Questions", value: user.totalQuestions ?? user.questionsCount ?? 0 },
            { label: "Answers", value: user.totalAnswers ?? user.answersCount ?? 0 },
            { label: "Reputation", value: user.reputation ?? 0 },
            { label: "Joined", value: user.joinedAt ? new Date(user.joinedAt).toLocaleDateString("vi-VN") : "N/A" },
          ].map((stat) => (
            <div key={stat.label} className="p-5 text-center">
              <p className="text-2xl font-bold text-dark100_light900">{stat.value}</p>
              <p className="text-xs text-dark400_light700">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Details */}
      <div className="overflow-hidden rounded-xl border border-light-700 dark:border-dark-400 background-light900_dark200">
        <div className="border-b border-light-700 dark:border-dark-400 px-5 py-3.5">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-dark400_light700">Account Info</p>
        </div>
        <div className="divide-y divide-light-700 dark:divide-dark-400">
          {[
            { label: "User ID", value: user._id },
            { label: "Role", value: user.role || "user" },
            { label: "Auth Provider", value: user.authProvider || "email" },
            { label: "Bio", value: user.bio || "—" },
            { label: "Location", value: user.location || "—" },
            { label: "Portfolio", value: user.portfolioWebsite || "—" },
            { label: "Block Reason", value: user.blockReason || "—" },
            { label: "Affiliate Code", value: user.affiliateCode || "—" },
          ].map((row) => (
            <div key={row.label} className="flex px-5 py-3.5">
              <span className="w-36 shrink-0 text-sm text-dark400_light700">{row.label}</span>
              <span className="text-sm font-medium text-dark100_light900 break-all">{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Link
          href="/admin/users"
          className="rounded-lg border border-light-700 dark:border-dark-400 px-5 py-2.5 text-sm font-medium text-dark100_light900 transition-colors hover:background-light800_dark300"
        >
          ← Back to Users
        </Link>
      </div>
    </div>
  );
}
