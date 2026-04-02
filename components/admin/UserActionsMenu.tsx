"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface UserActionsMenuProps {
  userId: string;
  isBlocked: boolean;
  currentRole: string;
  userName: string;
}

const UserActionsMenu = ({ userId, isBlocked, currentRole, userName }: UserActionsMenuProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const [blockReason, setBlockReason] = useState("");

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
  const getToken = () => (session as any)?.apiToken;

  const handleBlockToggle = async () => {
    if (!isBlocked && !blockReason.trim()) {
      alert("Please provide a reason for blocking");
      return;
    }
    setIsLoading(true);
    try {
      await fetch(`${API_BASE}/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ isBlocked: !isBlocked, blockReason }),
      });
      setShowBlockDialog(false);
      setBlockReason("");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to update user status");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = async () => {
    if (!confirm(`Change ${userName}'s role to ${currentRole === "admin" ? "user" : "admin"}?`)) return;
    setIsLoading(true);
    try {
      await fetch(`${API_BASE}/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ role: currentRole === "admin" ? "user" : "admin" }),
      });
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to change user role");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setOpen(false);
    if (!confirm(`Delete ${userName}? This cannot be undone.`)) return;
    setIsLoading(true);
    try {
      await fetch(`${API_BASE}/admin/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to delete user");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
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
                href={`/admin/users/${userId}`}
                className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-dark100_light900 hover:background-light800_dark300"
                onClick={() => setOpen(false)}
              >
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                View Details
              </Link>
              <div className="my-1 border-t border-light-700 dark:border-dark-400" />
              <button
                onClick={() => {
                  setOpen(false);
                  if (isBlocked) {
                    handleBlockToggle();
                  } else {
                    setShowBlockDialog(true);
                  }
                }}
                className={`flex w-full items-center gap-2.5 px-4 py-2 text-sm hover:background-light800_dark300 ${isBlocked ? "text-green-600 dark:text-green-400" : "text-yellow-600 dark:text-yellow-400"}`}
              >
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isBlocked ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" : "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"} />
                </svg>
                {isBlocked ? "Unblock User" : "Block User"}
              </button>
              <button
                onClick={() => { setOpen(false); handleRoleChange(); }}
                className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-purple-600 dark:text-purple-400 hover:background-light800_dark300"
              >
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                Make {currentRole === "admin" ? "User" : "Admin"}
              </button>
              <div className="my-1 border-t border-light-700 dark:border-dark-400" />
              <button
                onClick={handleDelete}
                className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:background-light800_dark300"
              >
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete User
              </button>
            </div>
          </>
        )}
      </div>

      {/* Block Dialog */}
      {showBlockDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border border-light-700 dark:border-dark-400 background-light900_dark200 p-6 shadow-xl">
            <h3 className="mb-1 text-lg font-bold text-dark100_light900">Block User</h3>
            <p className="mb-4 text-sm text-dark400_light700">Block <strong className="text-dark100_light900">{userName}</strong> from posting?</p>
            <textarea
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
              placeholder="Reason for blocking..."
              rows={4}
              className="mb-4 w-full rounded-lg border border-light-700 dark:border-dark-400 bg-transparent p-3 text-sm text-dark100_light900 placeholder:text-dark400_light700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => { setShowBlockDialog(false); setBlockReason(""); }}
                className="rounded-lg border border-light-700 dark:border-dark-400 px-4 py-2 text-sm font-medium text-dark100_light900 transition-colors hover:background-light800_dark300"
              >
                Cancel
              </button>
              <button
                onClick={handleBlockToggle}
                disabled={isLoading || !blockReason.trim()}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {isLoading ? "Blocking..." : "Block User"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserActionsMenu;
