"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, Activity, ClipboardList, TrendingUp } from "lucide-react";

export default function DoctorDashboardPage() {
  const [user, setUser] = useState({ name: "Dr. Sarah Johnson", role: "Cardiologist" });
  const [stats] = useState([
    { label: "Total Patients", value: "24", icon: Users, color: "text-teal-600", bg: "bg-teal-50" },
    { label: "Lab Tests Pending", value: "7", icon: ClipboardList, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Reports Uploaded", value: "17", icon: Activity, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "This Week", value: "+3", icon: TrendingUp, color: "text-violet-600", bg: "bg-violet-50" },
  ]);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("pulsegrid_user") || "{}");
    if (u.name) setUser({ name: u.name, role: u.specialization || "Physician" });
  }, []);

  return (
    <main className="space-y-6 animate-fade-in">
      {/* Header */}
      <section className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
        <p className="text-sm uppercase tracking-[0.35em] text-teal-600">Doctor Portal</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Good day, {user.name} 👋</h1>
        <p className="mt-3 text-slate-500">Here's an overview of your ward today. Use the sidebar to navigate to patients and settings.</p>
        <div className="mt-5 flex flex-wrap gap-3 text-sm">
          <span className="rounded-full bg-teal-50 px-3 py-1 text-teal-700 font-medium">{user.role}</span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">City General Hospital</span>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <article key={s.label} className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] transition hover:shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
              <div className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl ${s.bg}`}>
                <Icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <p className="mt-4 text-sm text-slate-500">{s.label}</p>
              <h2 className={`mt-2 text-3xl font-bold ${s.color}`}>{s.value}</h2>
            </article>
          );
        })}
      </section>

      {/* Quick Actions */}
      <section className="grid gap-5 md:grid-cols-2">
        <article className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
          <h2 className="text-lg font-semibold text-slate-900">Patient Registry</h2>
          <p className="mt-2 text-sm text-slate-500">View and manage all patients, assign lab tests, and review uploaded reports.</p>
          <Link href="/dashboard/doctor/patients" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 transition">
            <Users className="h-4 w-4" /> View Patients
          </Link>
        </article>

        <article className="rounded-[24px] border border-teal-100 bg-gradient-to-br from-teal-50 to-cyan-50 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
          <h2 className="text-lg font-semibold text-slate-900">Lab Report Review</h2>
          <p className="mt-2 text-sm text-slate-600">When the lab uploads PDF reports, you can review them directly from the patient&apos;s record.</p>
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-teal-600/10 px-4 py-2.5 text-sm font-medium text-teal-700">
            <Activity className="h-4 w-4" /> Reports auto-appear when uploaded
          </div>
        </article>
      </section>
    </main>
  );
}
