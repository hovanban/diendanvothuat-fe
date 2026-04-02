"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { sidebarLinks } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { SignInDialog } from "@/components/auth/SignInDialog";

const NavContent = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  return (
    <section className="flex h-full flex-col gap-4 pt-16">
      {sidebarLinks.map((item) => {
        const isActive =
          (pathname.includes(item.route) && item.route.length > 1) ||
          pathname === item.route;

        let route = item.route;
        if (item.route === "/profile" && userId) route = `${item.route}/${userId}`;
        else if (item.route === "/profile" && !userId) return null;

        return (
          <SheetClose asChild key={item.route}>
            <Link
              href={route}
              className={`${
                isActive ? "primary-gradient rounded-lg text-light-900" : "text-dark300_light900"
              } flex items-center justify-start gap-3 bg-transparent p-3`}
            >
              <Image src={item.imgURL} alt={item.label} width={20} height={20} className={isActive ? "brightness-[10]" : "invert-colors"} />
              <p className={isActive ? "base-bold" : "base-medium"}>{item.label}</p>
            </Link>
          </SheetClose>
        );
      })}
    </section>
  );
};

const Mobile = () => {
  const { data: session } = useSession();
  const [signInOpen, setSignInOpen] = useState(false);

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Image src="/assets/icons/hamburger.svg" width={36} height={36} alt="Menu" className="invert-colors sm:hidden" />
        </SheetTrigger>
        <SheetContent side="left" className="background-light900_dark200 border-none">
          <Link href="/" className="flex items-center gap-1">
            <Image src="/assets/images/site-logo.svg" width={23} height={23} alt="Forum" />
            <p className="h2-bold text-dark100_light900 font-spaceGrotesk">Diễn Đàn Võ Thuật</p>
          </Link>
          <div>
            <SheetClose asChild>
              <NavContent />
            </SheetClose>
            {!session && (
              <div className="flex flex-col gap-3 mt-6">
                <Button onClick={() => setSignInOpen(true)} className="small-medium primary-gradient min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none text-light-900">
                  Đăng Nhập
                </Button>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <SignInDialog open={signInOpen} onOpenChange={setSignInOpen} />
    </>
  );
};

export default Mobile;
