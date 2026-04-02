import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { auth } from "@/lib/auth";
import GlobalSearch from "../search/GlobalSearch";
import MobileSearch from "../search/MobileSearch";
import MartialArtFilter from "../MartialArtFilter";
import Mobile from "./Mobile";
import Theme from "./Theme";
import UserMenu from "./UserMenu";
import SignInButton from "./SignInButton";
import HorizontalNav from "./HorizontalNav";

const Navbar = async () => {
  const session = await auth();

  return (
    <header className="background-light900_dark200 fixed z-50 w-full shadow-light-300 dark:shadow-none">
      {/* Top Navbar - Tier 1 */}
      <nav className="border-b light-border">
        <div className="flex-between mx-auto max-w-7xl gap-4 px-3 py-2 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image src="/assets/images/site-logo.svg" width={28} height={28} alt="Forum" />
            <p className="h3-bold font-spaceGrotesk text-dark-100 dark:text-light-900 max-sm:hidden">
              Diễn Đàn Võ Thuật
            </p>
          </Link>

          {/* Search - Desktop */}
          <div className="flex-1 max-w-[600px] max-lg:hidden">
            <Suspense fallback={null}>
              <GlobalSearch />
            </Suspense>
          </div>

          {/* Right Side Actions */}
          <div className="flex-between gap-3">
            <Suspense fallback={null}>
              <MobileSearch />
            </Suspense>
            <MartialArtFilter />
            <Theme />

            {session?.user ? (
              <UserMenu
                user={{
                  id: session.user.id,
                  name: session.user.name,
                  email: session.user.email,
                  image: session.user.image,
                  role: session.user.role,
                }}
              />
            ) : (
              <SignInButton />
            )}

            <Mobile />
          </div>
        </div>
      </nav>

      {/* Horizontal Navigation - Tier 2 */}
      <HorizontalNav />
    </header>
  );
};

export default Navbar;
