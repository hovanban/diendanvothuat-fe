"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { usersApi } from "@/lib/api-client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  userId: string;
  user?: string;
}

const Profile = ({ userId, user }: Props) => {
  const router = useRouter();
  const { data: session } = useSession();
  const token = (session as any)?.apiToken;
  const parsedUser = user ? JSON.parse(user) : null;

  const [name, setName] = useState(parsedUser?.name || "");
  const [username, setUsername] = useState(parsedUser?.username || "");
  const [portfolioWebsite, setPortfolioWebsite] = useState(parsedUser?.portfolioWebsite || "");
  const [location, setLocation] = useState(parsedUser?.location || "");
  const [bio, setBio] = useState(parsedUser?.bio || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !username.trim()) {
      toast({ title: "Tên và username không được để trống", variant: "destructive" });
      return;
    }
    if (!token) return;

    setIsSubmitting(true);
    try {
      await usersApi.updateProfile({ name, username, portfolioWebsite, location, bio }, token);
      toast({ title: "Cập nhật hồ sơ thành công" });
      router.push(`/profile/${userId}`);
    } catch {
      toast({ title: "Có lỗi xảy ra khi cập nhật hồ sơ", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-9 flex w-full flex-col gap-9">
      <div className="space-y-3.5">
        <label className="paragraph-semibold text-dark400_light800">Tên <span className="text-primary-500">*</span></label>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tên của bạn" className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[40px] border" />
      </div>

      <div className="space-y-3.5">
        <label className="paragraph-semibold text-dark400_light800">Username <span className="text-primary-500">*</span></label>
        <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username của bạn" className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[40px] border" />
      </div>

      <div className="space-y-3.5">
        <label className="paragraph-semibold text-dark400_light800">Portfolio Link</label>
        <Input type="url" value={portfolioWebsite} onChange={(e) => setPortfolioWebsite(e.target.value)} placeholder="https://..." className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[40px] border" />
      </div>

      <div className="space-y-3.5">
        <label className="paragraph-semibold text-dark400_light800">Địa điểm</label>
        <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Thành phố, Quốc gia" className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[40px] border" />
      </div>

      <div className="space-y-3.5">
        <label className="paragraph-semibold text-dark400_light800">Giới thiệu</label>
        <Textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Giới thiệu về bản thân..." className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[100px] border" />
      </div>

      <div className="mt-7 flex justify-end">
        <Button type="submit" disabled={isSubmitting} className="primary-gradient w-fit !text-light-900 disabled:opacity-50">
          {isSubmitting ? "Đang lưu..." : "Lưu"}
        </Button>
      </div>
    </form>
  );
};

export default Profile;
