export default function PhoneMockup() {
  return (
    <div
      className="
        relative
        mx-auto
        mt-8
        w-fit
        lg:absolute
        lg:right-0
        xl:right-4
        lg:top-10
        lg:rotate-[4deg]
        z-30
      "
    >
      <div
        className="
          w-[280px]
          sm:w-[320px]
          md:w-[340px]
          lg:w-[200px]
          xl:w-[220px]
          bg-white
          rounded-[38px]
          border-[5px]
          border-slate-900
          shadow-2xl
          overflow-hidden
        "
      >
        {/* Notch */}
        <div className="flex justify-center pt-3">
          <div className="w-20 h-5 bg-slate-900 rounded-full"></div>
        </div>

        <div className="p-4">
          <div className="flex justify-between text-[11px] sm:text-xs text-slate-500 mb-4">
            <span>11:05</span>
            <span>📶 🔋</span>
          </div>

          <h4 className="font-bold text-base lg:text-sm">
            Hello, Dr. Sarah
          </h4>

          <p className="text-xs text-slate-500">
            Today's Overview
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-[10px] sm:text-[11px] text-slate-500">
                Total Patients
              </p>

              <h3 className="font-bold text-lg lg:text-base">
                324
              </h3>
            </div>

            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-[10px] sm:text-[11px] text-slate-500">
                Alerts
              </p>

              <h3 className="font-bold text-lg lg:text-base text-red-500">
                8
              </h3>
            </div>
          </div>

          {/* Live Monitoring */}
          <div className="mt-4">
            <p className="font-semibold text-sm lg:text-xs mb-2">
              Live Monitoring
            </p>

            <div className="space-y-2">
              <div className="flex justify-between items-center bg-slate-50 rounded-xl p-3">
                <div>
                  <p className="text-[11px] sm:text-xs font-medium">
                    John Ryan
                  </p>

                  <p className="text-[10px] sm:text-[11px] text-slate-500">
                    ICU Room 12
                  </p>
                </div>

                <span className="text-green-500 text-[11px] sm:text-xs">
                  72 bpm
                </span>
              </div>

              <div className="flex justify-between items-center bg-slate-50 rounded-xl p-3">
                <div>
                  <p className="text-[11px] sm:text-xs font-medium">
                    Sara Smith
                  </p>

                  <p className="text-[10px] sm:text-[11px] text-slate-500">
                    ICU Room 08
                  </p>
                </div>

                <span className="text-green-500 text-[11px] sm:text-xs">
                  98 SpO₂
                </span>
              </div>

              <div className="flex justify-between items-center bg-slate-50 rounded-xl p-3">
                <div>
                  <p className="text-[11px] sm:text-xs font-medium">
                    Emily Davis
                  </p>

                  <p className="text-[10px] sm:text-[11px] text-slate-500">
                    ICU Room 15
                  </p>
                </div>

                <span className="text-red-500 text-[11px] sm:text-xs">
                  Alert
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-4 text-center">
            <button className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-sm lg:text-xs py-3 lg:py-2 rounded-xl">
              View All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}