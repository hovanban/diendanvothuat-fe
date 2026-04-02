"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSignIn } from "@/components/providers/SignInProvider";

export default function CreateClubButton() {
  const { data: session } = useSession();
  const router = useRouter();
  const { openSignIn } = useSignIn();

  const handleClick = () => {
    if (!session) {
      openSignIn();
      return;
    }
    router.push("/clb/create");
  };

  return (
    <button
      onClick={handleClick}
      className="paragraph-medium primary-gradient text-light-900 min-h-[46px] px-4 py-3 rounded-lg whitespace-nowrap"
    >
      + Tạo CLB
    </button>
  );
}
