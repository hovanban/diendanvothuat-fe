"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface TagActionsMenuProps {
  tagId: string;
  tagName: string;
  questionCount: number;
}

const TagActionsMenu = ({ tagId, tagName, questionCount }: TagActionsMenuProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
  const getToken = () => (session as any)?.apiToken;

  const handleDelete = async () => {
    setOpen(false);
    const msg = questionCount > 0
      ? `"${tagName}" is used in ${questionCount} questions. Deleting will remove it from all questions. Are you sure?`
      : `Are you sure you want to delete "${tagName}"? This cannot be undone.`;
    if (!confirm(msg)) return;

    setIsLoading(true);
    try {
      await fetch(`${API_BASE}/admin/tags/${tagId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to delete tag");
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
          <div className="absolute right-0 top-9 z-20 w-40 rounded-xl border border-light-700 dark:border-dark-400 bg-light-900 dark:bg-dark-200 shadow-lg py-1">
            <Link
              href={`/admin/tags/${tagId}/edit`}
              className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-dark100_light900 hover:background-light800_dark300"
              onClick={() => setOpen(false)}
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </Link>
            <div className="my-1 border-t border-light-700 dark:border-dark-400" />
            <button
              onClick={handleDelete}
              className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:background-light800_dark300"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TagActionsMenu;
