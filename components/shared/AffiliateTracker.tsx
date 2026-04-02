"use client";

import { useEffect } from "react";
import { useSearchParams, usePathname } from "next/navigation";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export default function AffiliateTracker() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    const affiliateCode = searchParams.get("ref");

    if (affiliateCode) {
      let targetType: "question" | "club" | "landingpage" | "homepage" = "homepage";
      let targetSlug: string | undefined;

      if (pathname.startsWith("/question/")) {
        targetType = "question";
        targetSlug = pathname.split("/question/")[1];
      } else if (pathname.startsWith("/clb/")) {
        targetType = "club";
        targetSlug = pathname.split("/clb/")[1];
      } else if (pathname.startsWith("/hoc-vo/")) {
        targetType = "landingpage";
        targetSlug = pathname.split("/hoc-vo/")[1];
      }

      fetch(`${NEXT_PUBLIC_API_URL}/affiliate/track`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ affiliateCode, targetType, targetSlug }),
      }).catch(() => {});
    }
  }, [searchParams, pathname]);

  return null;
}
