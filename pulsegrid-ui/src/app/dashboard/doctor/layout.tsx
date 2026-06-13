import Sidebar from "@/components/doctor/Sidebar";

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex bg-[#F8FCFC] min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
