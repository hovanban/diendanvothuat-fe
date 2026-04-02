import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Question from "@/components/forms/Question";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Đăng bài — Diễn đàn Võ thuật" };

interface Props {
  searchParams: { martialArt?: string };
}

export default async function AskQuestionPage({ searchParams }: Props) {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");

  const userId = (session.user as any).id;

  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Đăng bài</h1>
      <div className="mt-3">
        <Question mongoUserId={JSON.stringify(userId)} preselectedMartialArt={searchParams.martialArt} />
      </div>
    </div>
  );
}
