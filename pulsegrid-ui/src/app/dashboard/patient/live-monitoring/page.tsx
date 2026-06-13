"use client";

import ECGMonitor from "@/components/patient/ECGMonitor";
import LiveVitals from "@/components/patient/LiveVitals";

export default function PatientLiveMonitoringPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
        <p className="text-sm uppercase tracking-[0.35em] text-teal-600">Telemetry Feed</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Live Patient Monitoring</h1>
        <p className="mt-3 text-slate-500">
          This dashboard shows your real-time telemetry vitals, including ECG rhythm waveforms, heart rate trends, oxygen levels, and skin temperature.
        </p>
      </section>

      <ECGMonitor />
      <LiveVitals />
    </div>
  );
}