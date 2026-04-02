"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { adminApi } from "@/lib/api-client";
import TinyEditor from "@/components/shared/TinyEditor";
import Link from "next/link";

export default function AdminCreateClubPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const token = (session as any)?.apiToken;

  const [saving, setSaving] = useState(false);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [martialArts, setMartialArts] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: "", address: "", phone: "", description: "",
    provinceId: "", martialArtId: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    Promise.all([
      adminApi.getProvinces(token),
      adminApi.getMartialArts(token),
    ]).then(([pvRes, maRes]: any) => {
      setProvinces(Array.isArray(pvRes) ? pvRes : (pvRes?.provinces || []));
      setMartialArts(maRes?.martialArts || maRes || []);
    }).catch(() => {});
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
      const res = await fetch(`${API_BASE}/clubs`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          name: form.name,
          address: form.address,
          phone: form.phone,
          description: form.description,
          province: form.provinceId || undefined,
          martialArt: form.martialArtId || undefined,
          isApproved: true,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `HTTP ${res.status}`);
      }
      router.push("/admin/clubs");
    } catch (err: any) {
      setError(err.message || "Không thể tạo CLB");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin/clubs"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-light-700 dark:border-dark-400 text-dark400_light700 transition-colors hover:background-light800_dark300"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div className="border-l-4 border-l-orange-500 pl-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-dark400_light700">Admin / Clubs</p>
          <h1 className="mt-0.5 text-2xl font-bold text-dark100_light900">Tạo CLB mới</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="overflow-hidden rounded-xl border border-light-700 dark:border-dark-400 background-light900_dark200">
          <div className="border-b border-light-700 dark:border-dark-400 px-5 py-3.5">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-dark400_light700">Club Info</p>
          </div>
          <div className="grid gap-5 p-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-semibold text-dark100_light900">Tên CLB <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-lg border border-light-700 dark:border-dark-400 bg-transparent px-4 py-2.5 text-sm text-dark100_light900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-dark100_light900">Địa chỉ</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full rounded-lg border border-light-700 dark:border-dark-400 bg-transparent px-4 py-2.5 text-sm text-dark100_light900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-dark100_light900">Số điện thoại</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full rounded-lg border border-light-700 dark:border-dark-400 bg-transparent px-4 py-2.5 text-sm text-dark100_light900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-dark100_light900">Tỉnh/Thành phố</label>
              <select
                value={form.provinceId}
                onChange={(e) => setForm({ ...form, provinceId: e.target.value })}
                className="w-full rounded-lg border border-light-700 dark:border-dark-400 bg-transparent px-4 py-2.5 text-sm text-dark100_light900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="">Chọn tỉnh</option>
                {provinces.map((p: any) => (
                  <option key={p._id} value={p._id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-dark100_light900">Môn võ</label>
              <select
                value={form.martialArtId}
                onChange={(e) => setForm({ ...form, martialArtId: e.target.value })}
                className="w-full rounded-lg border border-light-700 dark:border-dark-400 bg-transparent px-4 py-2.5 text-sm text-dark100_light900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="">Chọn môn võ</option>
                {martialArts.map((ma: any) => (
                  <option key={ma._id} value={ma._id}>{ma.name}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-semibold text-dark100_light900">Mô tả</label>
              <TinyEditor
                value={form.description}
                onChange={(val) => setForm({ ...form, description: val })}
                height={300}
                placeholder="Mô tả câu lạc bộ..."
              />
            </div>
          </div>
        </div>

        {error && <p className="rounded-lg bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-600 dark:text-red-400">{error}</p>}

        <div className="flex justify-end gap-3">
          <Link
            href="/admin/clubs"
            className="rounded-lg border border-light-700 dark:border-dark-400 px-5 py-2.5 text-sm font-medium text-dark100_light900 transition-colors hover:background-light800_dark300"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-primary-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Creating..." : "Tạo CLB"}
          </button>
        </div>
      </form>
    </div>
  );
}
