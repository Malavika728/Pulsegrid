"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PulseGridLogo from "@/components/common/PulseGridLogo";

const roles = [
  "Doctor",
  "Nurse",
  "Patient",
  "Lab Tech",
  "Hospital Admin",
] as const;

const roleRoutes: Record<string, string> = {
  Doctor: "/dashboard/doctor",
  Nurse: "/dashboard/nurse/patients",
  Patient: "/dashboard/patient",
  "Lab Tech": "/dashboard/lab/patients",
  "Hospital Admin": "/dashboard/admin",
};

const roleCredentials: Record<string, { email: string; password: string }> = {
  Doctor: { email: "doctor@pulsegrid.health", password: "PulseGrid@2026" },
  Nurse: { email: "nurse@pulsegrid.health", password: "PulseGrid@2026" },
  Patient: { email: "patient@pulsegrid.health", password: "PulseGrid@2026" },
  "Lab Tech": { email: "lab@pulsegrid.health", password: "PulseGrid@2026" },
  "Hospital Admin": { email: "hospital.admin@pulsegrid.health", password: "PulseGrid@2026" },
};

const hospitalOptions = [
  { code: "CITYHOSP01", name: "City General Hospital" },
  { code: "APOLLOH01", name: "Apollo Hospital" },
  { code: "YASHODA01", name: "Yashoda Hospital" },
];

export default function LoginPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState("Doctor");
  const [hospitalCode, setHospitalCode] = useState("CITYHOSP01");
  const [email, setEmail] = useState(roleCredentials.Doctor.email);
  const [password, setPassword] = useState(roleCredentials.Doctor.password);
  const [error, setError] = useState("");

  const hospitalName =
    hospitalOptions.find((item) => item.code.toLowerCase() === hospitalCode.trim().toLowerCase())?.name ||
    "PulseGrid Hospital";

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-[#F8FCFC] to-[#EEF9F8]">

      <div className="max-w-7xl mx-auto px-8 py-20">

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT SIDE */}

          <div>

            <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 px-5 py-2 rounded-full text-sm font-medium">
              ● Connected Care • Secure Access
            </div>

            <h1 className="mt-8 text-6xl font-extrabold leading-tight text-slate-900">
              Welcome Back To
              <br />
              <span className="bg-gradient-to-r from-teal-600 to-cyan-500 bg-clip-text text-transparent">
                {hospitalName}
              </span>
              <br />
              Workspace
            </h1>

            <p className="mt-8 text-xl text-slate-600 leading-9 max-w-xl">
              Access patient monitoring, analytics, reports,
              alerts and intelligent healthcare workflows
              through PulseGrid.
            </p>

            <div className="grid grid-cols-1 gap-4 mt-10">

              <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-5">
                <h4 className="font-semibold text-slate-900">
                  Real-Time Monitoring
                </h4>
                <p className="text-slate-500 text-sm mt-1">
                  Live patient vitals and ICU tracking.
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-5">
                <h4 className="font-semibold text-slate-900">
                  AI Clinical Insights
                </h4>
                <p className="text-slate-500 text-sm mt-1">
                  Predictive analytics and recovery intelligence.
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-5">
                <h4 className="font-semibold text-slate-900">
                  Enterprise Security
                </h4>
                <p className="text-slate-500 text-sm mt-1">
                  HIPAA compliant access and data protection.
                </p>
              </div>

            </div>

          </div>

          {/* RIGHT SIDE */}

          <div>

            <div className="bg-white rounded-[32px] shadow-xl border border-slate-100 p-10">

              <div className="text-center">

                <div className="flex justify-center mb-8">
                  <PulseGridLogo />
                </div>

                <h2 className="text-3xl font-bold text-slate-900">
                  Sign In
                </h2>

                <p className="text-slate-500 mt-3">
                  Access your hospital workspace
                </p>

              </div>

              {/* Roles */}

              <div className="grid grid-cols-3 gap-3 mt-8">
                {roles.map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => {
                      setSelectedRole(role);
                      setEmail(roleCredentials[role].email);
                      setPassword(roleCredentials[role].password);
                      setError("");
                    }}
                    className={`rounded-xl py-3 font-medium transition ${
                      selectedRole === role
                        ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-md"
                        : "border border-slate-200 text-slate-700 hover:border-teal-200 hover:bg-teal-50"
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>

              {/* Inputs */}

              <div className="mt-8 space-y-5">

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Hospital Code</label>
                  <input
                    type="text"
                    value={hospitalCode}
                    onChange={(event) => setHospitalCode(event.target.value)}
                    placeholder="CITYHOSP01"
                    className="w-full border border-slate-200 rounded-xl px-5 py-4 outline-none focus:border-teal-500"
                  />
                  <p className="text-xs text-slate-500">Use CITYHOSP01, APOLLOH01, or YASHODA01 for the multi-tenant demo.</p>
                </div>

                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Email Address"
                  className="w-full border border-slate-200 rounded-xl px-5 py-4 outline-none focus:border-teal-500"
                />

                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Password"
                  className="w-full border border-slate-200 rounded-xl px-5 py-4 outline-none focus:border-teal-500"
                />

              </div>

              <div className="flex justify-between items-center mt-5 text-sm">

                <label className="flex items-center gap-2 text-slate-600">
                  <input type="checkbox" />
                  Remember Me
                </label>

                <button className="text-teal-600 font-medium">
                  Forgot Password?
                </button>

              </div>

              <p className="mt-4 rounded-2xl border border-teal-100 bg-teal-50 px-4 py-3 text-sm text-teal-800">
                Demo credentials for {selectedRole}: {roleCredentials[selectedRole].email} / {roleCredentials[selectedRole].password}
              </p>

              {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}

              <button
                type="button"
                onClick={() => {
                  const expected = roleCredentials[selectedRole];

                  const normalizedCode = hospitalCode.trim().toUpperCase();
                  const knownHospital = hospitalOptions.some((item) => item.code === normalizedCode);

                  if (!normalizedCode) {
                    setError("Enter your hospital code to continue.");
                    return;
                  }

                  if (!knownHospital) {
                    setError("Hospital code not recognized. Use CITYHOSP01, APOLLOH01, or YASHODA01.");
                    return;
                  }

                  if (email.trim().toLowerCase() === expected.email && password === expected.password) {
                    setError("");
                    const names: Record<string, string> = {
                      Doctor: "Dr. Sarah Johnson",
                      Nurse: "Nancy Wheeler",
                      Patient: "Arjun Sharma",
                      "Lab Tech": "Ravi Thomas",
                      "Hospital Admin": "Jordan Lee",
                    };
                    const displayName = names[selectedRole] || "User";
                    localStorage.setItem(
                      "pulsegrid_user",
                      JSON.stringify({
                        role: selectedRole,
                        name: displayName,
                        email: email.trim().toLowerCase(),
                        hospitalCode: normalizedCode,
                        hospitalName,
                      })
                    );
                    router.push(roleRoutes[selectedRole] ?? "/dashboard/doctor");
                    return;
                  }

                  setError("Invalid credentials. Use the role demo credentials shown above.");
                }}
                className="w-full mt-8 py-4 rounded-xl bg-gradient-to-r from-teal-500 to-blue-600 text-white font-semibold shadow-lg hover:scale-[1.02] transition"
              >
                Login as {selectedRole}
              </button>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}