import Sidebar from "@/components/doctor/Sidebar";

export default function LabLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F8FCFC] flex flex-col md:flex-row overflow-x-hidden">
      <Sidebar />

      <main className="flex-1 p-4 md:p-6 lg:p-8 min-w-0 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}