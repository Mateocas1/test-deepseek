import DashboardSidebar from "@/components/dashboard/sidebar";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen pt-16 flex">
      <DashboardSidebar />
      <main className="flex-1 p-6 ml-64">{children}</main>
    </div>
  );
}
