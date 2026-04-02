"use client";

import { sidebarLinks } from "@/constants";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AskQuestionButton from "../AskQuestionButton";

const HorizontalNav = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const userId = session?.user?.id;

  return (
    <div className="background-light900_dark200 border-b light-border w-full max-lg:hidden">
      <div className="flex items-center justify-between mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-1">
          {sidebarLinks.map((item) => {
            const isActive =
              (pathname.includes(item.route) && item.route.length > 1) ||
              pathname === item.route;

            let route = item.route;
            if (item.route === "/profile" && userId) route = `${item.route}/${userId}`;
            else if (item.route === "/profile" && !userId) return null;

            return (
              <Link
                key={item.label}
                href={route}
                className={`flex items-center gap-2 pr-4 py-3 transition-all relative ${
                  isActive ? "text-primary-500" : "text-dark300_light900 hover:text-primary-500"
                }`}
              >
                <Image src={item.imgURL} alt={item.label} width={20} height={20} className="invert-colors" />
                <span className={`${isActive ? "font-semibold" : "font-medium"} max-lg:hidden`}>
                  {item.label}
                </span>
                {isActive && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500" />}
              </Link>
            );
          })}
        </nav>

        <div className="max-lg:hidden">
          <AskQuestionButton className="primary-gradient text-light-900 px-4 py-2 rounded-lg text-sm font-medium" />
        </div>
      </div>
    </div>
  );
};

export default HorizontalNav;
