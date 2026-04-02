"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSignIn } from "@/components/providers/SignInProvider";
import { Button } from "@/components/ui/button";

interface AskQuestionButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export default function AskQuestionButton({
  className = "primary-gradient min-h-[40px] px-4 py-2 !text-light-900",
  children = "Đăng bài",
}: AskQuestionButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const { openSignIn } = useSignIn();

  const handleClick = () => {
    if (!session) { openSignIn(); return; }
    router.push("/ask-question");
  };

  return <Button onClick={handleClick} className={className}>{children}</Button>;
}
