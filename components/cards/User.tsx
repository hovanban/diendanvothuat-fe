import Link from "next/link";
import RenderTag from "../shared/RenderTag";
import UserAvatar from "../shared/UserAvatar";
import { usersApi } from "@/lib/api-client";

interface Props {
  user: {
    _id: string;
    picture: string;
    name: string;
    username: string;
  };
}

const User = async ({ user }: Props) => {
  let interactedTags: any[] = [];
  try {
    const res = await usersApi.getTopTags(user._id) as any;
    interactedTags = res || [];
  } catch {
    // silently fail
  }

  return (
    <article className="flex items-center gap-3 border-b border-light-700 dark:border-dark-400 py-4 first:pt-0">
      <Link href={`/profile/${user._id}`} className="shrink-0">
        <UserAvatar picture={user.picture} name={user.name} username={user.username} size={36} />
      </Link>

      <div className="flex-1 min-w-0">
        <Link href={`/profile/${user._id}`} className="group">
          <h3 className="text-[15px] font-semibold text-dark200_light900 group-hover:text-primary-500 transition-colors line-clamp-1">{user.name}</h3>
        </Link>
        <p className="text-xs text-dark400_light700 mt-0.5">@{user.username}</p>
      </div>

      {interactedTags.length > 0 && (
        <div className="flex items-center gap-1.5 shrink-0">
          {interactedTags.slice(0, 2).map((tag: any) => (
            <RenderTag key={tag._id} _id={tag._id} name={tag.name} slug={tag.slug || tag.name} />
          ))}
        </div>
      )}
    </article>
  );
};

export default User;
