"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import TinyEditor from "@/components/shared/TinyEditor";
import Link from "next/link";

export default function AdminEditMartialArtPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const token = (session as any)?.apiToken;
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [ma, setMa] = useState<any>(null);
  const [form, setForm] = useState({
    name: "", slug: "", description: "", isHidden: false, isFeatured: false, order: 0,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

  useEffect(() => {
    if (!token) return;
    fetch(`${API_BASE}/martial-arts/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => {
        setMa(data);
        setForm({
          name: data.name || "",
          slug: data.slug || "",
          description: data.description || "",
          isHidden: data.isHidden || false,
          isFeatured: data.isFeatured || false,
          order: data.order || 0,
        });
      })
      .catch(() => setError("Không thể tải dữ liệu"))
      .finally(() => setLoading(false));
  }, [id, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/martial-arts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setSuccess(true);
      setTimeout(() => router.push("/admin/martial-arts"), 1000);
    } catch (err: any) {
      setError(err.message || "Không thể lưu");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center py-24"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" /></div>;

  if (error && !ma) return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <p className="text-base font-semibold text-dark100_light900">{error}</p>
      <Link href="/admin/martial-arts" className="mt-4 text-sm text-primary-500 hover:underline">← Back</Link>
    </div>
  );

  const toggle = (label: string, key: string, color: string) => (
    <label className="flex items-center gap-3 cursor-pointer">
      <div
        onClick={() => setForm({ ...form, [key]: !(form as any)[key] })}
        className={`relative h-6 w-11 rounded-full transition-colors ${(form as any)[key] ? color : "bg-light-700 dark:bg-dark-400"}`}
      >
        <span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${(form as any)[key] ? "translate-x-6" : "translate-x-1"}`} />
      </div>
      <span className="text-sm font-medium text-dark100_light900">{label}</span>
    </label>
  );

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/martial-arts" className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-light-700 dark:border-dark-400 text-dark400_light700 transition-colors hover:background-light800_dark300">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </Link>
        <div className="border-l-4 border-l-slate-500 pl-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-dark400_light700">Admin / Martial Arts</p>
          <h1 className="mt-0.5 text-2xl font-bold text-dark100_light900">Edit Môn Võ</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="overflow-hidden rounded-xl border border-light-700 dark:border-dark-400 background-light900_dark200">
          <div className="border-b border-light-700 dark:border-dark-400 px-5 py-3.5">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-dark400_light700">Thông tin</p>
          </div>
          <div className="grid gap-5 p-5 sm:grid-cols-2">
            {[
              { label: "Tên môn võ", key: "name", span: 2 },
              { label: "Slug", key: "slug" },
              { label: "Thứ tự", key: "order", type: "number" },
            ].map(({ label, key, span, type }) => (
              <div key={key} className={span === 2 ? "sm:col-span-2" : ""}>
                <label className="mb-1.5 block text-sm font-semibold text-dark100_light900">{label}</label>
                <input
                  type={type || "text"}
                  value={(form as any)[key]}
                  onChange={(e) => setForm({ ...form, [key]: type === "number" ? +e.target.value : e.target.value })}
                  className="w-full rounded-lg border border-light-700 dark:border-dark-400 bg-transparent px-4 py-2.5 text-sm text-dark100_light900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
            ))}
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-semibold text-dark100_light900">Mô tả</label>
              <TinyEditor
                value={form.description}
                onChange={(val) => setForm({ ...form, description: val })}
                height={280}
                placeholder="Mô tả môn võ..."
              />
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-light-700 dark:border-dark-400 background-light900_dark200">
          <div className="border-b border-light-700 dark:border-dark-400 px-5 py-3.5">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-dark400_light700">Status</p>
          </div>
          <div className="flex flex-wrap gap-6 p-5">
            {toggle("Ẩn", "isHidden", "bg-red-500")}
            {toggle("Nổi bật", "isFeatured", "bg-yellow-500")}
          </div>
        </div>

        {error && <p className="rounded-lg bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-600 dark:text-red-400">{error}</p>}
        {success && <p className="rounded-lg bg-green-50 dark:bg-green-900/20 px-4 py-3 text-sm text-green-600 dark:text-green-400">Đã lưu thành công!</p>}

        <div className="flex justify-end gap-3">
          <Link href="/admin/martial-arts" className="rounded-lg border border-light-700 dark:border-dark-400 px-5 py-2.5 text-sm font-medium text-dark100_light900 transition-colors hover:background-light800_dark300">Cancel</Link>
          <button type="submit" disabled={saving} className="rounded-lg bg-primary-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-50">
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
