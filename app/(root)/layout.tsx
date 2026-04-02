import React, { Suspense } from 'react';
import Navbar from '@/components/shared/navbar/Navbar';
import RightSidebar from '@/components/shared/Rightsidebar';
import { Toaster } from '@/components/ui/toaster';
import AffiliateTracker from '@/components/shared/AffiliateTracker';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="background-light850_dark100 relative">
      <Navbar />
      <Suspense fallback={null}>
        <AffiliateTracker />
      </Suspense>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-[120px]">
        <div className="flex gap-8">
          {/* Main Content — narrow enough for comfortable reading */}
          <section className="flex min-h-screen flex-1 flex-col pb-10 min-w-0">
            {children}
          </section>

          {/* Right Sidebar */}
          <RightSidebar />
        </div>
      </div>

      <Toaster />
    </main>
  );
};

export default Layout;
