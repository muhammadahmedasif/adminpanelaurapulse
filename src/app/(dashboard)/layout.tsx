import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#0b0f10] text-[#e0e3e4]">
      <Sidebar />
      <main className="flex-1 md:ml-[260px] min-w-0 flex flex-col">
        <Topbar />
        <div className="max-w-[1440px] w-full mx-auto p-4 md:p-6 pt-24 md:pt-28">
          {children}
        </div>
      </main>
    </div>
  );
}
