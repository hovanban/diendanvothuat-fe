"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ParseHTML from "@/components/shared/ParseHTML";
import { getTimestamp } from "@/lib/utils";
import { answersApi } from "@/lib/api-client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Props {
  answerId: string;
  currentUserId: string | null;
  initialReplies?: any[];
}

const ReplyList = ({ answerId, currentUserId, initialReplies = [] }: Props) => {
  const router = useRouter();
  const { data: session } = useSession();
  const token = (session as any)?.apiToken;

  const [replies, setReplies] = useState<any[]>(initialReplies);
  const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingReplyId, setDeletingReplyId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => { setReplies(initialReplies); }, [initialReplies]);

  const handleSaveEdit = async (replyId: string) => {
    if (!token) return;
    setIsSubmitting(true);
    try {
      await answersApi.edit(replyId, { content: editContent }, token);
      setReplies(replies.map(r => r._id.toString() === replyId ? { ...r, content: editContent } : r));
      setEditingReplyId(null);
    } catch {}
    finally { setIsSubmitting(false); }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingReplyId || !token) return;
    setIsDeleting(true);
    try {
      await answersApi.delete(deletingReplyId, token);
      setReplies(replies.filter(r => r._id.toString() !== deletingReplyId));
      setShowDeleteDialog(false);
      setDeletingReplyId(null);
    } catch {}
    finally { setIsDeleting(false); }
  };

  if (replies.length === 0) return null;

  return (
    <div className="mt-3 space-y-3 pl-3 border-l-2 border-light-700 dark:border-dark-400">
      {replies.map((reply: any) => {
        if (!reply.author) return null;
        const isOwner = currentUserId ? currentUserId === reply.author._id.toString() : false;
        const isEditing = editingReplyId === reply._id.toString();

        return (
          <div key={reply._id} className="pb-3 border-b border-light-700 dark:border-dark-400 last:border-0">
            <Link href={`/profile/${reply.author._id}`} className="flex items-center gap-1 mb-2">
              {reply.author.picture?.startsWith("http") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={reply.author.picture} alt="profile" className="rounded-full object-cover" style={{ width: "16px", height: "16px" }} />
              ) : (
                <Image src={reply.author.picture || "/assets/icons/avatar.svg"} width={16} height={16} alt="profile" className="rounded-full object-cover" style={{ width: "16px", height: "16px" }} />
              )}
              <p className="small-semibold text-dark300_light700">{reply.author.name}</p>
              <p className="tiny-regular text-light400_light500">• {getTimestamp(reply.createdAt)}</p>
            </Link>

            {isEditing ? (
              <div className="space-y-2">
                <Textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[80px] border" />
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setEditingReplyId(null)} disabled={isSubmitting} className="border-light-700 dark:border-dark-400 h-8 text-xs" size="sm">Hủy</Button>
                  <Button onClick={() => handleSaveEdit(reply._id.toString())} disabled={isSubmitting} className="primary-gradient text-white h-8 text-xs" size="sm">
                    {isSubmitting ? "Đang lưu..." : "Lưu"}
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="text-dark300_light700 small-regular"><ParseHTML data={reply.content} /></div>
                {isOwner && (
                  <div className="flex items-center gap-2 mt-2">
                    <Image src="/assets/icons/edit.svg" alt="Edit" width={12} height={12} className="cursor-pointer object-contain hover:opacity-70" onClick={() => { setEditingReplyId(reply._id.toString()); setEditContent(reply.content); }} />
                    <Image src="/assets/icons/trash.svg" alt="Delete" width={12} height={12} className="cursor-pointer object-contain hover:opacity-70" onClick={() => { setDeletingReplyId(reply._id.toString()); setShowDeleteDialog(true); }} />
                  </div>
                )}
              </>
            )}
          </div>
        );
      })}

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="background-light900_dark200">
          <DialogHeader>
            <DialogTitle className="text-dark100_light900">Xác nhận xóa</DialogTitle>
            <DialogDescription className="text-dark400_light700">Bạn có chắc chắn muốn xóa câu trả lời này không?</DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)} disabled={isDeleting} className="border-light-700 dark:border-dark-400">Hủy</Button>
            <Button onClick={handleDeleteConfirm} disabled={isDeleting} className="bg-red-600 text-white hover:bg-red-700">
              {isDeleting ? "Đang xóa..." : "Xóa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReplyList;
