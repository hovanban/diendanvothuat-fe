import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function requireAdmin() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/");
  }

  if (session.user.role !== "admin") {
    redirect("/");
  }

  return session;
}

export async function isAdmin() {
  const session = await auth();
  return session?.user?.role === "admin";
}
