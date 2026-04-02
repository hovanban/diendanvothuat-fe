"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import { adminApi } from "@/lib/api-client";
import AdminProvinceEditDialog from "./AdminProvinceEditDialog";
import AdminProvinceDeleteDialog from "./AdminProvinceDeleteDialog";

interface Province {
  _id: string;
  name: string;
  slug: string;
  code: string;
  isActive: boolean;
  order: number;
}

interface Props {
  provinces: Province[];
}

export default function AdminProvinceTable({ provinces }: Props) {
  const router = useRouter();
  const { data: session } = useSession();
  const token = (session as any)?.apiToken;
  const { toast } = useToast();
  const [editingProvince, setEditingProvince] = useState<Province | null>(null);
  const [deletingProvinceId, setDeletingProvinceId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const handleToggleActive = async (provinceId: string) => {
    setTogglingId(provinceId);
    setOpenMenuId(null);
    try {
      await adminApi.updateProvince(provinceId, { toggleActive: true }, token);
      toast({ title: "Thành công", description: "Đã cập nhật trạng thái tỉnh/thành phố" });
      router.refresh();
    } catch (error: any) {
      toast({ title: "Lỗi", description: error.message || "Không thể cập nhật trạng thái", variant: "destructive" });
    } finally {
      setTogglingId(null);
    }
  };

  if (provinces.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
          <svg className="h-7 w-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <p className="text-base font-semibold text-dark100_light900">Không có tỉnh/thành phố nào</p>
        <p className="mt-1 text-sm text-dark400_light700">Thử thay đổi bộ lọc hoặc tìm kiếm</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-light-700 dark:border-dark-400 background-light800_dark300">
              <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-widest text-dark400_light700">STT</th>
              <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-widest text-dark400_light700">Tên tỉnh/thành</th>
              <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-widest text-dark400_light700">Slug</th>
              <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-widest text-dark400_light700">Mã</th>
              <th className="px-5 py-3.5 text-center text-[11px] font-semibold uppercase tracking-widest text-dark400_light700">Trạng thái</th>
              <th className="px-5 py-3.5 text-right text-[11px] font-semibold uppercase tracking-widest text-dark400_light700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-light-700 dark:divide-dark-400">
            {provinces.map((province) => (
              <tr key={province._id} className="group transition-colors hover:background-light800_dark300">
                <td className="px-5 py-4">
                  <span className="text-sm font-mono text-dark400_light700">{province.order}</span>
                </td>
                <td className="px-5 py-4">
                  <p className="text-sm font-semibold text-dark100_light900">{province.name}</p>
                </td>
                <td className="px-5 py-4">
                  <code className="rounded-md bg-light-800 dark:bg-dark-300 px-2 py-0.5 text-xs font-mono text-dark400_light700">
                    {province.slug}
                  </code>
                </td>
                <td className="px-5 py-4">
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-1 text-[11px] font-semibold text-green-700 dark:bg-green-900/40 dark:text-green-300">
                    {province.code}
                  </span>
                </td>
                <td className="px-5 py-4 text-center">
                  {province.isActive ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-[11px] font-semibold text-green-700 dark:bg-green-900/40 dark:text-green-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                      Hoạt động
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
                      Không hoạt động
                    </span>
                  )}
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="relative inline-block">
                    <button
                      onClick={() => setOpenMenuId(openMenuId === province._id ? null : province._id)}
                      disabled={togglingId === province._id}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-light-700 dark:border-dark-400 text-dark400_light700 transition-colors hover:background-light800_dark300 hover:text-dark100_light900 disabled:opacity-50"
                    >
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" />
                      </svg>
                    </button>

                    {openMenuId === province._id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
                        <div className="absolute right-0 top-9 z-20 w-44 rounded-xl border border-light-700 dark:border-dark-400 bg-light-900 dark:bg-dark-200 shadow-lg py-1">
                          <button
                            onClick={() => { setOpenMenuId(null); setEditingProvince(province); }}
                            className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-dark100_light900 hover:background-light800_dark300"
                          >
                            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Chỉnh sửa
                          </button>
                          <div className="my-1 border-t border-light-700 dark:border-dark-400" />
                          <button
                            onClick={() => handleToggleActive(province._id)}
                            className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:background-light800_dark300"
                          >
                            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={province.isActive ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a10.025 10.025 0 014.132-5.411m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" : "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"} />
                            </svg>
                            {province.isActive ? "Ẩn tỉnh" : "Hiện tỉnh"}
                          </button>
                          <div className="my-1 border-t border-light-700 dark:border-dark-400" />
                          <button
                            onClick={() => { setOpenMenuId(null); setDeletingProvinceId(province._id); }}
                            className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:background-light800_dark300"
                          >
                            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Xóa tỉnh
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingProvince && (
        <AdminProvinceEditDialog province={editingProvince} isOpen={!!editingProvince} onClose={() => setEditingProvince(null)} />
      )}
      {deletingProvinceId && (
        <AdminProvinceDeleteDialog provinceId={deletingProvinceId} isOpen={!!deletingProvinceId} onClose={() => setDeletingProvinceId(null)} />
      )}
    </>
  );
}
