"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Upload, Clock, CheckCircle, Users } from "lucide-react";

export default function LabDashboardPage() {
  const [user, setUser] = useState({ name: "Raju Verma" });

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("pulsegrid_user") || "{}");
    if (u.name) setUser({ name: u.name });
  }, []);

  return (
    <main className="space-y-6 animate-fade-in">
      <section className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
        <p className="text-sm uppercase tracking-[0.35em] text-teal-600">Lab Technician Portal</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Welcome, {user.name}</h1>
        <p className="mt-3 text-slate-500">Upload patient lab report PDFs and manage pending tests assigned by doctors.</p>
      </section>

      <section className="grid gap-5 sm:grid-cols-3">
        {[
          { label: "Pending Reports", value: "5", icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Uploaded Today", value: "3", icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Total Patients", value: "8", icon: Users, color: "text-teal-600", bg: "bg-teal-50" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <article key={s.label} className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
              <div className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl ${s.bg}`}>
                <Icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <p className="mt-4 text-sm text-slate-500">{s.label}</p>
              <h2 className={`mt-2 text-3xl font-bold ${s.color}`}>{s.value}</h2>
            </article>
          );
        })}
      </section>

      <section className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
        <h2 className="text-lg font-semibold text-slate-900">Upload Lab Reports</h2>
        <p className="mt-2 text-sm text-slate-500">Go to the Patients page to upload PDF reports for each assigned lab test.</p>
        <Link href="/dashboard/lab/patients" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 transition">
          <Upload className="h-4 w-4" /> Go to Patients
        </Link>
      </section>
    </main>
  );
}
