"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, UserRound, Stethoscope, HeartPulse, Plus } from "lucide-react";

export default function AdminDashboardPage() {
  const [user, setUser] = useState({ name: "Admin User", hospitalCode: "CITYHOSP01" });

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("pulsegrid_user") || "{}");
    if (u.name) setUser({ name: u.name, hospitalCode: u.hospitalCode || "CITYHOSP01" });
  }, []);

  return (
    <main className="space-y-6 animate-fade-in">
      <section className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
        <p className="text-sm uppercase tracking-[0.35em] text-teal-600">Hospital Administration</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Welcome, {user.name}</h1>
        <p className="mt-3 text-slate-500">Manage patients, doctors, and nurses for your hospital. Add members and generate credentials.</p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <span className="rounded-full bg-teal-50 px-3 py-1 text-teal-700 font-medium">Hospital ID: {user.hospitalCode}</span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">City General Hospital</span>
        </div>
      </section>

      <section className="grid gap-5 sm:grid-cols-3">
        {[
          { label: "Patients", href: "/dashboard/admin/patients", icon: Users, color: "text-teal-600", bg: "bg-teal-50", desc: "Add and manage patients" },
          { label: "Doctors", href: "/dashboard/admin/doctors", icon: Stethoscope, color: "text-violet-600", bg: "bg-violet-50", desc: "Manage doctor accounts" },
          { label: "Nurses", href: "/dashboard/admin/nurses", icon: HeartPulse, color: "text-rose-600", bg: "bg-rose-50", desc: "Manage nursing staff" },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.label} href={card.href} className="group rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] transition hover:border-teal-200 hover:shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${card.bg}`}>
                <Icon className={`h-6 w-6 ${card.color}`} />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-slate-900">{card.label}</h2>
              <p className="mt-1 text-sm text-slate-500">{card.desc}</p>
              <div className="mt-4 flex items-center gap-1.5 text-sm font-medium text-teal-600 group-hover:gap-3 transition-all">
                <Plus className="h-4 w-4" /> Manage
              </div>
            </Link>
          );
        })}
      </section>
    </main>
  );
}
