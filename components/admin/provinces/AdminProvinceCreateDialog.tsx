"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import { adminApi } from "@/lib/api-client";
import { slugify } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminProvinceCreateDialog({ isOpen, onClose }: Props) {
  const router = useRouter();
  const { data: session } = useSession();
  const token = (session as any)?.apiToken;
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: "", slug: "", code: "", order: 0 });

  const handleNameChange = (value: string) => {
    setFormData({ ...formData, name: value, slug: slugify(value) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await adminApi.createProvince(formData, token);
      toast({ title: "Thành công", description: "Đã tạo tỉnh/thành phố mới" });
      onClose();
      setFormData({ name: "", slug: "", code: "", order: 0 });
      router.refresh();
    } catch (error: any) {
      toast({ title: "Lỗi", description: error.message || "Không thể tạo tỉnh/thành phố", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="background-light900_dark200 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-dark100_light900">Thêm Tỉnh/Thành phố mới</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-dark300_light700">Tên Tỉnh/TP</Label>
            <Input value={formData.name} onChange={(e) => handleNameChange(e.target.value)} className="background-light900_dark300 text-dark300_light700" placeholder="VD: Hà Nội" required />
          </div>
          <div>
            <Label className="text-dark300_light700">Slug (tự động)</Label>
            <Input value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className="background-light900_dark300 text-dark300_light700" required />
          </div>
          <div>
            <Label className="text-dark300_light700">Mã tỉnh/TP</Label>
            <Input value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })} className="background-light900_dark300 text-dark300_light700" placeholder="VD: HN, HCM" required />
          </div>
          <div>
            <Label className="text-dark300_light700">Thứ tự hiển thị</Label>
            <Input type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })} className="background-light900_dark300 text-dark300_light700" min="0" required />
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>Hủy</Button>
            <Button type="submit" disabled={isSubmitting} className="primary-gradient text-light-900">{isSubmitting ? "Đang tạo..." : "Tạo mới"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
