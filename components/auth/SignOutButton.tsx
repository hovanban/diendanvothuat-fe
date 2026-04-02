"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="w-full rounded background-light800_dark400 px-3 py-2 text-sm text-dark100_light900 hover:background-light700_dark300 text-left"
    >
      Sign Out
    </button>
  );
}
