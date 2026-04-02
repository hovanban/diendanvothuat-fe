import { requireAdmin } from "@/lib/admin";
import { auth } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  const session = await auth();

  return (
    <div className="flex min-h-screen background-light850_dark100">
      <AdminSidebar session={session} />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
