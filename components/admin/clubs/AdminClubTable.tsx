"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import { adminApi } from "@/lib/api-client";
import Link from "next/link";
import Image from "next/image";

interface Coach {
  name: string;
  phone: string;
  description?: string;
}

interface Club {
  _id: string;
  name: string;
  slug: string;
  coach: string;
  coaches?: Coach[];
  province: { _id: string; name: string };
  martialArt: { _id: string; name: string };
  phone: string;
  isHidden: boolean;
  isApproved: boolean;
  thumbnail?: string;
  parentClub?: { _id: string; name: string; slug: string } | null;
  createdBy?: {
    _id: string;
    name: string;
    username: string;
    email: string;
    picture?: string;
  };
}

interface Props {
  clubs: Club[];
}

export default function AdminClubTable({ clubs }: Props) {
  const router = useRouter();
  const { data: session } = useSession();
  const token = (session as any)?.apiToken;
  const { toast } = useToast();
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const handleToggleHide = async (clubId: string) => {
    setTogglingId(clubId);
    setOpenMenuId(null);
    try {
      await adminApi.toggleHideClub(clubId, token);
      toast({ title: "Thành công", description: "Đã cập nhật trạng thái câu lạc bộ" });
      router.refresh();
    } catch (error: any) {
      toast({ title: "Lỗi", description: error.message || "Không thể cập nhật trạng thái", variant: "destructive" });
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (clubId: string) => {
    setOpenMenuId(null);
    if (!confirm("Bạn có chắc chắn muốn xóa câu lạc bộ này?")) return;
    setDeletingId(clubId);
    try {
      await adminApi.deleteClub(clubId, token);
      toast({ title: "Thành công", description: "Đã xóa câu lạc bộ" });
      router.refresh();
    } catch (error: any) {
      toast({ title: "Lỗi", description: error.message || "Không thể xóa câu lạc bộ", variant: "destructive" });
    } finally {
      setDeletingId(null);
    }
  };

  const handleApprove = async (clubId: string, approved: boolean) => {
    const message = approved ? "duyệt" : "từ chối";
    setOpenMenuId(null);
    if (!confirm(`Bạn có chắc chắn muốn ${message} CLB này?`)) return;
    setApprovingId(clubId);
    try {
      await adminApi.approveClub(clubId, approved, token);
      toast({ title: "Thành công", description: approved ? "Đã duyệt CLB" : "Đã từ chối CLB" });
      router.refresh();
    } catch (error: any) {
      toast({ title: "Lỗi", description: error.message || "Không thể cập nhật trạng thái", variant: "destructive" });
    } finally {
      setApprovingId(null);
    }
  };

  if (clubs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30">
          <svg className="h-7 w-7 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <p className="text-base font-semibold text-dark100_light900">Không có câu lạc bộ nào</p>
        <p className="mt-1 text-sm text-dark400_light700">Thử thay đổi bộ lọc hoặc tìm kiếm</p>
      </div>
    );
  }

  const isLoading = (id: string) => togglingId === id || deletingId === id || approvingId === id;

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-light-700 dark:border-dark-400 background-light800_dark300">
            <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-widest text-dark400_light700">CLB</th>
            <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-widest text-dark400_light700">Người tạo</th>
            <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-widest text-dark400_light700">HLV</th>
            <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-widest text-dark400_light700">Môn võ</th>
            <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-widest text-dark400_light700">Tỉnh/TP</th>
            <th className="px-5 py-3.5 text-center text-[11px] font-semibold uppercase tracking-widest text-dark400_light700">Duyệt</th>
            <th className="px-5 py-3.5 text-center text-[11px] font-semibold uppercase tracking-widest text-dark400_light700">Hiển thị</th>
            <th className="px-5 py-3.5 text-right text-[11px] font-semibold uppercase tracking-widest text-dark400_light700">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-light-700 dark:divide-dark-400">
          {clubs.map((club) => (
            <tr key={club._id} className="group transition-colors hover:background-light800_dark300">
              {/* CLB Name + Thumbnail */}
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  {club.thumbnail ? (
                    <Image src={club.thumbnail} alt={club.name} width={40} height={40} className="h-10 w-10 shrink-0 rounded-lg object-cover" />
                  ) : (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30 text-xs font-bold text-orange-600 dark:text-orange-400">
                      {club.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-dark100_light900 leading-tight">
                      {club.parentClub && <span className="text-dark400_light700 mr-1">↳</span>}
                      {club.name}
                    </p>
                    {club.parentClub && (
                      <p className="text-xs text-dark400_light700">Chi nhánh của: {club.parentClub.name}</p>
                    )}
                  </div>
                </div>
              </td>

              {/* Creator */}
              <td className="px-5 py-4">
                {club.createdBy ? (
                  <div className="flex items-center gap-2">
                    {club.createdBy.picture ? (
                      <Image src={club.createdBy.picture} alt={club.createdBy.name} width={24} height={24} className="h-6 w-6 rounded-full object-cover" />
                    ) : (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-light-700 dark:bg-dark-400 text-[10px] font-bold text-dark400_light700">
                        {club.createdBy.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-medium text-dark100_light900">{club.createdBy.name}</p>
                      <p className="text-[11px] text-dark400_light700">@{club.createdBy.username}</p>
                    </div>
                  </div>
                ) : (
                  <span className="text-xs text-dark400_light700">—</span>
                )}
              </td>

              {/* Coaches */}
              <td className="px-5 py-4">
                <p className="text-sm text-dark300_light900">
                  {club.coaches && club.coaches.length > 0
                    ? club.coaches.map((c) => c.name).join(", ")
                    : club.coach || <span className="text-dark400_light700">—</span>}
                </p>
              </td>

              {/* Martial Art */}
              <td className="px-5 py-4">
                <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  {club.martialArt?.name || "N/A"}
                </span>
              </td>

              {/* Province */}
              <td className="px-5 py-4">
                <span className="text-sm text-dark300_light900">{club.province?.name || "N/A"}</span>
              </td>

              {/* Approval */}
              <td className="px-5 py-4 text-center">
                {club.isApproved ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-[11px] font-semibold text-green-700 dark:bg-green-900/40 dark:text-green-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                    Đã duyệt
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-1 text-[11px] font-semibold text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-yellow-500"></span>
                    Chờ duyệt
                  </span>
                )}
              </td>

              {/* Visibility */}
              <td className="px-5 py-4 text-center">
                {club.isHidden ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
                    Đang ẩn
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-1 text-[11px] font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                    Hiển thị
                  </span>
                )}
              </td>

              {/* Actions */}
              <td className="px-5 py-4 text-right">
                <div className="relative inline-block">
                  <button
                    onClick={() => setOpenMenuId(openMenuId === club._id ? null : club._id)}
                    disabled={isLoading(club._id)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-light-700 dark:border-dark-400 text-dark400_light700 transition-colors hover:background-light800_dark300 hover:text-dark100_light900 disabled:opacity-50"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" />
                    </svg>
                  </button>

                  {openMenuId === club._id && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
                      <div className="absolute right-0 top-9 z-20 w-44 rounded-xl border border-light-700 dark:border-dark-400 bg-light-900 dark:bg-dark-200 shadow-lg py-1">
                        <Link
                          href={`/admin/clubs/edit/${club._id}`}
                          className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-dark100_light900 hover:background-light800_dark300"
                          onClick={() => setOpenMenuId(null)}
                        >
                          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Chỉnh sửa
                        </Link>
                        <div className="my-1 border-t border-light-700 dark:border-dark-400" />
                        {club.isApproved ? (
                          <button
                            onClick={() => handleApprove(club._id, false)}
                            className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-orange-600 dark:text-orange-400 hover:background-light800_dark300"
                          >
                            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Hủy duyệt
                          </button>
                        ) : (
                          <button
                            onClick={() => handleApprove(club._id, true)}
                            className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-green-600 dark:text-green-400 hover:background-light800_dark300"
                          >
                            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Duyệt CLB
                          </button>
                        )}
                        <button
                          onClick={() => handleToggleHide(club._id)}
                          className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:background-light800_dark300"
                        >
                          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={club.isHidden ? "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" : "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"} />
                          </svg>
                          {club.isHidden ? "Hiện CLB" : "Ẩn CLB"}
                        </button>
                        <div className="my-1 border-t border-light-700 dark:border-dark-400" />
                        <button
                          onClick={() => handleDelete(club._id)}
                          className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:background-light800_dark300"
                        >
                          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Xóa CLB
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
  );
}
