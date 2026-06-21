"use client";

import {
  Heart,
  Activity,
  Thermometer,
  Wind,
} from "lucide-react";

type Props = {
  name: string;
  ward: string;
  bed: string;
  age: number;
  status: "Stable" | "Warning" | "Critical";
  heartRate: number;
  spo2: number;
  temperature: number;
  respiration: number;
  recovery: number;
};

export default function PatientCard({
  name,
  ward,
  bed,
  age,
  status,
  heartRate,
  spo2,
  temperature,
  respiration,
  recovery,
}: Props) {
  const borderColor =
    status === "Stable"
      ? "border-teal-500"
      : status === "Warning"
      ? "border-amber-500"
      : "border-red-500";

  const badgeColor =
    status === "Stable"
      ? "bg-teal-100 text-teal-700"
      : status === "Warning"
      ? "bg-amber-100 text-amber-700"
      : "bg-red-100 text-red-700";

  return (
    <div
      className={`bg-white border-t-4 ${borderColor}
      rounded-2xl lg:rounded-3xl shadow-sm hover:shadow-xl
      transition-all duration-300 p-4 sm:p-5 lg:p-6`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
        <div className="min-w-0">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 break-words">
            {name}
          </h3>

          <p className="text-sm sm:text-base text-slate-500 mt-1 break-words">
            {ward} • {bed} • {age} yrs
          </p>
        </div>

        <span
          className={`self-start px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap ${badgeColor}`}
        >
          {status}
        </span>
      </div>

      {/* Vitals */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-5 sm:mt-6">
        <VitalBox
          icon={<Heart size={18} />}
          label="HR"
          value={`${heartRate} bpm`}
        />

        <VitalBox
          icon={<Activity size={18} />}
          label="SpO₂"
          value={`${spo2}%`}
        />

        <VitalBox
          icon={<Wind size={18} />}
          label="RR"
          value={`${respiration}/min`}
        />

        <VitalBox
          icon={<Thermometer size={18} />}
          label="Temp"
          value={`${temperature}°C`}
        />
      </div>

      {/* Recovery */}
      <div className="mt-5 sm:mt-6">
        <div className="flex justify-between gap-2 mb-2">
          <span className="text-sm sm:text-base text-slate-500">
            Recovery Score
          </span>

          <span className="font-bold text-teal-600 text-sm sm:text-base">
            {recovery}%
          </span>
        </div>

        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full"
            style={{
              width: `${recovery}%`,
            }}
          />
        </div>
      </div>

      {/* Button */}
      <button
        className="w-full mt-5 sm:mt-6 py-3 rounded-xl
        bg-gradient-to-r from-teal-500 to-blue-600
        text-white font-semibold hover:scale-[1.02]
        transition text-sm sm:text-base"
      >
        View Patient
      </button>
    </div>
  );
}

function VitalBox({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-slate-50 rounded-xl p-3 sm:p-4 min-w-0">
      <div className="flex items-center gap-2 text-teal-600">
        {icon}

        <span className="text-xs sm:text-sm">
          {label}
        </span>
      </div>

      <p className="mt-2 font-bold text-slate-900 text-sm sm:text-base break-words">
        {value}
      </p>
    </div>
  );
}