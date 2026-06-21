import DashboardMockup from "../hero/DashboardMockup";
import PhoneMockup from "../hero/PhoneMockup";
import ECGAnimation from "../hero/ECGAnimation";
import FloatingParticles from "../hero/FloatingParticles";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-gradient-to-br from-white via-[#F8FCFC] to-[#EDF9F8]"
    >
      <FloatingParticles />

      {/* Background Glows */}

      <div className="absolute -left-48 top-0 w-[700px] h-[700px] rounded-full bg-teal-200/20 blur-[140px]" />
      <div className="absolute -right-48 top-0 w-[700px] h-[700px] rounded-full bg-cyan-200/20 blur-[140px]" />
      <div className="absolute right-40 top-32 w-[400px] h-[400px] rounded-full bg-teal-300/10 blur-[120px]" />
      <div className="absolute left-20 bottom-20 w-[300px] h-[300px] rounded-full bg-cyan-200/10 blur-[100px]" />

      {/* Main Container */}

      <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-20 pt-12 lg:pt-16 pb-10">
        <div className="grid lg:grid-cols-[42%_58%] gap-12 lg:gap-8 items-center">

          {/* LEFT SIDE */}

          <div>
            <div className="inline-flex items-center gap-2 bg-teal-50 border border-teal-100 text-teal-700 px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold shadow-sm">
              ● Connected Care • Real-Time Insight
            </div>

            <h1 className="mt-6 lg:mt-7 text-[38px] leading-[44px] sm:text-[52px] sm:leading-[58px] lg:text-[72px] lg:leading-[78px] font-extrabold tracking-[-2px] text-slate-900">
              Smarter Hospital
              <br />
              Monitoring for
              <br />
              <span className="bg-gradient-to-r from-teal-600 via-cyan-500 to-blue-500 bg-clip-text text-transparent">
                Better Outcomes
              </span>
            </h1>

            <p className="mt-6 lg:mt-7 text-base sm:text-lg lg:text-[20px] lg:leading-10 text-slate-600 max-w-2xl">
              PulseGrid empowers doctors, nurses, administrators and
              patients with real-time monitoring, AI-powered clinical
              insights, intelligent alerts and recovery analytics.
            </p>

            {/* CTA */}

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 mt-8 lg:mt-10">
              <button
                className="
                px-8 py-4 rounded-xl
                bg-gradient-to-r
                from-teal-500
                to-blue-600
                text-white
                font-semibold
                shadow-lg
                hover:scale-105
                hover:-translate-y-1
                hover:shadow-[0_15px_40px_rgba(20,184,166,0.35)]
                transition-all duration-300
                "
              >
                Request Demo →
              </button>

              <button
                className="
                px-8 py-4 rounded-xl
                border border-teal-300
                text-teal-700
                font-semibold
                hover:bg-teal-500
                hover:text-white
                hover:border-teal-500
                hover:scale-105
                transition-all duration-300
                "
              >
                Explore Features
              </button>
            </div>

            {/* TRUSTED USERS */}

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5 mt-8 lg:mt-10">
              <div className="flex -space-x-3">
                <img
                  src="https://i.pravatar.cc/100?img=11"
                  alt=""
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white shadow-md"
                />

                <img
                  src="https://i.pravatar.cc/100?img=12"
                  alt=""
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white shadow-md"
                />

                <img
                  src="https://i.pravatar.cc/100?img=13"
                  alt=""
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white shadow-md"
                />

                <img
                  src="https://i.pravatar.cc/100?img=18"
                  alt=""
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white shadow-md"
                />
              </div>

              <div>
                <p className="font-semibold text-slate-800 text-sm sm:text-base">
                  Trusted by 1000+ Healthcare Professionals
                </p>

                <p className="text-xs sm:text-sm text-slate-500">
                  Doctors • Nurses • Hospitals • Clinics
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}

          <div className="relative h-[360px] sm:h-[500px] lg:h-[650px] flex items-center justify-center overflow-visible">
            <ECGAnimation />

            {/* Dashboard Glow */}

            <div className="absolute w-[280px] sm:w-[450px] lg:w-[700px] h-[180px] sm:h-[260px] lg:h-[400px] bg-teal-400/20 blur-[120px] rounded-full" />

            {/* Dashboard */}

            <div
              className="
              relative
              z-20
              scale-[0.65]
              sm:scale-[0.8]
              lg:scale-[0.92]
              xl:scale-100
              animate-[float_6s_ease-in-out_infinite]
              "
            >
              <DashboardMockup />
            </div>

            {/* Phone */}

            <div
              className="
              hidden
              lg:block
              absolute
              right-[-20px]
              xl:right-[40px]
              top-[20px]
              z-30
              rotate-[4deg]
              animate-[phoneFloat_6s_ease-in-out_infinite]
              "
            >
              <PhoneMockup />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}