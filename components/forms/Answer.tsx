"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { answersApi } from "@/lib/api-client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  type?: string;
  question: string;
  questionId: string;
  authorId: string;
}

const Answer = ({ type, question, questionId, authorId }: Props) => {
  const router = useRouter();
  const { data: session } = useSession();
  const token = (session as any)?.apiToken;
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim().length < 10) {
      toast({ title: "Câu trả lời phải có ít nhất 10 ký tự", variant: "destructive" });
      return;
    }
    if (!token) return;

    setIsSubmitting(true);
    try {
      await answersApi.create({ content, questionId }, token);
      setContent("");
      toast({ title: "Câu trả lời đã được gửi 🎉" });
      router.refresh();
    } catch {
      toast({ title: "Có lỗi xảy ra khi gửi câu trả lời", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-8">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
        <h4 className="paragraph-semibold text-dark400_light800">Viết câu trả lời</h4>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex w-full flex-col gap-10">
        <div className="flex flex-col gap-3">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Viết câu trả lời của bạn ở đây... (tối thiểu 10 ký tự)"
            className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[200px] border"
          />
          <p className="text-sm text-dark400_light700">{content.length} ký tự</p>
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting} className="primary-gradient w-fit text-white disabled:opacity-50">
            {isSubmitting ? "Đang gửi..." : "Gửi câu trả lời"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Answer;
