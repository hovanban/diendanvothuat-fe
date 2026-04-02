"use client";

import { formUrlQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";

interface Props {
  pageNumber: number;
  isNext: boolean;
  totalPages?: number;
  totalItems?: number;
  showPageNumbers?: boolean; // true = advanced (show 1 2 3...), false = simple (show only current)
  itemLabel?: string; // "thành viên", "câu hỏi", "câu lạc bộ", etc.
}

const UnifiedPagination = ({
  pageNumber,
  isNext,
  totalPages,
  totalItems,
  showPageNumbers = true,
  itemLabel,
}: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleNavigation = (page: number) => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "page",
      value: page.toString(),
    });

    router.push(newUrl);
  };

  // Calculate total pages if not provided
  const calculatedTotalPages = totalPages || (isNext ? pageNumber + 1 : pageNumber);

  // Generate page numbers to display (for advanced mode)
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 3; // Maximum number of page buttons to show

    if (calculatedTotalPages <= maxVisible) {
      // Show all pages if total is less than max
      for (let i = 1; i <= calculatedTotalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page
      pages.push(1);

      if (pageNumber > 2) {
        pages.push("...");
      }

      // Show current page (if not first or last)
      if (pageNumber > 1 && pageNumber < calculatedTotalPages) {
        pages.push(pageNumber);
      }

      if (pageNumber < calculatedTotalPages - 1) {
        pages.push("...");
      }

      // Always show last page
      pages.push(calculatedTotalPages);
    }

    return pages;
  };

  if (!isNext && pageNumber === 1) return null;

  const pageNumbers = showPageNumbers ? getPageNumbers() : [];

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      {/* Total items display */}
      {totalItems !== undefined && itemLabel && (
        <p className="text-sm text-dark400_light700">
          Tổng số:{" "}
          <span className="font-semibold text-dark100_light900">{totalItems}</span>{" "}
          {itemLabel}
        </p>
      )}

      {/* Pagination buttons */}
      <div className="flex items-center justify-center gap-2">
        {/* Previous button */}
        <Button
          disabled={pageNumber === 1}
          onClick={() => handleNavigation(pageNumber - 1)}
          className="light-border-2 btn flex min-h-[36px] items-center justify-center gap-2 border bg-light-900 dark:bg-dark-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <p className="body-medium text-dark-100 dark:text-light-900">Prev</p>
        </Button>

        {/* Page numbers (advanced mode) or current page (simple mode) */}
        {showPageNumbers ? (
          pageNumbers.map((page, index) => {
            if (page === "...") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-2 text-dark400_light700"
                >
                  ...
                </span>
              );
            }

            return (
              <Button
                key={page}
                onClick={() => handleNavigation(page as number)}
                className={`min-h-[36px] min-w-[36px] ${
                  pageNumber === page
                    ? "bg-primary-500 text-light-900 hover:bg-primary-500"
                    : "light-border-2 border bg-light-900 dark:bg-dark-200 text-dark-100 dark:text-light-900 hover:bg-light-800 dark:hover:bg-dark-400"
                }`}
              >
                {page}
              </Button>
            );
          })
        ) : (
          <div className="flex items-center justify-center rounded-md bg-primary-500 px-3.5 py-2">
            <p className="body-semibold text-light-900">{pageNumber}</p>
          </div>
        )}

        {/* Next button */}
        <Button
          disabled={!isNext}
          onClick={() => handleNavigation(pageNumber + 1)}
          className="light-border-2 btn flex min-h-[36px] items-center justify-center gap-2 border bg-light-900 dark:bg-dark-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <p className="body-medium text-dark-100 dark:text-light-900">Next</p>
        </Button>
      </div>
    </div>
  );
};

export default UnifiedPagination;
