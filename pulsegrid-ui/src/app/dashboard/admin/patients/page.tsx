"use client";

import { useEffect, useState } from "react";
import { Search, Plus, Activity, Mail, Key, ShieldCheck, X } from "lucide-react";

type Patient = {
  id: string;
  name: string;
  email: string;
  role: string;
  hospitalCode: string;
  age?: number;
  ward?: string;
};

export default function AdminPatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("PulseGrid@2026");
  const [age, setAge] = useState(45);
  const [ward, setWard] = useState("General");
  const [doctor, setDoctor] = useState("Dr. Sarah Johnson");
  const [adminCode, setAdminCode] = useState("CITYHOSP01");

  const fetchPatients = () => {
    const stored = localStorage.getItem("pulsegrid_user");
    const code = stored ? JSON.parse(stored).hospitalCode : "CITYHOSP01";
    setAdminCode(code);

    fetch(`/api/admin/staff?role=Patient&hospitalCode=${code}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPatients(data);
        }
      })
      .catch(() => undefined);
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleAddPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    try {
      const res = await fetch("/api/admin/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: "Patient",
          name,
          email,
          password,
          age,
          ward,
          doctor,
          hospitalCode: adminCode,
        }),
      });

      if (res.ok) {
        setName("");
        setEmail("");
        setAge(45);
        setWard("General");
        setDoctor("Dr. Sarah Johnson");
        setShowAddModal(false);
        fetchPatients();
      }
    } catch {}
  };

  const filtered = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Manage Patients</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Hospital Code: {adminCode}</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-teal-600 text-white hover:bg-teal-700 shadow-md shadow-teal-600/10 font-bold text-sm transition"
        >
          <Plus size={16} />
          <span>Register Patient</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search size={18} className="absolute left-4 top-4 text-slate-400" />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search patient by name or email..."
          className="w-full border border-slate-200 rounded-2xl pl-12 pr-4 py-3 outline-none transition focus:border-teal-500 focus:bg-slate-50/50 text-slate-800 text-sm font-medium"
        />
      </div>

      {/* Grid of Patients */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.length === 0 ? (
          <div className="col-span-3 text-center py-10 bg-white border border-slate-100 rounded-3xl text-slate-400 font-semibold">
            No patients registered.
          </div>
        ) : (
          filtered.map((patient) => (
            <div key={patient.id} className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4 hover:shadow-md transition">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center font-bold text-sm">
                  {patient.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{patient.name}</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-md mt-1 inline-block">
                    Ward: {patient.ward || "General"}
                  </span>
                </div>
              </div>

              <div className="text-xs space-y-2 border-t border-slate-100 pt-4 font-semibold text-slate-500">
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-slate-400" />
                  <span className="truncate">{patient.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-slate-400" />
                  <span>ID: {patient.id}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Register Patient Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAddPatient} className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 p-6 space-y-5 animate-scale-in">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-950 font-outfit">Register Patient</h2>
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
                  placeholder="e.g. Arjun Sharma"
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
                  placeholder="e.g. patient@pulsegrid.health"
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Age</label>
                  <input
                    type="number"
                    required
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-teal-500 text-sm font-semibold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Assigned Ward</label>
                  <input
                    type="text"
                    required
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                    placeholder="e.g. ICU-A, POST-OP"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-teal-500 text-sm font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Attending Doctor</label>
                <input
                  type="text"
                  required
                  value={doctor}
                  onChange={(e) => setDoctor(e.target.value)}
                  placeholder="e.g. Dr. Sarah Johnson"
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
                Register Patient
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
