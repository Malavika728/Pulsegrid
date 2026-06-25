"use client";

import { useEffect, useState } from "react";
import { Search, Plus, Mail, ShieldCheck, X } from "lucide-react";

type Doctor = {
  id: string;
  name: string;
  email: string;
  role: string;
  specialtyOrDepartment?: string;
  hospitalCode: string;
};

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("PulseGrid@2026");
  const [specialty, setSpecialty] = useState("Cardiologist");
  const [adminCode, setAdminCode] = useState("CITYHOSP01");

  const fetchDoctors = () => {
    const stored = localStorage.getItem("pulsegrid_user");
    const code = stored ? JSON.parse(stored).hospitalCode : "CITYHOSP01";
    setAdminCode(code);

    fetch(`/api/admin/staff?role=Doctor&hospitalCode=${code}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setDoctors(data);
      })
      .catch(() => undefined);
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleAddDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitSuccess("");

    if (!name.trim() || !email.trim()) {
      setSubmitError("Name and email are required.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: "Doctor",
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          specialtyOrDepartment: specialty,
          hospitalCode: adminCode,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setSubmitError(data?.error || "Failed to register doctor. Please try again.");
        setSubmitting(false);
        return;
      }

      setSubmitSuccess(`Dr. ${name} registered successfully!`);
      setName("");
      setEmail("");
      setPassword("PulseGrid@2026");
      setSpecialty("Cardiologist");
      setSubmitting(false);

      setTimeout(() => {
        setSubmitSuccess("");
        setShowAddModal(false);
        fetchDoctors();
      }, 1500);
    } catch (err) {
      setSubmitError(`Network error: ${String(err)}`);
      setSubmitting(false);
    }
  };

  const filtered = doctors.filter(
    (doc) =>
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Manage Doctors</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">
            Hospital Code: {adminCode}
          </p>
        </div>
        <button
          onClick={() => {
            setShowAddModal(true);
            setSubmitError("");
            setSubmitSuccess("");
          }}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-teal-600 text-white hover:bg-teal-700 shadow-md shadow-teal-600/10 font-bold text-sm transition"
        >
          <Plus size={16} />
          <span>Add New Doctor</span>
        </button>
      </div>

      <div className="relative">
        <Search size={18} className="absolute left-4 top-4 text-slate-400" />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search doctor by name or email..."
          className="w-full border border-slate-200 rounded-2xl pl-12 pr-4 py-3 outline-none transition focus:border-teal-500 focus:bg-slate-50/50 text-slate-800 text-sm font-medium"
        />
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.length === 0 ? (
          <div className="col-span-3 text-center py-10 bg-white border border-slate-100 rounded-3xl text-slate-400 font-semibold">
            No doctors registered yet. Click &quot;Add New Doctor&quot; to register one.
          </div>
        ) : (
          filtered.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4 hover:shadow-md transition"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center font-bold text-sm">
                  {doc.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    {doc.name}
                  </h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-2.5 py-0.5 rounded-md mt-1 inline-block">
                    {doc.specialtyOrDepartment || "General Medicine"}
                  </span>
                </div>
              </div>
              <div className="text-xs space-y-2 border-t border-slate-100 pt-4 font-semibold text-slate-500">
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-slate-400" />
                  <span className="truncate">{doc.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-slate-400" />
                  <span>ID: {doc.id}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleAddDoctor}
            className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 p-6 space-y-5"
          >
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-950">
                  Register Doctor
                </h2>
                <p className="text-xs text-slate-400 font-bold mt-0.5">
                  Under Hospital: {adminCode}
                </p>
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
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Sarah Johnson"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-teal-500 text-sm font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. doctor@hospital.com"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-teal-500 text-sm font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Password
                </label>
                <input
                  type="text"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="PulseGrid@2026"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-teal-500 text-sm font-semibold"
                />
                <p className="text-xs text-slate-400">
                  The doctor will use this password to log in.
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Specialty
                </label>
                <input
                  type="text"
                  required
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  placeholder="e.g. Cardiologist, Neurologist"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-teal-500 text-sm font-semibold"
                />
              </div>
            </div>

            {submitError && (
              <p className="text-sm text-rose-600 bg-rose-50 px-4 py-3 rounded-xl">
                {submitError}
              </p>
            )}
            {submitSuccess && (
              <p className="text-sm text-emerald-700 bg-emerald-50 px-4 py-3 rounded-xl">
                {submitSuccess}
              </p>
            )}

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
                disabled={submitting}
                className="px-6 py-3 rounded-2xl bg-teal-600 text-white hover:bg-teal-700 shadow-md shadow-teal-600/10 font-bold text-sm transition disabled:opacity-60"
              >
                {submitting ? "Registering..." : "Register Doctor"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}