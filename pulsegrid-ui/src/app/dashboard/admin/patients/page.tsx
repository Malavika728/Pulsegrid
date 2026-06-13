"use client";

import { useEffect, useState } from "react";
import { Users, Plus, Key, Trash2, Search } from "lucide-react";

type Person = {
  id: string;
  name: string;
  email: string;
  ward?: string;
  age?: number;
  password?: string;
};

export default function AdminPatientsPage() {
  const [patients, setPatients] = useState<Person[]>([]);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", age: "", ward: "" });
  const [generatedCred, setGeneratedCred] = useState<{ email: string; password: string } | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchPatients = () => {
    const u = JSON.parse(localStorage.getItem("pulsegrid_user") || "{}");
    const hCode = u.hospitalCode || "CITYHOSP01";
    fetch(`/api/doctor/patients?hospitalCode=${hCode}`)
      .then((r) => r.json())
      .then(setPatients)
      .catch(() => undefined);
  };

  useEffect(() => { fetchPatients(); }, []);

  const handleAdd = async () => {
    if (!form.name || !form.email) return;
    setSaving(true);
    const password = `Pat@${Math.floor(1000 + Math.random() * 9000)}`;
    const u = JSON.parse(localStorage.getItem("pulsegrid_user") || "{}");
    const hCode = u.hospitalCode || "CITYHOSP01";

    try {
      await fetch("/api/doctor/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, age: Number(form.age), password, role: "Patient", hospitalCode: hCode }),
      });
      setGeneratedCred({ email: form.email, password });
      setForm({ name: "", email: "", age: "", ward: "" });
      fetchPatients();
    } catch {
      setGeneratedCred({ email: form.email, password });
    } finally {
      setSaving(false);
    }
  };

  const filtered = patients.filter((p) =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.id?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2"><Users className="h-7 w-7 text-teal-600" /> Patients</h1>
          <p className="text-slate-500 mt-1">Add and manage patients for this hospital</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 transition">
          <Plus className="h-4 w-4" /> Add Patient
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or ID…" className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3 outline-none focus:border-teal-300 bg-white" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-400 border-b border-slate-100">
            <tr>
              <th className="p-4 pl-6 text-left">Patient</th>
              <th className="p-4 text-left">Ward</th>
              <th className="p-4 text-left">Age</th>
              <th className="p-4 pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <tr><td colSpan={4} className="p-8 text-center text-slate-400">No patients found</td></tr>
            ) : filtered.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4 pl-6">
                  <div className="font-semibold text-slate-900">{p.name}</div>
                  <div className="text-xs text-slate-400 font-mono">{p.id}</div>
                </td>
                <td className="p-4 text-slate-600">{p.ward || "—"}</td>
                <td className="p-4 text-slate-600">{p.age || "—"}</td>
                <td className="p-4 pr-6 text-right">
                  <button className="text-slate-400 hover:text-red-500 transition p-1.5 rounded-lg hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-[28px] bg-white p-8 shadow-2xl">
            <h2 className="text-xl font-bold text-slate-900 mb-5">Add New Patient</h2>
            <div className="space-y-4">
              {[["Name", "name", "text", "Full name"], ["Email", "email", "email", "patient@email.com"], ["Age", "age", "number", "Age"], ["Ward", "ward", "text", "e.g. ICU-A"]].map(([label, field, type, placeholder]) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
                  <input type={type} placeholder={placeholder} value={form[field as keyof typeof form]} onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-teal-400" />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAdd(false)} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50">Cancel</button>
              <button onClick={handleAdd} disabled={saving} className="flex-1 rounded-xl bg-teal-600 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-60">
                {saving ? "Adding…" : "Add Patient"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Generated Credentials */}
      {generatedCred && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-[28px] bg-white p-8 shadow-2xl">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 mb-4"><Key className="h-7 w-7 text-teal-600" /></div>
            <h2 className="text-xl font-bold text-slate-900">Credentials Generated</h2>
            <p className="text-sm text-slate-500 mt-2 mb-5">Share these credentials with the patient.</p>
            <div className="space-y-3 rounded-2xl bg-slate-50 p-4 font-mono text-sm">
              <p><span className="text-slate-500">Email:</span> <span className="font-semibold text-slate-900">{generatedCred.email}</span></p>
              <p><span className="text-slate-500">Password:</span> <span className="font-semibold text-teal-700">{generatedCred.password}</span></p>
            </div>
            <button onClick={() => { setGeneratedCred(null); setShowAdd(false); }} className="mt-5 w-full rounded-xl bg-teal-600 py-2.5 text-sm font-semibold text-white hover:bg-teal-700">Done</button>
          </div>
        </div>
      )}
    </div>
  );
}
