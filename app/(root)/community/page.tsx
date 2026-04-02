import { Suspense } from "react";
import { usersApi } from "@/lib/api-client";
import User from "@/components/cards/User";
import Filter from "@/components/shared/Filter";
import UnifiedPagination from "@/components/shared/UnifiedPagination";
import LocalSearch from "@/components/shared/search/LocalSearch";
import JoinButton from "@/components/shared/JoinButton";
import { UserFilters } from "@/constants/filters";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Thành viên - Diễn đàn Võ thuật" };

interface SearchParamsProps {
  searchParams: { q?: string; filter?: string; page?: string };
}

const Page = async ({ searchParams }: SearchParamsProps) => {
  const page = searchParams.page ? +searchParams.page : 1;
  const params: Record<string, any> = { page, pageSize: 20 };
  if (searchParams.q) params.q = searchParams.q;
  if (searchParams.filter) params.filter = searchParams.filter;

  let users: any[] = [];
  let isNext = false;
  let totalPages = 1;
  let totalUsers = 0;

  try {
    const res = await usersApi.getAll(params) as any;
    users = res?.users || [];
    isNext = res?.isNext || false;
    totalPages = res?.totalPages || 1;
    totalUsers = res?.totalUsers || users.length;
  } catch {
    // API chưa chạy
  }

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-dark100_light900">Thành viên</h1>
          <p className="mt-0.5 text-sm text-dark400_light700">{totalUsers > 0 ? `${totalUsers} thành viên` : "Cộng đồng võ thuật"}</p>
        </div>
      </div>

      <div className="mt-4 flex gap-3 max-sm:flex-col sm:items-center">
        <Suspense fallback={null}>
          <LocalSearch
            route="/community"
            iconPosition="left"
            imgSrc="/assets/icons/search.svg"
            placeholder="Tìm kiếm thành viên…"
            otherClasses="flex-1"
          />
          <Filter filters={UserFilters} otherClasses="min-h-[40px] sm:min-w-[160px]" />
        </Suspense>
      </div>

      <section className="mt-4">
        {users.length > 0 ? (
          users.map((user: any) => <User key={user._id} user={user} />)
        ) : (
          <div className="py-12 text-center">
            <p className="text-sm text-dark400_light700">Chưa có thành viên nào</p>
            <JoinButton>Tham gia ngay để trở thành người đầu tiên!</JoinButton>
          </div>
        )}
      </section>

      {isNext && (
        <div className="mt-6">
          <UnifiedPagination
            pageNumber={page}
            isNext={isNext}
            totalPages={totalPages}
            totalItems={totalUsers}
            itemLabel="thành viên"
            showPageNumbers
          />
        </div>
      )}
    </>
  );
};

export default Page;
