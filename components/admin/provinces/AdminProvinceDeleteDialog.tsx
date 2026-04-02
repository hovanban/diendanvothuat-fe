"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import { adminApi } from "@/lib/api-client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Props {
  provinceId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminProvinceDeleteDialog({ provinceId, isOpen, onClose }: Props) {
  const router = useRouter();
  const { data: session } = useSession();
  const token = (session as any)?.apiToken;
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await adminApi.deleteProvince(provinceId, token);
      toast({ title: "Thành công", description: "Đã xóa tỉnh/thành phố" });
      onClose();
      router.refresh();
    } catch (error: any) {
      toast({ title: "Lỗi", description: error.message || "Không thể xóa tỉnh/thành phố", variant: "destructive" });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="background-light900_dark200">
        <DialogHeader>
          <DialogTitle className="text-dark100_light900">Xác nhận xóa</DialogTitle>
          <DialogDescription className="text-dark300_light700">
            Bạn có chắc chắn muốn xóa tỉnh/thành phố này? Hành động này không thể hoàn tác.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-3 mt-4">
          <Button type="button" variant="outline" onClick={onClose}>Hủy</Button>
          <Button type="button" variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Đang xóa..." : "Xóa"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
