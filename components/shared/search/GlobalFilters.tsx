"use client";

import { GlobalSearchFilters } from "@/constants/filters";
import { formUrlQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const GlobalFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const typeParams = searchParams.get("type");

  const [active, setActive] = useState<string>(typeParams || "");

  const handleTypeClick = (item: string) => {
    if (active === item) {
      setActive("");
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "type",
        value: null,
      });

      router.push(newUrl, { scroll: false });
    } else {
      setActive(item);
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "type",
        value: item.toLowerCase(),
      });

      router.push(newUrl, { scroll: false });
    }
  };

  return (
    <div className="flex flex-col gap-3 px-5">
      <p className="text-dark400_light900 body-medium">Lọc theo:</p>
      <div className="flex flex-wrap gap-2">
        {GlobalSearchFilters.map((filter) => (
          <button
            key={filter.value}
            type="button"
            className={`light-border-2 small-medium rounded-3xl px-4 py-2 capitalize whitespace-nowrap transition-colors dark:text-light-800 dark:hover:text-primary-500 ${
              active === filter.value
                ? "bg-primary-500 text-light-900"
                : "bg-light-700 text-dark-400 hover:text-primary-500 dark:bg-dark-500"
            }`}
            onClick={() => handleTypeClick(filter.value)}
          >
            {filter.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GlobalFilters;
