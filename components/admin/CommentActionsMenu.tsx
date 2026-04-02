"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { adminApi } from "@/lib/api-client";

interface Props {
  commentId: string;
  authorId: string;
  authorName: string;
  isUserBlocked: boolean;
  questionSlug?: string;
}

export default function CommentActionsMenu({ commentId, authorId, authorName, isUserBlocked, questionSlug }: Props) {
  const router = useRouter();
  const { data: session } = useSession();
  const token = (session as any)?.apiToken;

  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const [blockReason, setBlockReason] = useState("Spam detected in comments");
  const [isBlocking, setIsBlocking] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await adminApi.deleteComment(commentId, token);
      setShowDeleteDialog(false);
      router.refresh();
    } catch {
      alert("Failed to delete comment");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBlockUser = async () => {
    setIsBlocking(true);
    try {
      await adminApi.blockUserFromComment(commentId, blockReason, token);
      setShowBlockDialog(false);
      router.refresh();
    } catch {
      alert("Failed to block user");
    } finally {
      setIsBlocking(false);
    }
  };

  return (
    <>
      <div className="relative inline-block">
        <button
          onClick={() => setOpen(!open)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-light-700 dark:border-dark-400 text-dark400_light700 transition-colors hover:background-light800_dark300 hover:text-dark100_light900"
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" />
          </svg>
        </button>

        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <div className="absolute right-0 top-9 z-20 w-44 rounded-xl border border-light-700 dark:border-dark-400 bg-light-900 dark:bg-dark-200 shadow-lg py-1">
              {questionSlug && (
                <a
                  href={`/question/${questionSlug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-dark100_light900 hover:background-light800_dark300"
                  onClick={() => setOpen(false)}
                >
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  View Question
                </a>
              )}
              <div className="my-1 border-t border-light-700 dark:border-dark-400" />
              <button
                onClick={() => { setOpen(false); setShowDeleteDialog(true); }}
                className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:background-light800_dark300"
              >
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete Comment
              </button>
              {!isUserBlocked ? (
                <button
                  onClick={() => { setOpen(false); setShowBlockDialog(true); }}
                  className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-orange-600 dark:text-orange-400 hover:background-light800_dark300"
                >
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                  Block User
                </button>
              ) : (
                <div className="flex items-center gap-2.5 px-4 py-2 text-sm text-dark400_light700">
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                  Already Blocked
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Delete Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-xl border border-light-700 dark:border-dark-400 background-light900_dark200 p-6 shadow-xl">
            <h3 className="mb-1 text-lg font-bold text-dark100_light900">Delete Comment</h3>
            <p className="mb-6 text-sm text-dark400_light700">Are you sure? This cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteDialog(false)}
                disabled={isDeleting}
                className="rounded-lg border border-light-700 dark:border-dark-400 px-4 py-2 text-sm font-medium text-dark100_light900 transition-colors hover:background-light800_dark300"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Block Dialog */}
      {showBlockDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border border-light-700 dark:border-dark-400 background-light900_dark200 p-6 shadow-xl">
            <h3 className="mb-1 text-lg font-bold text-dark100_light900">Block User</h3>
            <p className="mb-4 text-sm text-dark400_light700">Block <strong className="text-dark100_light900">{authorName}</strong> from posting?</p>
            <textarea
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
              placeholder="Reason for blocking..."
              rows={3}
              className="mb-4 w-full rounded-lg border border-light-700 dark:border-dark-400 bg-transparent p-3 text-sm text-dark100_light900 placeholder:text-dark400_light700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowBlockDialog(false)}
                disabled={isBlocking}
                className="rounded-lg border border-light-700 dark:border-dark-400 px-4 py-2 text-sm font-medium text-dark100_light900 transition-colors hover:background-light800_dark300"
              >
                Cancel
              </button>
              <button
                onClick={handleBlockUser}
                disabled={isBlocking || !blockReason}
                className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {isBlocking ? "Blocking..." : "Block User"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
