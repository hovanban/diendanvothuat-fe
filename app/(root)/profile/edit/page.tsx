import { auth } from "@/lib/auth";
import { usersApi } from "@/lib/api-client";
import { redirect } from "next/navigation";
import Profile from "@/components/forms/Profile";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Chỉnh sửa hồ sơ — Diễn đàn Võ thuật" };

export default async function EditProfilePage() {
  const session = await auth();
  const userId = (session?.user as any)?.id;
  const token = (session as any)?.apiToken;

  if (!userId) redirect("/sign-in");

  let mongoUser: any = null;
  try {
    mongoUser = await usersApi.getById(userId) as any;
  } catch {}

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Chỉnh sửa hồ sơ</h1>
      <div className="mt-9">
        <Profile userId={userId} user={mongoUser ? JSON.stringify(mongoUser) : undefined} />
      </div>
    </>
  );
}
