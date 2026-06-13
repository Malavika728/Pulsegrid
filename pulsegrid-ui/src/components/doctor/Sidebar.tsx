"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import PulseGridLogo from "@/components/common/PulseGridLogo";

import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  Stethoscope,
  HeartPulse,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState({ name: "Dr. Sarah Johnson", role: "Cardiologist", path: "doctor" });
  const [menu, setMenu] = useState<any[]>([]);

  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem("pulsegrid_user") || "{}");
    const role = localUser.role || "Doctor";
    const name = localUser.name || "Dr. Sarah Johnson";
    const path = role === "Lab Tech" ? "lab" : role === "Hospital Admin" ? "admin" : role === "Nurse" ? "nurse" : role === "Patient" ? "patient" : "doctor";
    
    setUser({
      name,
      role: role === "Lab Tech" ? "Lab Technician" : role,
      path
    });

    if (role === "Hospital Admin") {
      setMenu([
        { title: "Dashboard", href: `/dashboard/admin`, icon: LayoutDashboard },
        { title: "Patients", href: `/dashboard/admin/patients`, icon: Users },
        { title: "Doctors", href: `/dashboard/admin/doctors`, icon: Stethoscope },
        { title: "Nurses", href: `/dashboard/admin/nurses`, icon: HeartPulse },
        { title: "Settings", href: `/dashboard/admin/settings`, icon: Settings },
      ]);
    } else if (role === "Patient") {
      setMenu([
        { title: "Dashboard", href: `/dashboard/patient`, icon: LayoutDashboard },
        { title: "Live Monitoring", href: `/dashboard/patient/live-monitoring`, icon: HeartPulse },
        { title: "Settings", href: `/dashboard/patient/settings`, icon: Settings },
      ]);
    } else {
      setMenu([
        { title: "Dashboard", href: `/dashboard/${path}`, icon: LayoutDashboard },
        { title: "Patients", href: `/dashboard/${path}/patients`, icon: Users },
        { title: "Settings", href: `/dashboard/${path}/settings`, icon: Settings },
      ]);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("pulsegrid_user");
    window.location.href = "/auth/login";
  };

  return (
    <aside
      className="
      w-[280px]
      bg-white
      border-r
      border-slate-200
      h-screen
      sticky
      top-0
      flex
      flex-col
      "
    >
      {/* Logo */}

      <div className="p-6 border-b border-slate-100">
        <PulseGridLogo size="sm" />
      </div>

      {/* Navigation */}

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">

        {menu.map((item) => {
          const Icon = item.icon;

          const isActive =
            pathname === item.href;

          return (
            <Link
              key={item.title}
              href={item.href}
            >
              <div
                className={`
                flex
                items-center
                gap-3
                px-4
                py-3
                rounded-xl
                cursor-pointer
                transition-all
                duration-300
                mb-2

                ${
                  isActive
                    ? "bg-teal-50 text-teal-700 shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }
                `}
              >
                <Icon size={20} />

                <span className="font-medium">
                  {item.title}
                </span>
              </div>
            </Link>
          );
        })}

      </nav>

      {/* Doctor Profile */}

      <div className="p-4 border-t border-slate-100">

        <Link
          href={`/dashboard/${user.path}/profile`}
          className="
          bg-slate-50
          rounded-2xl
          p-4
          flex
          items-center
          gap-3
          transition
          hover:bg-teal-50
          hover:border
          hover:border-teal-100
          "
        >
          <div
            className="
            w-12
            h-12
            rounded-full
            bg-gradient-to-r
            from-teal-500
            to-cyan-500
            "
          />

          <div>

            <p className="font-semibold text-slate-900 truncate max-w-[140px]">
              {user.name}
            </p>

            <p className="text-xs text-slate-500">
              {user.role}
            </p>
            <p className="text-[11px] text-teal-600">Edit profile</p>

          </div>

        </Link>

      </div>

      {/* Logout Button */}
      <div className="p-4 border-t border-slate-100">
        <button
          onClick={handleLogout}
          type="button"
          className="
          w-full
          flex
          items-center
          justify-center
          gap-2
          px-4
          py-3
          rounded-xl
          bg-rose-50
          hover:bg-rose-100
          text-rose-600
          hover:text-rose-700
          font-semibold
          transition-all
          duration-300
          cursor-pointer
          shadow-sm
          hover:scale-[1.02]
          active:scale-[0.98]
          "
        >
          <LogOut size={18} />
          <span>Log Out</span>
        </button>
      </div>

    </aside>
  );
}