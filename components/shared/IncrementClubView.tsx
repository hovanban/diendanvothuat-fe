"use client";

import { useEffect } from "react";

export default function IncrementClubView({ clubId }: { clubId: string }) {
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/clubs/${clubId}/increment-view`, { method: "POST" }).catch(() => {});
  }, [clubId]);
  return null;
}
