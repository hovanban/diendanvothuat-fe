"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import Image from "next/image";

interface SignInDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SignInDialog({ open, onOpenChange }: SignInDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (error) {
      console.error("Sign in error:", error);
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="mx-auto mb-4">
            <Image src="/assets/images/site-logo.svg" alt="Forum Võ Thuật" width={60} height={60} className="mx-auto" />
          </div>
          <DialogTitle className="text-center text-dark100_light900 text-2xl font-bold">
            Chào Mừng Trở Lại!
          </DialogTitle>
          <DialogDescription className="text-center text-dark500_light500">
            Đăng nhập để tham gia diễn đàn võ thuật
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6">
          <Button onClick={handleSignIn} disabled={isLoading} className="primary-gradient min-h-[46px] w-full px-4 py-3 !text-light-900">
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Đang xử lý...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Image src="/assets/icons/google.svg" alt="Google" width={20} height={20} className="invert-colors" />
                Đăng nhập với Google
              </span>
            )}
          </Button>

          <p className="text-dark500_light500 mt-6 text-center text-xs">
            Bằng việc đăng nhập, bạn đồng ý với{" "}
            <span className="text-primary-500 cursor-pointer hover:underline">Điều khoản dịch vụ</span>{" "}
            và{" "}
            <span className="text-primary-500 cursor-pointer hover:underline">Chính sách bảo mật</span>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
