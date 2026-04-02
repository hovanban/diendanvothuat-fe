"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { adminApi } from "@/lib/api-client";
import TinyEditor from "@/components/shared/TinyEditor";
import Link from "next/link";

export default function AdminEditClubPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const token = (session as any)?.apiToken;
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [club, setClub] = useState<any>(null);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [martialArts, setMartialArts] = useState<any[]>([]);
  const [form, setForm] = useState<any>({
    name: "", address: "", phone: "", description: "",
    provinceId: "", martialArtId: "",
    isApproved: false, isHidden: false,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) return;
    Promise.all([
      adminApi.getClub(id, token),
      adminApi.getProvinces(token),
      adminApi.getMartialArts(token),
    ]).then(([c, pvRes, maRes]: any) => {
      setClub(c);
      setForm({
        name: c.name || "",
        address: c.address || "",
        phone: c.phone || "",
        description: c.description || "",
        provinceId: c.province?._id || "",
        martialArtId: c.martialArt?._id || "",
        isApproved: c.isApproved || false,
        isHidden: c.isHidden || false,
      });
      setProvinces(Array.isArray(pvRes) ? pvRes : (pvRes?.provinces || []));
      setMartialArts(maRes?.martialArts || maRes || []);
    }).catch(() => setError("Không thể tải dữ liệu CLB"))
      .finally(() => setLoading(false));
  }, [id, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await adminApi.updateClub(id, {
        name: form.name,
        address: form.address,
        phone: form.phone,
        description: form.description,
        province: form.provinceId || undefined,
        martialArt: form.martialArtId || undefined,
        isApproved: form.isApproved,
        isHidden: form.isHidden,
      }, token);
      setSuccess(true);
      setTimeout(() => router.push("/admin/clubs"), 1000);
    } catch (err: any) {
      setError(err.message || "Không thể lưu CLB");
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

  if (error && !club) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-base font-semibold text-dark100_light900">{error}</p>
        <Link href="/admin/clubs" className="mt-4 text-sm text-primary-500 hover:underline">← Back to Clubs</Link>
      </div>
    );
  }

  const field = (label: string, key: string, type = "text") => (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-dark100_light900">{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        className="w-full rounded-lg border border-light-700 dark:border-dark-400 bg-transparent px-4 py-2.5 text-sm text-dark100_light900 placeholder:text-dark400_light700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
      />
    </div>
  );

  const toggle = (label: string, key: string, color: string) => (
    <label className="flex items-center gap-3 cursor-pointer">
      <div
        onClick={() => setForm({ ...form, [key]: !form[key] })}
        className={`relative h-6 w-11 rounded-full transition-colors ${form[key] ? color : "bg-light-700 dark:bg-dark-400"}`}
      >
        <span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${form[key] ? "translate-x-6" : "translate-x-1"}`} />
      </div>
      <span className="text-sm font-medium text-dark100_light900">{label}</span>
    </label>
  );

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
          <h1 className="mt-0.5 text-2xl font-bold text-dark100_light900">Edit Club</h1>
          {club && <p className="mt-1 text-sm text-dark400_light700">{club.name}</p>}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="overflow-hidden rounded-xl border border-light-700 dark:border-dark-400 background-light900_dark200">
          <div className="border-b border-light-700 dark:border-dark-400 px-5 py-3.5">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-dark400_light700">Club Info</p>
          </div>
          <div className="grid gap-5 p-5 sm:grid-cols-2">
            <div className="sm:col-span-2">{field("Tên CLB", "name")}</div>
            {field("Địa chỉ", "address")}
            {field("Số điện thoại", "phone", "tel")}
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

        <div className="overflow-hidden rounded-xl border border-light-700 dark:border-dark-400 background-light900_dark200">
          <div className="border-b border-light-700 dark:border-dark-400 px-5 py-3.5">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-dark400_light700">Status</p>
          </div>
          <div className="flex flex-wrap gap-6 p-5">
            {toggle("Đã duyệt", "isApproved", "bg-green-500")}
            {toggle("Đang ẩn", "isHidden", "bg-red-500")}
          </div>
        </div>

        {error && <p className="rounded-lg bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-600 dark:text-red-400">{error}</p>}
        {success && <p className="rounded-lg bg-green-50 dark:bg-green-900/20 px-4 py-3 text-sm text-green-600 dark:text-green-400">Đã lưu thành công!</p>}

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
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
