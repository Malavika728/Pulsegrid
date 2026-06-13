"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PulseGridLogo from "@/components/common/PulseGridLogo";
import {
  LayoutDashboard,
  Users,
  Activity,
  Settings,
  LogOut,
  Stethoscope,
  ShieldCheck,
  Heart,
} from "lucide-react";

type MenuItem = {
  title: string;
  href: string;
  icon: any;
};

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{
    role: string;
    name: string;
    email: string;
    hospitalName?: string;
  } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("pulsegrid_user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const names: Record<string, string> = {
          Doctor: "Dr. Sarah Johnson",
          Nurse: "Nancy Wheeler",
          Patient: "Arjun Sharma",
          "Lab Tech": "Ravi Thomas",
          "Hospital Admin": "Jordan Lee",
        };
        const hasInvalidName =
          !parsed.name ||
          parsed.name === "DR" ||
          parsed.name === "Dr" ||
          parsed.name === "Dr." ||
          parsed.name === "User" ||
          parsed.name === parsed.role;

        if (hasInvalidName) {
          parsed.name = names[parsed.role] || "User";
          localStorage.setItem("pulsegrid_user", JSON.stringify(parsed));
        }
        setUser(parsed);
      } catch {}
    } else {
      // Set default demo doctor if none is logged in
      setUser({
        role: "Doctor",
        name: "Dr. Sarah Johnson",
        email: "doctor@pulsegrid.health",
        hospitalName: "City General Hospital",
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("pulsegrid_user");
    router.push("/auth/login");
  };

  const getMenu = (): MenuItem[] => {
    if (!user) return [];

    switch (user.role) {
      case "Doctor":
        return [
          { title: "Dashboard", href: "/dashboard/doctor", icon: LayoutDashboard },
          { title: "Patients", href: "/dashboard/doctor/patients", icon: Users },
          { title: "Settings", href: "/dashboard/doctor/settings", icon: Settings },
        ];
      case "Nurse":
        return [
          { title: "Dashboard", href: "/dashboard/nurse", icon: LayoutDashboard },
          { title: "Patients Registry", href: "/dashboard/nurse/patients", icon: Users },
          { title: "Settings", href: "/dashboard/doctor/settings", icon: Settings }, // Reuse doctor settings page
        ];
      case "Patient":
        return [
          { title: "Dashboard", href: "/dashboard/patient", icon: LayoutDashboard },
          { title: "Live Telemetry", href: "/dashboard/patient/live-monitoring", icon: Heart },
          { title: "Settings", href: "/dashboard/patient/settings", icon: Settings },
        ];
      case "Lab Tech":
        return [
          { title: "Dashboard", href: "/dashboard/lab", icon: LayoutDashboard },
          { title: "Patients Queue", href: "/dashboard/lab/patients", icon: Users },
          { title: "Settings", href: "/dashboard/lab/settings", icon: Settings },
        ];
      case "Hospital Admin":
        return [
          { title: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
          { title: "Patients", href: "/dashboard/admin/patients", icon: Users },
          { title: "Doctors", href: "/dashboard/admin/doctors", icon: Stethoscope },
          { title: "Nurses", href: "/dashboard/admin/nurses", icon: Activity },
          { title: "Settings", href: "/dashboard/admin/settings", icon: Settings },
        ];
      default:
        return [
          { title: "Dashboard", href: "/dashboard/doctor", icon: LayoutDashboard },
        ];
    }
  };

  const menu = getMenu();

  // Determine displays based on role
  const getAvatarInitials = () => {
    if (!user?.name) return "DR";
    const parts = user.name.split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return user.name.slice(0, 2).toUpperCase();
  };

  return (
    <aside className="w-[280px] bg-white border-r border-slate-200 h-screen sticky top-0 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-slate-100">
        <PulseGridLogo size="sm" />
        {user?.hospitalName && (
          <p className="text-[10px] text-teal-600 mt-1 uppercase font-semibold tracking-wider">
            {user.hospitalName}
          </p>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menu.map((item) => {
          const Icon = item.icon;
          const isDashboard = item.title === "Dashboard";
          const isActive = isDashboard ? pathname === item.href : pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link key={item.title} href={item.href}>
              <div
                className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 mb-2 ${
                  isActive
                    ? "bg-teal-50 text-teal-700 shadow-sm font-semibold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon size={20} className={isActive ? "text-teal-600" : "text-slate-400"} />
                <span className="font-medium text-sm">{item.title}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Profile & Logout */}
      <div className="p-4 border-t border-slate-100 space-y-3">
        {user && (
          <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
              {getAvatarInitials()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-900 text-xs truncate">
                {user.name}
              </p>
              <p className="text-[10px] text-slate-500 truncate">
                {user.role}
              </p>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 rounded-xl text-slate-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all duration-300 text-sm font-medium"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}