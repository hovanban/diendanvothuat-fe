"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface QuestionFiltersProps {
  martialArts?: Array<{ _id: string; name: string }>;
}

export default function QuestionFilters({ martialArts = [] }: QuestionFiltersProps) {
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
    router.push(`/admin/questions?${params.toString()}`);
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
    !!searchParams.get("martialArt") ||
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
            placeholder="Search questions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-light-700 dark:border-dark-400 bg-transparent py-2.5 pl-10 pr-4 text-sm text-dark100_light900 placeholder:text-dark400_light700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>

        {/* Martial Art Filter */}
        <select
          value={searchParams.get("martialArt") || "all"}
          onChange={(e) => updateFilter("martialArt", e.target.value)}
          className="rounded-lg border border-light-700 dark:border-dark-400 bg-transparent px-3 py-2.5 text-sm text-dark100_light900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        >
          <option value="all">All Martial Arts</option>
          {martialArts.map((ma) => (
            <option key={ma._id} value={ma._id}>{ma.name}</option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={searchParams.get("status") || "all"}
          onChange={(e) => updateFilter("status", e.target.value)}
          className="rounded-lg border border-light-700 dark:border-dark-400 bg-transparent px-3 py-2.5 text-sm text-dark100_light900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        >
          <option value="all">All Status</option>
          <option value="visible">Visible</option>
          <option value="hidden">Hidden</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending Approval</option>
        </select>

        {/* Sort + Clear */}
        <div className="flex gap-2">
          <select
            value={searchParams.get("filter") || "newest"}
            onChange={(e) => updateFilter("filter", e.target.value)}
            className="flex-1 rounded-lg border border-light-700 dark:border-dark-400 bg-transparent px-3 py-2.5 text-sm text-dark100_light900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="most_viewed">Most Viewed</option>
            <option value="most_answers">Most Answers</option>
            <option value="most_votes">Most Votes</option>
          </select>

          {hasActiveFilters && (
            <button
              onClick={() => {
                setSearch("");
                router.push("/admin/questions");
              }}
              title="Clear filters"
              className="inline-flex items-center justify-center rounded-lg border border-light-700 dark:border-dark-400 px-3 py-2.5 text-dark400_light700 transition-colors hover:background-light800_dark300 hover:text-dark100_light900"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
