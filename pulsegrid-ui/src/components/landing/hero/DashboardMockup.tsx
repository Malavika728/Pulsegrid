export default function DashboardMockup() {
  return (
    <div className="relative w-full max-w-[820px]">

      <div className="bg-white rounded-[32px] shadow-[0_25px_60px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden">

        <div className="grid grid-cols-[160px_1fr] h-[430px]">

          {/* Sidebar */}

          <div className="bg-gradient-to-b from-[#02122D] to-[#062A5F] text-white p-5">

            <h3 className="font-bold text-lg mb-8">
              PulseGrid
            </h3>

            <div className="space-y-2 text-sm">

              <div className="bg-teal-600/25 rounded-xl px-4 py-3">
                Dashboard
              </div>

              <div className="px-4 py-3">Patients</div>
              <div className="px-4 py-3">Monitoring</div>
              <div className="px-4 py-3">Alerts</div>
              <div className="px-4 py-3">Reports</div>
              <div className="px-4 py-3">Analytics</div>

            </div>

          </div>

          {/* Main */}

          <div className="p-6">

            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Dashboard
                </h2>

                <p className="text-slate-500 text-sm">
                  Welcome back, Dr. Sarah
                </p>
              </div>

            </div>

            {/* Top Cards */}

            <div className="grid grid-cols-4 gap-3 mt-5">

              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-[11px] text-slate-500">
                  Total Patients
                </p>

                <h4 className="text-2xl font-bold mt-2">
                  1248
                </h4>
              </div>

              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-[11px] text-slate-500">
                  Active Monitoring
                </p>

                <h4 className="text-2xl font-bold mt-2">
                  324
                </h4>
              </div>

              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-[11px] text-slate-500">
                  Critical Alerts
                </p>

                <h4 className="text-2xl font-bold text-red-500 mt-2">
                  8
                </h4>
              </div>

              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-[11px] text-slate-500">
                  Recovery Score
                </p>

                <h4 className="text-2xl font-bold text-teal-600 mt-2">
                  85%
                </h4>
              </div>

            </div>

            {/* Chart */}

            <div className="mt-5 bg-slate-50 rounded-2xl p-5">

              <h4 className="font-semibold text-slate-800 mb-4">
                Patient Vitals
              </h4>

              <svg
                viewBox="0 0 600 120"
                className="w-full h-[120px]"
              >
                <polyline
                  fill="none"
                  stroke="#20C5B5"
                  strokeWidth="3"
                  points="
                  0,80
                  40,70
                  80,90
                  120,55
                  160,75
                  200,65
                  240,85
                  280,50
                  320,70
                  360,60
                  400,82
                  440,48
                  480,68
                  520,58
                  560,70
                  600,55"
                />
              </svg>

            </div>

            {/* Bottom Metrics */}

            <div className="grid grid-cols-4 gap-4 mt-4 text-sm">

              <div>
                <p className="text-slate-400">Heart Rate</p>
                <p className="font-bold">72 bpm</p>
              </div>

              <div>
                <p className="text-slate-400">Blood Pressure</p>
                <p className="font-bold">120/80</p>
              </div>

              <div>
                <p className="text-slate-400">SpO₂</p>
                <p className="font-bold">98%</p>
              </div>

              <div>
                <p className="text-slate-400">Temperature</p>
                <p className="font-bold">36.6°C</p>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}