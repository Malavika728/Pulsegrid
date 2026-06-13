import { Activity, Heart, Thermometer, Wind } from "lucide-react";

const vitals = [
  { label: "Heart Rate", value: "82 bpm", detail: "Normal sinus rhythm", icon: Heart, accent: "text-rose-500" },
  { label: "SpO₂", value: "98%", detail: "Oxygen saturation stable", icon: Activity, accent: "text-teal-600" },
  { label: "Temperature", value: "36.8°C", detail: "Within normal range", icon: Thermometer, accent: "text-amber-500" },
  { label: "Respiration", value: "18/min", detail: "Steady breathing rate", icon: Wind, accent: "text-cyan-600" },
];

export default function LiveVitals() {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] lg:p-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Telemetry</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">Live Vitals</h2>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">Live feed</span>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {vitals.map((item) => {
          const Icon = item.icon;
          return (
            <article key={item.label} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">{item.label}</p>
                <Icon className={item.accent} size={18} />
              </div>
              <h3 className={`mt-4 text-3xl font-bold ${item.accent}`}>{item.value}</h3>
              <p className="mt-3 text-sm text-slate-500">{item.detail}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
