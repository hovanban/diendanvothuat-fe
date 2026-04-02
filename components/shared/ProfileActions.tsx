"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Props {
  isOwnProfile: boolean;
}

export default function ProfileActions({ isOwnProfile }: Props) {
  if (!isOwnProfile) return null;

  return (
    <div className="flex gap-3 justify-end max-sm:mb-5 max-sm:w-full sm:mt-3">
      <Link href="/profile/edit">
        <Button className="paragraph-medium btn-secondary text-dark300_light900 min-h-[46px] min-w-[175px] px-4 py-3">
          Edit Profile
        </Button>
      </Link>
    </div>
  );
}
