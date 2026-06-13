"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Activity, Lock, Mail, Eye, EyeOff, HeartPulse } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        setError("Invalid credentials. Please try again.");
        setLoading(false);
        return;
      }

      const data = await res.json();
      const user = data.user ?? data;
      localStorage.setItem("pulsegrid_user", JSON.stringify(user));
      localStorage.setItem("pulsegrid_token", data.access_token ?? "");

      const role = user.role;
      if (role === "Doctor") router.replace("/dashboard/doctor");
      else if (role === "Nurse") router.replace("/dashboard/nurse");
      else if (role === "Lab Tech") router.replace("/dashboard/lab");
      else if (role === "Hospital Admin") router.replace("/dashboard/admin");
      else if (role === "Patient") router.replace("/dashboard/patient");
      else router.replace("/dashboard/doctor");
    } catch {
      // Demo fallback credentials for offline testing
      const demoCredentials: Record<string, { role: string; name: string; hospitalCode: string }> = {
        "doctor@pulsegrid.health": { role: "Doctor", name: "Dr. Sarah Johnson", hospitalCode: "CITYHOSP01" },
        "nurse@pulsegrid.health": { role: "Nurse", name: "Maya Patel", hospitalCode: "CITYHOSP01" },
        "lab@pulsegrid.health": { role: "Lab Tech", name: "Raju Verma", hospitalCode: "CITYHOSP01" },
        "admin@pulsegrid.health": { role: "Hospital Admin", name: "Admin User", hospitalCode: "CITYHOSP01" },
        "patient@pulsegrid.health": { role: "Patient", name: "Lakshmi Menon", hospitalCode: "CITYHOSP01" },
      };

      const demo = demoCredentials[email.toLowerCase()];
      if (demo && password === "password123") {
        const user = { ...demo, email };
        localStorage.setItem("pulsegrid_user", JSON.stringify(user));
        const role = demo.role;
        if (role === "Doctor") router.replace("/dashboard/doctor");
        else if (role === "Nurse") router.replace("/dashboard/nurse");
        else if (role === "Lab Tech") router.replace("/dashboard/lab");
        else if (role === "Hospital Admin") router.replace("/dashboard/admin");
        else if (role === "Patient") router.replace("/dashboard/patient");
      } else {
        setError("Invalid credentials. Try demo accounts below.");
      }
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role: string) => {
    const map: Record<string, string> = {
      Doctor: "doctor@pulsegrid.health",
      Nurse: "nurse@pulsegrid.health",
      "Lab Tech": "lab@pulsegrid.health",
      Admin: "admin@pulsegrid.health",
      Patient: "patient@pulsegrid.health",
    };
    setEmail(map[role] || "");
    setPassword("password123");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 p-4">
      {/* Animated background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-teal-500/10 blur-[120px]" />
        <div className="absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-[20px] bg-gradient-to-br from-teal-400 to-cyan-500 shadow-[0_8px_32px_rgba(20,184,166,0.4)]">
            <HeartPulse className="h-8 w-8 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white tracking-tight">PulseGrid</h1>
            <p className="text-sm text-slate-400 mt-1">Hospital Management System</p>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-[0_32px_80px_rgba(0,0,0,0.4)]">
          <h2 className="text-xl font-semibold text-white mb-1">Sign in to your account</h2>
          <p className="text-sm text-slate-400 mb-6">Enter your credentials to access the portal</p>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                <input
                  id="email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@hospital.com"
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-white placeholder-slate-500 outline-none transition focus:border-teal-500 focus:bg-white/10"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                <input
                  id="password-input"
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-10 text-white placeholder-slate-500 outline-none transition focus:border-teal-500 focus:bg-white/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300"
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-2.5 text-sm text-red-400">
                {error}
              </p>
            )}

            <button
              id="login-btn"
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 py-3 font-semibold text-white shadow-[0_4px_20px_rgba(20,184,166,0.35)] transition hover:from-teal-400 hover:to-cyan-400 hover:shadow-[0_4px_28px_rgba(20,184,166,0.5)] disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Activity className="h-4 w-4 animate-spin" />
                  Signing in…
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Demo accounts */}
          <div className="mt-6 border-t border-white/10 pt-5">
            <p className="text-xs text-slate-500 mb-3 text-center">Quick demo access (password: password123)</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {["Doctor", "Nurse", "Lab Tech", "Admin", "Patient"].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => fillDemo(role)}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 transition hover:bg-white/10 hover:border-teal-500/40"
                >
                  {role}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
