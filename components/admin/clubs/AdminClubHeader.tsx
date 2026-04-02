"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import ImportClubsButton from "../ImportClubsButton";

interface Creator {
  _id: string;
  name: string;
  username: string;
  email: string;
}

interface Props {
  creators: Creator[];
  totalClubs?: number;
}

export default function AdminClubHeader({ creators }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") || "");

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`/admin/clubs?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== (searchParams.get("q") || "")) {
        updateFilter("q", search);
      }
    }, 500);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const hasActiveFilters =
    !!searchParams.get("q") ||
    !!searchParams.get("createdBy") ||
    (!!searchParams.get("status") && searchParams.get("status") !== "all");

  return (
    <div className="rounded-xl border border-light-700 dark:border-dark-400 background-light900_dark200 p-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {/* Search */}
        <div className="relative lg:col-span-2">
          <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dark400_light700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Tìm kiếm câu lạc bộ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-light-700 dark:border-dark-400 bg-transparent py-2.5 pl-10 pr-4 text-sm text-dark100_light900 placeholder:text-dark400_light700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>

        {/* Creator Filter */}
        <select
          value={searchParams.get("createdBy") || "all"}
          onChange={(e) => updateFilter("createdBy", e.target.value)}
          className="rounded-lg border border-light-700 dark:border-dark-400 bg-transparent px-3 py-2.5 text-sm text-dark100_light900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        >
          <option value="all">Tất cả người tạo</option>
          {creators.map((creator) => (
            <option key={creator._id} value={creator._id}>
              {creator.name} (@{creator.username})
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={searchParams.get("status") || "all"}
          onChange={(e) => updateFilter("status", e.target.value)}
          className="rounded-lg border border-light-700 dark:border-dark-400 bg-transparent px-3 py-2.5 text-sm text-dark100_light900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        >
          <option value="all">All Status</option>
          <option value="approved">Đã duyệt</option>
          <option value="pending">Chờ duyệt</option>
          <option value="hidden">Đang ẩn</option>
        </select>

        {/* Actions */}
        <div className="flex gap-2">
          {hasActiveFilters && (
            <button
              onClick={() => {
                setSearch("");
                router.push("/admin/clubs");
              }}
              title="Clear filters"
              className="inline-flex items-center justify-center rounded-lg border border-light-700 dark:border-dark-400 px-3 py-2.5 text-dark400_light700 transition-colors hover:background-light800_dark300 hover:text-dark100_light900"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <ImportClubsButton />
          <Link
            href="/admin/clubs/create"
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 whitespace-nowrap"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Thêm CLB
          </Link>
        </div>
      </div>
    </div>
  );
}
