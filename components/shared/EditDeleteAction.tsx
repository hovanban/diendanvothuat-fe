"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { questionsApi, answersApi } from "@/lib/api-client";
import { useSession } from "next-auth/react";

interface Props {
  type: "Question" | "Answer";
  itemId: string;
}

const EditDeleteAction = ({ type, itemId }: Props) => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [showDialog, setShowDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const id = JSON.parse(itemId);
  const token = (session as any)?.apiToken;

  const handleEdit = () => {
    if (type === "Question") router.push(`/question/edit/${id}`);
    else router.push(`/edit-answer/${id}`);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      if (type === "Question") await questionsApi.delete(id, token);
      else await answersApi.delete(id, token);
      setShowDialog(false);
      router.refresh();
    } catch (e) {
      console.error(e);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-end gap-3 max-sm:w-full">
        <Image src="/assets/icons/edit.svg" alt="Edit" width={14} height={14} className="cursor-pointer object-contain hover:opacity-70 transition-opacity" onClick={handleEdit} />
        <Image src="/assets/icons/trash.svg" alt="Delete" width={14} height={14} className="cursor-pointer object-contain hover:opacity-70 transition-opacity" onClick={() => setShowDialog(true)} />
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="background-light900_dark200">
          <DialogHeader>
            <DialogTitle className="text-dark100_light900">Xác nhận xóa</DialogTitle>
            <DialogDescription className="text-dark400_light700">
              Bạn có chắc muốn xóa {type === "Question" ? "câu hỏi" : "câu trả lời"} này? Hành động không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowDialog(false)} disabled={isDeleting} className="border-light-700 dark:border-dark-400">Hủy</Button>
            <Button onClick={handleDelete} disabled={isDeleting} className="bg-red-600 text-white hover:bg-red-700">
              {isDeleting ? "Đang xóa..." : "Xóa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditDeleteAction;
