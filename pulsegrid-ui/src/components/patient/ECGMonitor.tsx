export default function ECGMonitor() {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] lg:p-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Signal</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">Live ECG &amp; Rhythm</h2>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">Connected</span>
      </div>

      <div className="mt-6 rounded-3xl border border-slate-200 bg-[linear-gradient(135deg,#06111f_0%,#0f172a_100%)] p-4">
        <svg viewBox="0 0 800 180" className="h-[220px] w-full" aria-label="ECG monitor waveform">
          <defs>
            <linearGradient id="ecgGlow" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#2dd4bf" />
              <stop offset="50%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#818cf8" />
            </linearGradient>
          </defs>
          <path d="M0 96 H80 L110 54 L150 140 L200 96 H310 L340 58 L380 140 L440 96 H800" fill="none" stroke="url(#ecgGlow)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" className="ecg-flow" />
          <path d="M0 96 H80 L110 54 L150 140 L200 96 H310 L340 58 L380 140 L440 96 H800" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-500">
        <span className="rounded-full bg-slate-100 px-3 py-1">HR trend: +4% vs baseline</span>
        <span className="rounded-full bg-slate-100 px-3 py-1">ECG sensor: online</span>
        <span className="rounded-full bg-slate-100 px-3 py-1">Gateway latency: 1.2 s</span>
      </div>
    </section>
  );
}
