"use client";

import { useEffect, useState } from "react";
import { Stethoscope, Plus, Key, Trash2, Search } from "lucide-react";

type Doctor = { id: string; name: string; email: string; specialization?: string; };

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", specialization: "" });
  const [generatedCred, setGeneratedCred] = useState<{ email: string; password: string } | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchDoctors = () => {
    const u = JSON.parse(localStorage.getItem("pulsegrid_user") || "{}");
    const hCode = u.hospitalCode || "CITYHOSP01";
    fetch(`/api/admin/staff?role=Doctor&hospitalCode=${hCode}`)
      .then((r) => r.json())
      .then(setDoctors)
      .catch(() => setDoctors([]));
  };

  useEffect(() => { fetchDoctors(); }, []);

  const handleAdd = async () => {
    if (!form.name || !form.email) return;
    setSaving(true);
    const password = `Doc@${Math.floor(1000 + Math.random() * 9000)}`;
    const u = JSON.parse(localStorage.getItem("pulsegrid_user") || "{}");
    const hCode = u.hospitalCode || "CITYHOSP01";
    try {
      await fetch("/api/admin/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, password, role: "Doctor", hospitalCode: hCode }),
      });
      setGeneratedCred({ email: form.email, password });
      setForm({ name: "", email: "", specialization: "" });
      fetchDoctors();
    } catch {
      setGeneratedCred({ email: form.email, password });
    } finally {
      setSaving(false);
    }
  };

  const filtered = doctors.filter((d) => !search || d.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2"><Stethoscope className="h-7 w-7 text-violet-600" /> Doctors</h1>
          <p className="text-slate-500 mt-1">Manage doctor accounts for this hospital</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 transition">
          <Plus className="h-4 w-4" /> Add Doctor
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search doctors…" className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3 outline-none focus:border-violet-300 bg-white" />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-400 border-b border-slate-100">
            <tr>
              <th className="p-4 pl-6 text-left">Doctor</th>
              <th className="p-4 text-left">Specialization</th>
              <th className="p-4 pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <tr><td colSpan={3} className="p-8 text-center text-slate-400">No doctors found. Add one to get started.</td></tr>
            ) : filtered.map((d) => (
              <tr key={d.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4 pl-6">
                  <div className="font-semibold text-slate-900">{d.name}</div>
                  <div className="text-xs text-slate-400">{d.email}</div>
                </td>
                <td className="p-4 text-slate-600">{d.specialization || "Physician"}</td>
                <td className="p-4 pr-6 text-right">
                  <button className="text-slate-400 hover:text-red-500 transition p-1.5 rounded-lg hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-[28px] bg-white p-8 shadow-2xl">
            <h2 className="text-xl font-bold text-slate-900 mb-5">Add New Doctor</h2>
            <div className="space-y-4">
              {[["Name", "name", "Full name"], ["Email", "email", "doctor@hospital.com"], ["Specialization", "specialization", "e.g. Cardiologist"]].map(([label, field, placeholder]) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
                  <input placeholder={placeholder} value={form[field as keyof typeof form]} onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-violet-400" />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAdd(false)} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50">Cancel</button>
              <button onClick={handleAdd} disabled={saving} className="flex-1 rounded-xl bg-violet-600 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-60">{saving ? "Adding…" : "Add Doctor"}</button>
            </div>
          </div>
        </div>
      )}

      {generatedCred && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-[28px] bg-white p-8 shadow-2xl">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 mb-4"><Key className="h-7 w-7 text-violet-600" /></div>
            <h2 className="text-xl font-bold text-slate-900">Doctor Credentials</h2>
            <p className="text-sm text-slate-500 mt-2 mb-5">Share these credentials with the doctor.</p>
            <div className="space-y-3 rounded-2xl bg-slate-50 p-4 font-mono text-sm">
              <p><span className="text-slate-500">Email:</span> <span className="font-semibold text-slate-900">{generatedCred.email}</span></p>
              <p><span className="text-slate-500">Password:</span> <span className="font-semibold text-violet-700">{generatedCred.password}</span></p>
            </div>
            <button onClick={() => { setGeneratedCred(null); setShowAdd(false); }} className="mt-5 w-full rounded-xl bg-violet-600 py-2.5 text-sm font-semibold text-white hover:bg-violet-700">Done</button>
          </div>
        </div>
      )}
    </div>
  );
}
