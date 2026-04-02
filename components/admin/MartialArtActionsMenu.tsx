"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface MartialArtActionsMenuProps {
  martialArtId: string;
  martialArtName: string;
  isHidden: boolean;
  questionCount: number;
}

const MartialArtActionsMenu = ({
  martialArtId,
  martialArtName,
  isHidden,
  questionCount,
}: MartialArtActionsMenuProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
  const getToken = () => (session as any)?.apiToken;

  const handleToggleHide = async () => {
    setOpen(false);
    setIsLoading(true);
    try {
      await fetch(`${API_BASE}/martial-arts/${martialArtId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ isHidden: !isHidden }),
      });
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Không thể thay đổi trạng thái");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setOpen(false);
    const msg = questionCount > 0
      ? `"${martialArtName}" có ${questionCount} câu hỏi. Xóa môn võ này sẽ gỡ bỏ liên kết khỏi tất cả câu hỏi. Bạn có chắc?`
      : `Bạn có chắc muốn xóa "${martialArtName}"? Hành động này không thể hoàn tác.`;
    if (!confirm(msg)) return;

    setIsLoading(true);
    try {
      await fetch(`${API_BASE}/martial-arts/${martialArtId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Không thể xóa môn võ");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen(!open)}
        disabled={isLoading}
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-light-700 dark:border-dark-400 text-dark400_light700 transition-colors hover:background-light800_dark300 hover:text-dark100_light900 disabled:opacity-50"
      >
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-9 z-20 w-44 rounded-xl border border-light-700 dark:border-dark-400 bg-light-900 dark:bg-dark-200 shadow-lg py-1">
            <Link
              href={`/admin/martial-arts/${martialArtId}/edit`}
              className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-dark100_light900 hover:background-light800_dark300"
              onClick={() => setOpen(false)}
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Chỉnh sửa
            </Link>
            <div className="my-1 border-t border-light-700 dark:border-dark-400" />
            <button
              onClick={handleToggleHide}
              className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:background-light800_dark300"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isHidden ? "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" : "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a10.025 10.025 0 014.132-5.411m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"} />
              </svg>
              {isHidden ? "Hiện môn võ" : "Ẩn môn võ"}
            </button>
            <div className="my-1 border-t border-light-700 dark:border-dark-400" />
            <button
              onClick={handleDelete}
              className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:background-light800_dark300"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Xóa môn võ
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MartialArtActionsMenu;
