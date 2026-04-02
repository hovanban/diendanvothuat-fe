"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import { adminApi } from "@/lib/api-client";
import { slugify } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Province {
  _id: string;
  name: string;
  slug: string;
  code: string;
  order: number;
}

interface Props {
  province: Province;
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminProvinceEditDialog({ province, isOpen, onClose }: Props) {
  const router = useRouter();
  const { data: session } = useSession();
  const token = (session as any)?.apiToken;
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: province.name, slug: province.slug, code: province.code, order: province.order });

  useEffect(() => {
    setFormData({ name: province.name, slug: province.slug, code: province.code, order: province.order });
  }, [province]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await adminApi.updateProvince(province._id, formData, token);
      toast({ title: "Thành công", description: "Đã cập nhật tỉnh/thành phố" });
      onClose();
      router.refresh();
    } catch (error: any) {
      toast({ title: "Lỗi", description: error.message || "Không thể cập nhật", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="background-light900_dark200 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-dark100_light900">Sửa Tỉnh/Thành phố</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-dark300_light700">Tên Tỉnh/TP</Label>
            <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: slugify(e.target.value) })} className="background-light900_dark300 text-dark300_light700" required />
          </div>
          <div>
            <Label className="text-dark300_light700">Slug</Label>
            <Input value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className="background-light900_dark300 text-dark300_light700" required />
          </div>
          <div>
            <Label className="text-dark300_light700">Mã tỉnh/TP</Label>
            <Input value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })} className="background-light900_dark300 text-dark300_light700" required />
          </div>
          <div>
            <Label className="text-dark300_light700">Thứ tự hiển thị</Label>
            <Input type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })} className="background-light900_dark300 text-dark300_light700" required />
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>Hủy</Button>
            <Button type="submit" disabled={isSubmitting} className="primary-gradient text-light-900">{isSubmitting ? "Đang cập nhật..." : "Cập nhật"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
