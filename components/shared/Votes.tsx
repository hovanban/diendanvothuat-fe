"use client";

import { toast } from "@/components/ui/use-toast";
import { questionsApi, answersApi, usersApi } from "@/lib/api-client";
import { getFormattedNumber } from "@/lib/utils";
import { useSignIn } from "@/components/providers/SignInProvider";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Props {
  type: string;
  itemId: string;
  userId?: string;
  upvotes: number;
  hasupVoted: boolean;
  downvotes: number;
  hasdownVoted: boolean;
  hasSaved?: boolean;
}

const Votes = ({ type, itemId, userId, upvotes, hasupVoted, downvotes, hasdownVoted, hasSaved }: Props) => {
  const router = useRouter();
  const { openSignIn } = useSignIn();
  const { data: session } = useSession();
  const token = (session as any)?.apiToken;

  const handleSave = async () => {
    if (!userId || !token) { openSignIn(); return; }
    try {
      await usersApi.saveQuestion(JSON.parse(itemId), token);
      toast({
        title: `Câu hỏi ${!hasSaved ? "đã được lưu" : "đã xóa khỏi danh sách yêu thích"} 🎉`,
        variant: !hasSaved ? "default" : "destructive",
      });
      router.refresh();
    } catch {}
  };

  const handleVote = async (action: string) => {
    if (!userId || !token) { openSignIn(); return; }
    try {
      const id = JSON.parse(itemId);
      if (type === "Question") {
        await questionsApi.vote(id, action, token);
      } else {
        await answersApi.vote(id, action, token);
      }
      toast({
        title: `${action === "upvote" ? "Upvote" : "Downvote"} ${action === "upvote" ? (!hasupVoted ? "added" : "removed") : (!hasdownVoted ? "added" : "removed")} 🎉`,
        variant: action === "upvote" ? (!hasupVoted ? "default" : "destructive") : (!hasdownVoted ? "default" : "destructive"),
      });
      router.refresh();
    } catch {}
  };

  return (
    <div className="flex gap-4">
      <div className="flex-center gap-2.5">
        <div className="flex-center gap-1.5">
          <Image
            src={hasupVoted ? "/assets/icons/upvoted.svg" : "/assets/icons/upvote.svg"}
            width={18}
            height={18}
            alt="upvote"
            className="cursor-pointer"
            onClick={() => handleVote("upvote")}
          />
          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">{getFormattedNumber(upvotes)}</p>
          </div>
        </div>

        <div className="flex-center gap-1.5">
          <Image
            src={hasdownVoted ? "/assets/icons/downvoted.svg" : "/assets/icons/downvote.svg"}
            width={18}
            height={18}
            alt="downvote"
            className="cursor-pointer"
            onClick={() => handleVote("downvote")}
          />
          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">{getFormattedNumber(downvotes)}</p>
          </div>
        </div>
      </div>

      {type === "Question" && (
        <Image
          src={hasSaved ? "/assets/icons/star-filled.svg" : "/assets/icons/star-red.svg"}
          width={18}
          height={18}
          alt="star"
          className="cursor-pointer"
          onClick={handleSave}
        />
      )}
    </div>
  );
};

export default Votes;
