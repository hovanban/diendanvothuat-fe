"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Theme from "@/components/shared/navbar/Theme";
import { SignOutButton } from "@/components/auth/SignOutButton";
import Image from "next/image";

const navItems = [
  {
    href: "/admin/dashboard",
    label: "Dashboard",
    color: "blue",
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  {
    href: "/admin/users",
    label: "Users",
    color: "blue",
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
  {
    href: "/admin/questions",
    label: "Questions",
    color: "indigo",
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    href: "/admin/comments",
    label: "Comments",
    color: "pink",
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    href: "/admin/tags",
    label: "Tags",
    color: "teal",
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
  },
  {
    href: "/admin/martial-arts",
    label: "Martial Arts",
    color: "slate",
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
  },
  {
    href: "/admin/provinces",
    label: "Provinces",
    color: "green",
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    ),
  },
  {
    href: "/admin/clubs",
    label: "Clubs",
    color: "orange",
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    href: "/admin/landing-pages",
    label: "Landing Pages",
    color: "purple",
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
  {
    href: "/admin/affiliates",
    label: "Affiliates",
    color: "purple",
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

const activeColorMap: Record<string, string> = {
  blue:   "border-l-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300",
  indigo: "border-l-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300",
  pink:   "border-l-pink-500 bg-pink-50 text-pink-700 dark:bg-pink-950/40 dark:text-pink-300",
  teal:   "border-l-teal-500 bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300",
  slate:  "border-l-slate-500 bg-slate-50 text-slate-700 dark:bg-slate-950/40 dark:text-slate-300",
  green:  "border-l-green-500 bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-300",
  orange: "border-l-orange-500 bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300",
  purple: "border-l-purple-500 bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300",
};

interface AdminSidebarProps {
  session: any;
}

export default function AdminSidebar({ session }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-light-700 dark:border-dark-400 background-light900_dark200 min-h-screen sticky top-0">
      {/* Logo / Brand */}
      <div className="border-b border-light-700 dark:border-dark-400 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-500 shadow-sm">
            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h2 className="text-sm font-bold text-dark100_light900 leading-tight">Admin Panel</h2>
            <p className="text-[11px] text-dark400_light700">Management Console</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-dark400_light700">
          Navigation
        </p>
        <div className="space-y-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg border-l-4 px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? activeColorMap[item.color]
                    : "border-l-transparent text-dark300_light900 hover:background-light800_dark300 hover:text-dark100_light900"
                }`}
              >
                <span className="shrink-0">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="my-4 border-t border-light-700 dark:border-dark-400" />

        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-dark400_light700">
          Site
        </p>
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg border-l-4 border-l-transparent px-3 py-2.5 text-sm font-medium text-dark300_light900 transition-all hover:background-light800_dark300 hover:text-dark100_light900"
        >
          <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Site</span>
        </Link>
      </nav>

      {/* User Footer */}
      <div className="border-t border-light-700 dark:border-dark-400 p-4">
        <div className="mb-3 flex items-center gap-3">
          {session?.user?.image ? (
            session.user.image.startsWith("http") ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={session.user.image}
                alt={session.user.name || "Admin"}
                className="h-9 w-9 rounded-full object-cover ring-2 ring-primary-500/30"
              />
            ) : (
              <Image
                src={session.user.image}
                alt={session.user.name || "Admin"}
                width={36}
                height={36}
                className="rounded-full object-cover ring-2 ring-primary-500/30"
              />
            )
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-500/20 text-sm font-bold text-primary-500">
              {session?.user?.name?.charAt(0) || "A"}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-dark100_light900">{session?.user?.name}</p>
            <span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-semibold text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
              ADMIN
            </span>
          </div>
          <Theme />
        </div>
        <SignOutButton />
      </div>
    </aside>
  );
}
