"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import TinyEditor from "@/components/shared/TinyEditor";
import Link from "next/link";

export default function AdminEditTagPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const token = (session as any)?.apiToken;
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tag, setTag] = useState<any>(null);
  const [form, setForm] = useState({ name: "", slug: "", description: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

  useEffect(() => {
    if (!token) return;
    fetch(`${API_BASE}/admin/tags/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => {
        setTag(data);
        setForm({ name: data.name || "", slug: data.slug || "", description: data.description || "" });
      })
      .catch(() => {
        // fallback: try public tags endpoint
        fetch(`${API_BASE}/tags/${id}`)
          .then((r) => r.json())
          .then((data) => {
            setTag(data);
            setForm({ name: data.name || "", slug: data.slug || "", description: data.description || "" });
          })
          .catch(() => setError("Không thể tải tag"));
      })
      .finally(() => setLoading(false));
  }, [id, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/tags/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setSuccess(true);
      setTimeout(() => router.push("/admin/tags"), 1000);
    } catch (err: any) {
      setError(err.message || "Không thể lưu tag");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center py-24"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" /></div>;
  if (error && !tag) return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <p className="text-base font-semibold text-dark100_light900">{error}</p>
      <Link href="/admin/tags" className="mt-4 text-sm text-primary-500 hover:underline">← Back</Link>
    </div>
  );

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/tags" className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-light-700 dark:border-dark-400 text-dark400_light700 transition-colors hover:background-light800_dark300">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </Link>
        <div className="border-l-4 border-l-teal-500 pl-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-dark400_light700">Admin / Tags</p>
          <h1 className="mt-0.5 text-2xl font-bold text-dark100_light900">Edit Tag</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="overflow-hidden rounded-xl border border-light-700 dark:border-dark-400 background-light900_dark200">
          <div className="border-b border-light-700 dark:border-dark-400 px-5 py-3.5">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-dark400_light700">Tag Info</p>
          </div>
          <div className="space-y-5 p-5">
            {[
              { label: "Name", key: "name" },
              { label: "Slug", key: "slug" },
            ].map(({ label, key }) => (
              <div key={key}>
                <label className="mb-1.5 block text-sm font-semibold text-dark100_light900">{label}</label>
                <input
                  type="text"
                  value={(form as any)[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="w-full rounded-lg border border-light-700 dark:border-dark-400 bg-transparent px-4 py-2.5 text-sm text-dark100_light900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
            ))}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-dark100_light900">Description</label>
              <TinyEditor
                value={form.description}
                onChange={(val) => setForm({ ...form, description: val })}
                height={250}
                placeholder="Tag description..."
              />
            </div>
          </div>
        </div>

        {error && <p className="rounded-lg bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-600 dark:text-red-400">{error}</p>}
        {success && <p className="rounded-lg bg-green-50 dark:bg-green-900/20 px-4 py-3 text-sm text-green-600 dark:text-green-400">Đã lưu thành công!</p>}

        <div className="flex justify-end gap-3">
          <Link href="/admin/tags" className="rounded-lg border border-light-700 dark:border-dark-400 px-5 py-2.5 text-sm font-medium text-dark100_light900 transition-colors hover:background-light800_dark300">Cancel</Link>
          <button type="submit" disabled={saving} className="rounded-lg bg-primary-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-50">
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
