"use client";

import { Input } from "@/components/ui/input";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import GlobalResult from "./GlobalResult";

const GlobalSearch = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchContainerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const query = searchParams.get("q");

  const [search, setSearch] = useState<string>(query || "");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleOutsideClick = (e: any) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target)
      ) {
        setIsOpen(false);
        setSearch("");
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        inputRef.current?.blur();
      }

      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
    };

    setIsOpen(false);

    document.addEventListener("click", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [pathname]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "global",
          value: search,
        });

        router.push(newUrl, { scroll: false });
      } else {
        if (!query) {
          const newUrl = removeKeysFromQuery({
            params: searchParams.toString(),
            keysToRemove: ["global", "type"],
          });

          router.push(newUrl, { scroll: false });
        }
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, pathname, router, searchParams, query]);

  return (
    <div
      className="relative w-full max-w-[600px] max-lg:hidden"
      ref={searchContainerRef}
    >
      <div className="background-light800_darkgradient relative flex min-h-[40px] grow items-center gap-1 rounded-xl px-4">
        <Image
          src="/assets/icons/search.svg"
          alt="search"
          width={24}
          height={24}
          className="cursor-pointer"
        />

        <Input
          ref={inputRef}
          type="text"
          placeholder="Tìm kiếm (Ctrl+K)"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            if (!isOpen) setIsOpen(true);
            if (e.target.value === "" && isOpen) setIsOpen(false);
          }}
          className="text-dark400_light700 paragraph-regular no-focus placeholder border-none bg-transparent shadow-none outline-none"
        />
      </div>

      {isOpen && <GlobalResult />}
    </div>
  );
};

export default GlobalSearch;
