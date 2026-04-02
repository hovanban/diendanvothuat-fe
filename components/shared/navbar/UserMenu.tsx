"use client";

import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserMenuProps {
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  };
}

export default function UserMenu({ user }: UserMenuProps) {
  const isExternalImage = user.image?.startsWith("http");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500">
          {isExternalImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.image!} alt={user.name || "User"} className="rounded-full cursor-pointer hover:opacity-80 transition-opacity object-cover" style={{ width: "40px", height: "40px" }} />
          ) : (
            <Image src={user.image || "/assets/icons/avatar.svg"} alt={user.name || "User"} width={40} height={40} className="rounded-full cursor-pointer hover:opacity-80 transition-opacity object-cover" style={{ width: "40px", height: "40px" }} />
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-dark400_light700">{user.email}</p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href={`/profile/${user.id}`} className="cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
            Trang cá nhân
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/ask-question" className="cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <path d="M12 5v14" /><path d="M5 12h14" />
            </svg>
            Đăng bài
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href={`/profile/${user.id}/clubs`} className="cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            Quản lý CLB
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/affiliate/dashboard" className="cursor-pointer text-green-600 dark:text-green-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
            </svg>
            Cộng tác viên
          </Link>
        </DropdownMenuItem>

        {user.role === "admin" && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/admin/dashboard" className="cursor-pointer text-purple-600 dark:text-purple-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                </svg>
                Admin Dashboard
              </Link>
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })} className="cursor-pointer text-red-600 dark:text-red-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
