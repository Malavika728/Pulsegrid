"use client";

import { useEffect, useState } from "react";
import { Settings, Save, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState({ name: "", email: "", role: "", hospitalCode: "" });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("pulsegrid_user") || "{}");
    setUser({ name: u.name || "", email: u.email || "", role: u.role || "", hospitalCode: u.hospitalCode || "" });
  }, []);

  const handleSave = () => {
    const existing = JSON.parse(localStorage.getItem("pulsegrid_user") || "{}");
    localStorage.setItem("pulsegrid_user", JSON.stringify({ ...existing, name: user.name }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = () => {
    localStorage.removeItem("pulsegrid_user");
    localStorage.removeItem("pulsegrid_token");
    router.replace("/auth/login");
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-xl">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2"><Settings className="h-7 w-7 text-teal-600" /> Settings</h1>
        <p className="text-slate-500 mt-1">Manage your account and preferences</p>
      </div>

      <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] space-y-5">
        <h2 className="text-lg font-semibold text-slate-900">Profile</h2>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Display Name</label>
          <input value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })}
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-teal-400 transition" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
          <input value={user.email} readOnly className="w-full border border-slate-100 rounded-xl px-4 py-2.5 bg-slate-50 text-slate-500 cursor-not-allowed" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Role</label>
            <input value={user.role} readOnly className="w-full border border-slate-100 rounded-xl px-4 py-2.5 bg-slate-50 text-slate-500 cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Hospital Code</label>
            <input value={user.hospitalCode} readOnly className="w-full border border-slate-100 rounded-xl px-4 py-2.5 bg-slate-50 text-slate-500 cursor-not-allowed" />
          </div>
        </div>
        <button onClick={handleSave} className="flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 transition">
          <Save className="h-4 w-4" /> {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      <div className="rounded-[24px] border border-red-100 bg-red-50 p-6">
        <h2 className="text-lg font-semibold text-red-800 mb-2">Sign Out</h2>
        <p className="text-sm text-red-600 mb-4">You will be redirected to the login page.</p>
        <button onClick={handleLogout} className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition">
          <LogOut className="h-4 w-4" /> Sign Out
        </button>
      </div>
    </div>
  );
}
