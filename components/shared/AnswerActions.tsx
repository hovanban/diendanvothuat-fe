"use client";

import { useState } from "react";
import Image from "next/image";
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
import ParseHTML from "@/components/shared/ParseHTML";
import { answersApi } from "@/lib/api-client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Props {
  answerId: string;
  content: string;
  questionId: string;
  authorId: string;
  isOwner: boolean;
  currentUserId: string;
  isUserBlocked?: boolean;
}

const AnswerActions = ({ answerId, content, questionId, authorId, isOwner, currentUserId, isUserBlocked = false }: Props) => {
  const router = useRouter();
  const { data: session } = useSession();
  const token = (session as any)?.apiToken;

  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isReplySubmitting, setIsReplySubmitting] = useState(false);

  const handleSaveEdit = async () => {
    if (!token) return;
    setIsSubmitting(true);
    try {
      await answersApi.edit(answerId, { content: editContent }, token);
      setIsEditing(false);
      router.refresh();
    } catch {}
    finally { setIsSubmitting(false); }
  };

  const handleDeleteConfirm = async () => {
    if (!token) return;
    setIsDeleting(true);
    try {
      await answersApi.delete(answerId, token);
      setShowDeleteDialog(false);
      router.refresh();
    } catch {}
    finally { setIsDeleting(false); }
  };

  const handleSubmitReply = async () => {
    if (!replyContent.trim() || !currentUserId || !token) return;
    setIsReplySubmitting(true);
    try {
      await answersApi.create({ content: replyContent, questionId, parentAnswerId: answerId }, token);
      setIsReplying(false);
      setReplyContent("");
      router.refresh();
    } catch {}
    finally { setIsReplySubmitting(false); }
  };

  return (
    <>
      {isEditing ? (
        <div className="space-y-3">
          <Textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[150px] border"
            placeholder="Chỉnh sửa câu trả lời..."
          />
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isSubmitting} className="border-light-700 dark:border-dark-400">Hủy</Button>
            <Button onClick={handleSaveEdit} disabled={isSubmitting} className="primary-gradient text-white">
              {isSubmitting ? "Đang lưu..." : "Lưu"}
            </Button>
          </div>
        </div>
      ) : (
        <>
          <ParseHTML data={content} />
          <div className="flex items-center gap-3 mt-2">
            {currentUserId && !isUserBlocked && (
              <button
                onClick={() => setIsReplying(true)}
                className="text-dark400_light700 small-regular flex items-center gap-1 hover:text-primary-500 transition-colors"
              >
                <Image src="/assets/icons/message.svg" alt="Reply" width={14} height={14} className="object-contain" />
                <span>Trả lời</span>
              </button>
            )}
            {currentUserId && isUserBlocked && (
              <span className="text-red-500 text-xs">🚫 Bạn không thể trả lời (tài khoản bị chặn)</span>
            )}
            {isOwner && (
              <div className="flex items-center gap-3 ml-auto">
                <Image src="/assets/icons/edit.svg" alt="Edit" width={14} height={14} className="cursor-pointer object-contain hover:opacity-70" onClick={() => { setIsEditing(true); setEditContent(content); }} />
                <Image src="/assets/icons/trash.svg" alt="Delete" width={14} height={14} className="cursor-pointer object-contain hover:opacity-70" onClick={() => setShowDeleteDialog(true)} />
              </div>
            )}
          </div>
        </>
      )}

      {isReplying && (
        <div className="mt-3 space-y-3 pl-6 border-l-2 border-light-700 dark:border-dark-400">
          <Textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[100px] border"
            placeholder="Viết câu trả lời..."
          />
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setIsReplying(false)} disabled={isReplySubmitting} className="border-light-700 dark:border-dark-400">Hủy</Button>
            <Button onClick={handleSubmitReply} disabled={isReplySubmitting || !replyContent.trim()} className="primary-gradient text-white">
              {isReplySubmitting ? "Đang gửi..." : "Gửi"}
            </Button>
          </div>
        </div>
      )}

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="background-light900_dark200">
          <DialogHeader>
            <DialogTitle className="text-dark100_light900">Xác nhận xóa</DialogTitle>
            <DialogDescription className="text-dark400_light700">
              Bạn có chắc chắn muốn xóa câu trả lời này không? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)} disabled={isDeleting} className="border-light-700 dark:border-dark-400">Hủy</Button>
            <Button onClick={handleDeleteConfirm} disabled={isDeleting} className="bg-red-600 text-white hover:bg-red-700">
              {isDeleting ? "Đang xóa..." : "Xóa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AnswerActions;
