"use client";

import { useState } from "react";
import { SignInDialog } from "@/components/auth/SignInDialog";

export default function SignInButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)} className="primary-gradient min-h-[36px] rounded-md px-4 py-2 text-light-900">
        Đăng Nhập
      </button>
      <SignInDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
