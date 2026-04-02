"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery } from "@/lib/utils";

interface Province { _id: string; name: string }
interface MartialArt { _id: string; name: string }

interface Props {
  provinces: Province[];
  martialArts: MartialArt[];
}

export default function ClubFilters({ provinces, martialArts }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (key: string, value: string) => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key,
      value: value === "all" ? null : value,
    });
    router.push(newUrl, { scroll: false });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "q",
      value: val || null,
    });
    router.push(newUrl, { scroll: false });
  };

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {/* Search */}
      <div className="flex h-10 flex-1 min-w-[180px] items-center gap-2 rounded-lg border border-light-700 dark:border-dark-400 bg-light-800 dark:bg-dark-300 px-3">
        <svg className="h-4 w-4 shrink-0 text-dark400_light700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Tìm câu lạc bộ…"
          defaultValue={searchParams.get("q") || ""}
          onChange={handleSearch}
          className="w-full bg-transparent text-sm text-dark400_light700 placeholder:text-dark400_light700 outline-none"
        />
      </div>

      {/* Province */}
      <select
        value={searchParams.get("province") || "all"}
        onChange={(e) => handleChange("province", e.target.value)}
        className="h-10 rounded-lg border border-light-700 dark:border-dark-400 bg-light-800 dark:bg-dark-300 px-3 text-sm text-dark400_light700 outline-none cursor-pointer"
      >
        <option value="all">Tất cả tỉnh/TP</option>
        {provinces.map((p) => (
          <option key={p._id} value={p._id}>{p.name}</option>
        ))}
      </select>

      {/* Martial Art */}
      <select
        value={searchParams.get("martialArt") || "all"}
        onChange={(e) => handleChange("martialArt", e.target.value)}
        className="h-10 rounded-lg border border-light-700 dark:border-dark-400 bg-light-800 dark:bg-dark-300 px-3 text-sm text-dark400_light700 outline-none cursor-pointer"
      >
        <option value="all">Tất cả môn võ</option>
        {martialArts.map((m) => (
          <option key={m._id} value={m._id}>{m.name}</option>
        ))}
      </select>
    </div>
  );
}
