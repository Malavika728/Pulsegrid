"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, ArrowRight, ClipboardList, Shield } from "lucide-react";

export default function NurseDashboardPage() {
  const [overview, setOverview] = useState({
    totalPatients: 0,
    pendingReports: 0,
    uploadedReports: 0,
  });

  const [nurseInfo, setNurseInfo] = useState({
    name: "Nancy Wheeler",
    role: "Charge Nurse",
    specialtyOrDepartment: "Emergency Department",
  });

  useEffect(() => {
    // Read nurse details from local storage
    const stored = localStorage.getItem("pulsegrid_user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setNurseInfo({
          name: parsed.name || "Nancy Wheeler",
          role: parsed.role || "Nurse",
          specialtyOrDepartment: parsed.specialtyOrDepartment || "Emergency Department",
        });
      } catch {}
    }

    // Load patient stats
    fetch("/api/doctor/patients")
      .then((res) => res.json())
      .then((patients) => {
        if (Array.isArray(patients)) {
          let pending = 0;
          let uploaded = 0;
          patients.forEach((p) => {
            (p.labTests || []).forEach((t: any) => {
              if (t.status === "Pending") pending++;
              else if (t.status === "Uploaded") uploaded++;
            });
          });
          setOverview({
            totalPatients: patients.length,
            pendingReports: pending,
            uploadedReports: uploaded,
          });
        }
      })
      .catch(() => undefined);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <section className="rounded-[28px] border border-slate-200 bg-gradient-to-r from-slate-950 via-slate-900 to-teal-950 p-6 text-white shadow-[0_18px_50px_rgba(15,23,42,0.12)] lg:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-teal-200">Clinical Dashboard</p>
            <h2 className="mt-3 text-3xl font-bold">Welcome back, {nurseInfo.name}</h2>
            <p className="mt-3 max-w-2xl text-slate-200">
              Manage patient registries, monitor live bedside telemetry streams, and review pending diagnostic reports.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/10 p-4 text-sm text-slate-200">
            <p className="font-semibold text-white">Focus Specialty</p>
            <p className="mt-1">{nurseInfo.specialtyOrDepartment} • Attending Rounds</p>
          </div>
        </div>
      </section>

      {/* Widget Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Link
          href="/dashboard/nurse/patients"
          className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition group"
        >
          <div className="flex items-center justify-between">
            <Users className="text-teal-600" size={24} />
            <ArrowRight size={18} className="text-slate-400 group-hover:translate-x-1 transition" />
          </div>
          <p className="mt-5 text-slate-500 text-sm font-semibold">Patients In Care</p>
          <h2 className="mt-2 text-3xl font-bold text-teal-600">{overview.totalPatients}</h2>
        </Link>

        <Link
          href="/dashboard/nurse/patients?filter=Pending"
          className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition group"
        >
          <div className="flex items-center justify-between">
            <ClipboardList className="text-amber-600" size={24} />
            <ArrowRight size={18} className="text-slate-400 group-hover:translate-x-1 transition" />
          </div>
          <p className="mt-5 text-slate-500 text-sm font-semibold">Pending Reports</p>
          <h2 className="mt-2 text-3xl font-bold text-amber-600">{overview.pendingReports}</h2>
        </Link>

        <Link
          href="/dashboard/nurse/patients?filter=Uploaded"
          className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition group"
        >
          <div className="flex items-center justify-between">
            <ClipboardList className="text-emerald-600" size={24} />
            <ArrowRight size={18} className="text-slate-400 group-hover:translate-x-1 transition" />
          </div>
          <p className="mt-5 text-slate-500 text-sm font-semibold">Completed Reports</p>
          <h2 className="mt-2 text-3xl font-bold text-emerald-600">{overview.uploadedReports}</h2>
        </Link>
      </div>

      {/* Overview Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Centralized Triage Info</h3>
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-2xl flex items-start gap-3">
              <Shield size={16} className="text-teal-600 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800 text-sm block">Nursing Access Active</span>
                <span className="text-xs text-slate-500 font-medium mt-1 block">
                  You are authorized to review active patient diagnostic logs and check bedside telemetry connections.
                </span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl flex items-start gap-3">
              <Shield size={16} className="text-teal-600 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800 text-sm block">Multi-Tenant Sync</span>
                <span className="text-xs text-slate-500 font-medium mt-1 block">
                  Diagnostic queues are isolated under your current hospital code.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-slate-900">Workspace Tasks</h3>
          <ul className="space-y-3 text-xs font-semibold text-slate-500">
            <li className="p-4 border border-slate-100 rounded-2xl flex items-center justify-between">
              <span>Review new pathology lab uploads</span>
              <span className="text-amber-600">Pending</span>
            </li>
            <li className="p-4 border border-slate-100 rounded-2xl flex items-center justify-between">
              <span>Complete bedside telemetry check-ins</span>
              <span className="text-teal-600">Active</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
