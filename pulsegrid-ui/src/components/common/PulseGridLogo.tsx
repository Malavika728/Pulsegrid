import { HeartPulse } from "lucide-react";

export default function PulseGridLogo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const iconSize = size === "sm" ? "h-6 w-6" : size === "lg" ? "h-10 w-10" : "h-8 w-8";
  const containerSize = size === "sm" ? "h-9 w-9 rounded-[10px]" : size === "lg" ? "h-14 w-14 rounded-[16px]" : "h-11 w-11 rounded-[12px]";
  const textSize = size === "sm" ? "text-base" : size === "lg" ? "text-2xl" : "text-xl";
  const subtextSize = size === "sm" ? "text-[10px]" : "text-xs";

  return (
    <div className="flex items-center gap-3">
      <div className={`flex items-center justify-center ${containerSize} bg-gradient-to-br from-teal-400 to-cyan-500 shadow-[0_4px_16px_rgba(20,184,166,0.3)]`}>
        <HeartPulse className={`${iconSize} text-white`} />
      </div>
      <div>
        <p className={`${textSize} font-bold text-slate-900 leading-tight`}>PulseGrid</p>
        <p className={`${subtextSize} text-slate-400`}>Hospital System</p>
      </div>
    </div>
  );
}
