"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { adminApi } from "@/lib/api-client";
import TinyEditor from "@/components/shared/TinyEditor";
import Link from "next/link";

export default function AdminEditQuestionPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const token = (session as any)?.apiToken;
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [question, setQuestion] = useState<any>(null);
  const [form, setForm] = useState({
    title: "",
    content: "",
    isHidden: false,
    isApproved: false,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) return;
    adminApi.getQuestion(id, token)
      .then((q: any) => {
        setQuestion(q);
        setForm({
          title: q.title || "",
          content: q.content || "",
          isHidden: q.isHidden || false,
          isApproved: q.isApproved || false,
        });
      })
      .catch(() => setError("Không thể tải câu hỏi"))
      .finally(() => setLoading(false));
  }, [id, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await adminApi.updateQuestion(id, form, token);
      setSuccess(true);
      setTimeout(() => router.push("/admin/questions"), 1000);
    } catch (err: any) {
      setError(err.message || "Không thể lưu câu hỏi");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  if (error && !question) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-base font-semibold text-dark100_light900">{error}</p>
        <Link href="/admin/questions" className="mt-4 text-sm text-primary-500 hover:underline">← Back to Questions</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin/questions"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-light-700 dark:border-dark-400 text-dark400_light700 transition-colors hover:background-light800_dark300"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div className="border-l-4 border-l-indigo-500 pl-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-dark400_light700">Admin / Questions</p>
          <h1 className="mt-0.5 text-2xl font-bold text-dark100_light900">Edit Question</h1>
        </div>
      </div>

      {/* Meta info */}
      {question && (
        <div className="flex flex-wrap gap-3">
          {question.author && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-light-800 dark:bg-dark-300 px-3 py-1 text-xs text-dark400_light700">
              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {question.author.name} (@{question.author.username})
            </span>
          )}
          {question.martialArt && (
            <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
              {question.martialArt.name}
            </span>
          )}
          {question.tags?.map((tag: any) => (
            <span key={tag._id} className="inline-flex items-center rounded-full bg-indigo-100 dark:bg-indigo-900/40 px-3 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
              #{tag.name}
            </span>
          ))}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="overflow-hidden rounded-xl border border-light-700 dark:border-dark-400 background-light900_dark200">
          <div className="border-b border-light-700 dark:border-dark-400 px-5 py-3.5">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-dark400_light700">Question Details</p>
          </div>
          <div className="space-y-5 p-5">
            {/* Title */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-dark100_light900">Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                className="w-full rounded-lg border border-light-700 dark:border-dark-400 bg-transparent px-4 py-2.5 text-sm text-dark100_light900 placeholder:text-dark400_light700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>

            {/* Content */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-dark100_light900">Content</label>
              <TinyEditor
                value={form.content}
                onChange={(val) => setForm({ ...form, content: val })}
                height={400}
                placeholder="Nội dung câu hỏi..."
              />
            </div>
          </div>
        </div>

        {/* Status toggles */}
        <div className="overflow-hidden rounded-xl border border-light-700 dark:border-dark-400 background-light900_dark200">
          <div className="border-b border-light-700 dark:border-dark-400 px-5 py-3.5">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-dark400_light700">Status</p>
          </div>
          <div className="flex flex-wrap gap-6 p-5">
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => setForm({ ...form, isHidden: !form.isHidden })}
                className={`relative h-6 w-11 rounded-full transition-colors ${form.isHidden ? "bg-red-500" : "bg-light-700 dark:bg-dark-400"}`}
              >
                <span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${form.isHidden ? "translate-x-6" : "translate-x-1"}`} />
              </div>
              <span className="text-sm font-medium text-dark100_light900">Hidden</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => setForm({ ...form, isApproved: !form.isApproved })}
                className={`relative h-6 w-11 rounded-full transition-colors ${form.isApproved ? "bg-green-500" : "bg-light-700 dark:bg-dark-400"}`}
              >
                <span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${form.isApproved ? "translate-x-6" : "translate-x-1"}`} />
              </div>
              <span className="text-sm font-medium text-dark100_light900">Approved</span>
            </label>
          </div>
        </div>

        {/* Error / Success */}
        {error && <p className="rounded-lg bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-600 dark:text-red-400">{error}</p>}
        {success && <p className="rounded-lg bg-green-50 dark:bg-green-900/20 px-4 py-3 text-sm text-green-600 dark:text-green-400">Đã lưu thành công! Đang chuyển hướng...</p>}

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Link
            href="/admin/questions"
            className="rounded-lg border border-light-700 dark:border-dark-400 px-5 py-2.5 text-sm font-medium text-dark100_light900 transition-colors hover:background-light800_dark300"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-primary-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
