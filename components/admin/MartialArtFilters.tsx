"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function MartialArtFilters() {
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
    router.push(`/admin/martial-arts?${params.toString()}`);
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
    (!!searchParams.get("status") && searchParams.get("status") !== "all");

  return (
    <div className="rounded-xl border border-light-700 dark:border-dark-400 background-light900_dark200 p-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Search */}
        <div className="relative lg:col-span-1">
          <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dark400_light700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Tìm kiếm môn võ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-light-700 dark:border-dark-400 bg-transparent py-2.5 pl-10 pr-4 text-sm text-dark100_light900 placeholder:text-dark400_light700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>

        {/* Status Filter */}
        <select
          value={searchParams.get("status") || "all"}
          onChange={(e) => updateFilter("status", e.target.value)}
          className="rounded-lg border border-light-700 dark:border-dark-400 bg-transparent px-3 py-2.5 text-sm text-dark100_light900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="visible">Hiện</option>
          <option value="hidden">Ẩn</option>
          <option value="featured">Nổi bật</option>
        </select>

        {/* Sort */}
        <select
          value={searchParams.get("filter") || "order"}
          onChange={(e) => updateFilter("filter", e.target.value)}
          className="rounded-lg border border-light-700 dark:border-dark-400 bg-transparent px-3 py-2.5 text-sm text-dark100_light900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        >
          <option value="order">Theo thứ tự</option>
          <option value="name">Theo tên</option>
          <option value="newest">Mới nhất</option>
          <option value="oldest">Cũ nhất</option>
          <option value="popular">Phổ biến nhất</option>
        </select>

        {/* Clear */}
        <button
          onClick={() => {
            setSearch("");
            router.push("/admin/martial-arts");
          }}
          disabled={!hasActiveFilters}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-light-700 dark:border-dark-400 px-4 py-2.5 text-sm font-medium text-dark400_light700 transition-colors hover:background-light800_dark300 hover:text-dark100_light900 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Xóa bộ lọc
        </button>
      </div>
    </div>
  );
}
