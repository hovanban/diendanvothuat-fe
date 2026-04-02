export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen w-full items-center justify-center background-light850_dark100">
      {children}
    </main>
  );
}
