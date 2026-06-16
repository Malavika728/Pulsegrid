"use client";

import { useEffect, useState } from "react";
import { Search, Plus, Activity, Mail, Key, ShieldCheck, X } from "lucide-react";

type Nurse = {
  id: string;
  name: string;
  email: string;
  role: string;
  specialtyOrDepartment?: string;
  hospitalCode: string;
};

export default function AdminNursesPage() {
  const [nurses, setNurses] = useState<Nurse[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("PulseGrid@2026");
  const [department, setDepartment] = useState("Emergency Department");
  const [adminCode, setAdminCode] = useState("CITYHOSP01");

  const fetchNurses = () => {
    const stored = localStorage.getItem("pulsegrid_user");
    const code = stored ? JSON.parse(stored).hospitalCode : "CITYHOSP01";
    setAdminCode(code);

    fetch(`/api/admin/staff?role=Nurse&hospitalCode=${code}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setNurses(data);
        }
      })
      .catch(() => undefined);
  };

  useEffect(() => {
    fetchNurses();
  }, []);

  const handleAddNurse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    try {
      const res = await fetch("/api/admin/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: "Nurse",
          name,
          email,
          password,
          specialtyOrDepartment: department,
          hospitalCode: adminCode,
        }),
      });

      if (res.ok) {
        setName("");
        setEmail("");
        setDepartment("Emergency Department");
        setShowAddModal(false);
        fetchNurses();
      }
    } catch {}
  };

  const filtered = nurses.filter((nurse) =>
    nurse.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    nurse.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Manage Nurses</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Hospital Code: {adminCode}</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-teal-600 text-white hover:bg-teal-700 shadow-md shadow-teal-600/10 font-bold text-sm transition"
        >
          <Plus size={16} />
          <span>Add New Nurse</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search size={18} className="absolute left-4 top-4 text-slate-400" />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search nurse by name or email..."
          className="w-full border border-slate-200 rounded-2xl pl-12 pr-4 py-3 outline-none transition focus:border-teal-500 focus:bg-slate-50/50 text-slate-800 text-sm font-medium"
        />
      </div>

      {/* Grid of Nurses */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.length === 0 ? (
          <div className="col-span-3 text-center py-10 bg-white border border-slate-100 rounded-3xl text-slate-400 font-semibold">
            No nurses registered.
          </div>
        ) : (
          filtered.map((nurse) => (
            <div key={nurse.id} className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4 hover:shadow-md transition">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-cyan-50 text-cyan-600 rounded-full flex items-center justify-center font-bold text-sm">
                  {nurse.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{nurse.name}</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-600 bg-cyan-50 px-2.5 py-0.5 rounded-md mt-1 inline-block">
                    {nurse.specialtyOrDepartment || "General Ward Duty"}
                  </span>
                </div>
              </div>

              <div className="text-xs space-y-2 border-t border-slate-100 pt-4 font-semibold text-slate-500">
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-slate-400" />
                  <span className="truncate">{nurse.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-slate-400" />
                  <span>ID: {nurse.id}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Nurse Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAddNurse} className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 p-6 space-y-5 animate-scale-in">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-950 font-outfit">Register Nurse</h2>
                <p className="text-xs text-slate-400 font-bold mt-0.5">Under Hospital: {adminCode}</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-900 p-1"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Nancy Wheeler"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-teal-500 text-sm font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. nurse@pulsegrid.health"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-teal-500 text-sm font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Password (Generated)</label>
                <input
                  type="text"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="PulseGrid@2026"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-teal-500 text-sm font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Department</label>
                <input
                  type="text"
                  required
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. Emergency Department, General ICU"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-teal-500 text-sm font-semibold"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-100 justify-end">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-5 py-3 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-sm transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 rounded-2xl bg-teal-600 text-white hover:bg-teal-700 shadow-md shadow-teal-600/10 font-bold text-sm transition"
              >
                Register Nurse
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
