import { adminApi } from "@/lib/api-client";
import { auth } from "@/lib/auth";
import UserActionsMenu from "@/components/admin/UserActionsMenu";
import UserFilters from "@/components/admin/UserFilters";
import UnifiedPagination from "@/components/shared/UnifiedPagination";
import UserAvatar from "@/components/shared/UserAvatar";
import Link from "next/link";
import { Suspense } from "react";

interface Props {
  searchParams: { [key: string]: string | undefined };
}

export default async function AdminUsersPage({ searchParams }: Props) {
  const session = await auth();
  const token = (session as any)?.apiToken;

  let result: any = { users: [], totalUsers: 0, isNext: false, totalPages: 1 };
  try {
    result = await adminApi.getUsers({
      page: searchParams.page || "1",
      pageSize: "20",
      q: searchParams.q || "",
      filter: searchParams.filter || "",
      roleFilter: searchParams.role || "all",
      statusFilter: searchParams.status || "all",
    }, token) as any;
  } catch {
    // API chưa chạy
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="border-l-4 border-l-blue-500 pl-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-dark400_light700">Management</p>
          <h1 className="mt-0.5 text-2xl font-bold text-dark100_light900">Users</h1>
          <p className="mt-1 text-sm text-dark400_light700">
            {result.totalUsers.toLocaleString()} total users
          </p>
        </div>
      </div>

      {/* Filters */}
      <Suspense fallback={null}>
        <UserFilters />
      </Suspense>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-light-700 dark:border-dark-400 background-light900_dark200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-light-700 dark:border-dark-400 background-light800_dark300">
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-widest text-dark400_light700">User</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-widest text-dark400_light700">Email</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-widest text-dark400_light700">Role</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-widest text-dark400_light700">Status</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-widest text-dark400_light700">Rep</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-widest text-dark400_light700">Joined</th>
                <th className="px-5 py-3.5 text-right text-[11px] font-semibold uppercase tracking-widest text-dark400_light700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-light-700 dark:divide-dark-400">
              {result.users?.map((user: any) => (
                <tr
                  key={user._id}
                  className="group transition-colors hover:background-light800_dark300"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <UserAvatar picture={user.picture} name={user.name} username={user.username} size={38} />
                      <div>
                        <Link
                          href={`/admin/users/${user._id}`}
                          className="block text-sm font-semibold text-dark100_light900 hover:text-primary-500 transition-colors"
                        >
                          {user.name}
                        </Link>
                        <p className="text-xs text-dark400_light700">@{user.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-dark300_light900">{user.email}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      user.role === "admin"
                        ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300"
                        : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                    }`}>
                      {user.role === "admin" ? "Admin" : "User"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      user.isBlocked
                        ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                        : "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${user.isBlocked ? "bg-red-500" : "bg-green-500"}`} />
                      {user.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm font-semibold text-dark100_light900">{(user.reputation || 0).toLocaleString()}</span>
                  </td>
                  <td className="px-5 py-4 text-sm text-dark400_light700">
                    {new Date(user.joinedAt).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <UserActionsMenu userId={user._id} isBlocked={user.isBlocked} currentRole={user.role} userName={user.name} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {result.users?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
              <svg className="h-7 w-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-base font-semibold text-dark100_light900">No users found</p>
            <p className="mt-1 text-sm text-dark400_light700">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      <UnifiedPagination
        pageNumber={searchParams.page ? +searchParams.page : 1}
        isNext={result.isNext}
        totalPages={result.totalPages}
        showPageNumbers
      />
    </div>
  );
}
