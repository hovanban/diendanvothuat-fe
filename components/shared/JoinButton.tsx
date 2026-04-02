"use client";

import { useSignIn } from "@/components/providers/SignInProvider";

interface JoinButtonProps {
  children?: React.ReactNode;
  className?: string;
}

export default function JoinButton({
  children = "Tham gia ngay!",
  className = "mt-2 font-bold text-accent-blue cursor-pointer hover:underline",
}: JoinButtonProps) {
  const { openSignIn } = useSignIn();
  return (
    <button onClick={openSignIn} className={className}>
      {children}
    </button>
  );
}
