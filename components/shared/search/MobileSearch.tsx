"use client";

import { Input } from "@/components/ui/input";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import GlobalResult from "./GlobalResult";

const MobileSearch = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = searchParams.get("q");

  const [search, setSearch] = useState<string>(query || "");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);

  useEffect(() => {
    setShowResults(false);
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
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Image
          src="/assets/icons/search.svg"
          alt="search"
          width={24}
          height={24}
          className="cursor-pointer invert-colors lg:hidden"
        />
      </SheetTrigger>
      <SheetContent side="top" className="background-light900_dark200">
        <SheetHeader>
          <SheetTitle className="text-dark100_light900">Tìm kiếm</SheetTitle>
        </SheetHeader>

        <div className="mt-6">
          <div className="background-light800_darkgradient relative flex min-h-[40px] grow items-center gap-1 rounded-xl px-4">
            <Image
              src="/assets/icons/search.svg"
              alt="search"
              width={24}
              height={24}
              className="cursor-pointer"
            />

            <Input
              type="text"
              placeholder="Tìm kiếm câu hỏi, CLB, người dùng..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                if (!showResults) setShowResults(true);
                if (e.target.value === "" && showResults) setShowResults(false);
              }}
              className="text-dark400_light700 paragraph-regular no-focus placeholder border-none bg-transparent shadow-none outline-none"
            />
          </div>

          <div className="relative mt-4">
            {showResults && search && (
              <div className="max-h-[60vh] overflow-y-auto">
                <GlobalResult />
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSearch;
