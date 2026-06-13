"use client";

import { useEffect, useState } from "react";

export default function PatientSettingsPage() {
  const [settings, setSettings] = useState({
    liveTelemetry: true,
    aiAlerts: true,
    autoRefresh: true,
    notifications: true,
    darkMode: false,
  });

  useEffect(() => {
    fetch("/api/doctor/settings")
      .then((res) => res.json())
      .then(setSettings)
      .catch(() => undefined);
  }, []);

  const updateSetting = async (key: keyof typeof settings, value: boolean) => {
    const next = { ...settings, [key]: value };
    setSettings(next);

    await fetch("/api/doctor/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
  };

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
        <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Configuration</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Settings</h1>
        <p className="mt-3 text-slate-500">Manage telemetry alerts, notifications, and preferences for your personal monitoring dashboard.</p>
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        {[
          ["liveTelemetry", "Live telemetry streaming", "Stream real-time vitals and device packets into your workspace."],
          ["notifications", "Medication alerts & reminders", "Receive push alerts for prescribed medication rounds."],
          ["autoRefresh", "Auto refresh", "Refresh recovery score metrics and diagnostics logs automatically."],
          ["darkMode", "Dark mode theme", "Use the dark theme for dashboard charts."],
        ].map(([key, title, text]) => (
          <article key={key} className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
                <p className="mt-2 text-slate-500">{text}</p>
              </div>
              <button
                type="button"
                onClick={() => updateSetting(key as keyof typeof settings, !settings[key as keyof typeof settings])}
                className={`relative h-7 w-14 rounded-full transition ${settings[key as keyof typeof settings] ? "bg-teal-500" : "bg-slate-200"}`}
              >
                <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-md transition ${settings[key as keyof typeof settings] ? "left-8" : "left-1"}`} />
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
