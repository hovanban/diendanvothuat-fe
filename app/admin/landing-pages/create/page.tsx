"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { adminApi } from "@/lib/api-client";
import TinyEditor from "@/components/shared/TinyEditor";
import Link from "next/link";

export default function AdminCreateLandingPagePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const token = (session as any)?.apiToken;

  const [saving, setSaving] = useState(false);
  const [martialArts, setMartialArts] = useState<any[]>([]);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [form, setForm] = useState({
    slug: "", title: "", description: "", content: "",
    martialArtId: "", provinceId: "", metaTitle: "", metaDescription: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    Promise.all([adminApi.getMartialArts(token), adminApi.getProvinces(token)])
      .then(([maRes, pvRes]: any) => {
        setMartialArts(maRes?.martialArts || maRes || []);
        setProvinces(Array.isArray(pvRes) ? pvRes : (pvRes?.provinces || []));
      }).catch(() => {});
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await adminApi.createLandingPage({
        slug: form.slug,
        title: form.title,
        description: form.description,
        content: form.content,
        martialArt: form.martialArtId || undefined,
        province: form.provinceId || undefined,
        metaTitle: form.metaTitle,
        metaDescription: form.metaDescription,
      }, token);
      router.push("/admin/landing-pages");
    } catch (err: any) {
      setError(err.message || "Không thể tạo landing page");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/landing-pages" className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-light-700 dark:border-dark-400 text-dark400_light700 transition-colors hover:background-light800_dark300">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </Link>
        <div className="border-l-4 border-l-purple-500 pl-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-dark400_light700">Admin / Landing Pages</p>
          <h1 className="mt-0.5 text-2xl font-bold text-dark100_light900">Tạo Landing Page</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Basic Info */}
        <div className="overflow-hidden rounded-xl border border-light-700 dark:border-dark-400 background-light900_dark200">
          <div className="border-b border-light-700 dark:border-dark-400 px-5 py-3.5">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-dark400_light700">Thông tin cơ bản</p>
          </div>
          <div className="grid gap-5 p-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-dark100_light900">Slug <span className="text-red-500">*</span></label>
              <input type="text" required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="vo-co-truyen-ha-noi"
                className="w-full rounded-lg border border-light-700 dark:border-dark-400 bg-transparent px-4 py-2.5 text-sm text-dark100_light900 placeholder:text-dark400_light700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-dark100_light900">Title <span className="text-red-500">*</span></label>
              <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full rounded-lg border border-light-700 dark:border-dark-400 bg-transparent px-4 py-2.5 text-sm text-dark100_light900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-dark100_light900">Môn võ</label>
              <select value={form.martialArtId} onChange={(e) => setForm({ ...form, martialArtId: e.target.value })}
                className="w-full rounded-lg border border-light-700 dark:border-dark-400 bg-transparent px-4 py-2.5 text-sm text-dark100_light900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500">
                <option value="">Tất cả môn võ</option>
                {martialArts.map((ma: any) => <option key={ma._id} value={ma._id}>{ma.name}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-dark100_light900">Tỉnh/Thành phố</label>
              <select value={form.provinceId} onChange={(e) => setForm({ ...form, provinceId: e.target.value })}
                className="w-full rounded-lg border border-light-700 dark:border-dark-400 bg-transparent px-4 py-2.5 text-sm text-dark100_light900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500">
                <option value="">Tất cả tỉnh</option>
                {provinces.map((p: any) => <option key={p._id} value={p._id}>{p.name}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-semibold text-dark100_light900">Mô tả ngắn</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="w-full rounded-lg border border-light-700 dark:border-dark-400 bg-transparent px-4 py-3 text-sm text-dark100_light900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-semibold text-dark100_light900">Nội dung</label>
              <TinyEditor
                value={form.content}
                onChange={(val) => setForm({ ...form, content: val })}
                height={400}
                placeholder="Nội dung landing page..."
              />
            </div>
          </div>
        </div>

        {/* SEO */}
        <div className="overflow-hidden rounded-xl border border-light-700 dark:border-dark-400 background-light900_dark200">
          <div className="border-b border-light-700 dark:border-dark-400 px-5 py-3.5">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-dark400_light700">SEO</p>
          </div>
          <div className="space-y-5 p-5">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-dark100_light900">Meta Title</label>
              <input type="text" value={form.metaTitle} onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
                className="w-full rounded-lg border border-light-700 dark:border-dark-400 bg-transparent px-4 py-2.5 text-sm text-dark100_light900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-dark100_light900">Meta Description</label>
              <textarea value={form.metaDescription} onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
                rows={3}
                className="w-full rounded-lg border border-light-700 dark:border-dark-400 bg-transparent px-4 py-3 text-sm text-dark100_light900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500" />
            </div>
          </div>
        </div>

        {error && <p className="rounded-lg bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-600 dark:text-red-400">{error}</p>}

        <div className="flex justify-end gap-3">
          <Link href="/admin/landing-pages" className="rounded-lg border border-light-700 dark:border-dark-400 px-5 py-2.5 text-sm font-medium text-dark100_light900 transition-colors hover:background-light800_dark300">Cancel</Link>
          <button type="submit" disabled={saving} className="rounded-lg bg-primary-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-50">
            {saving ? "Creating..." : "Tạo Landing Page"}
          </button>
        </div>
      </form>
    </div>
  );
}
