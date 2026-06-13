"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Edit2, Save } from "lucide-react";

export default function DoctorNotes() {
  const params = useParams<{ id: string }>();
  const patientId = params?.id || "default";

  const [userRole, setUserRole] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [assessment, setAssessment] = useState(
    "Patient is recovering well after surgery. Alert thresholds remain stable. Continue routine monitoring and encourage mobility progression."
  );
  const [followUp, setFollowUp] = useState(
    "Reassess temperature and pain response in 4 hours. Keep IV fluids conservative and confirm discharge readiness tomorrow morning."
  );
  const [updatedTime, setUpdatedTime] = useState("09:30 AM");

  useEffect(() => {
    const stored = localStorage.getItem("pulsegrid_user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUserRole(parsed.role);
      } catch {}
    }

    // Load persisted notes for this patient if they exist
    const savedNotes = localStorage.getItem(`pulsegrid_notes_${patientId}`);
    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes);
        setAssessment(parsedNotes.assessment || "");
        setFollowUp(parsedNotes.followUp || "");
        setUpdatedTime(parsedNotes.updatedTime || "09:30 AM");
      } catch {}
    }
  }, [patientId]);

  const isDoctor = userRole === "Doctor";

  const handleSave = () => {
    setIsEditing(false);
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setUpdatedTime(timeStr);

    localStorage.setItem(
      `pulsegrid_notes_${patientId}`,
      JSON.stringify({
        assessment,
        followUp,
        updatedTime: timeStr,
      })
    );
  };

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] lg:p-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Clinical notes</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">Doctor Notes</h2>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            Updated {updatedTime}
          </span>
          {isDoctor && (
            <button
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                isEditing
                  ? "bg-teal-600 text-white hover:bg-teal-700 shadow-md shadow-teal-600/10"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-teal-500 hover:text-teal-600"
              }`}
            >
              {isEditing ? (
                <>
                  <Save size={12} />
                  <span>Save Notes</span>
                </>
              ) : (
                <>
                  <Edit2 size={12} />
                  <span>Edit Notes</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {/* Assessment */}
        <article className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Assessment</p>
          {isEditing ? (
            <textarea
              value={assessment}
              onChange={(e) => setAssessment(e.target.value)}
              rows={3}
              className="mt-3 w-full border border-slate-200 rounded-xl p-3 outline-none focus:border-teal-500 bg-white text-sm text-slate-800 font-medium resize-none"
            />
          ) : (
            <p className="mt-2 text-sm text-slate-700 leading-relaxed font-semibold">{assessment}</p>
          )}
        </article>

        {/* Follow-up Plan */}
        <article className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Follow-up plan</p>
          {isEditing ? (
            <textarea
              value={followUp}
              onChange={(e) => setFollowUp(e.target.value)}
              rows={3}
              className="mt-3 w-full border border-slate-200 rounded-xl p-3 outline-none focus:border-teal-500 bg-white text-sm text-slate-800 font-medium resize-none"
            />
          ) : (
            <p className="mt-2 text-sm text-slate-700 leading-relaxed font-semibold">{followUp}</p>
          )}
        </article>

        {/* AI Note (Read-Only) */}
        <article className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">AI note</p>
          <p className="mt-2 text-sm text-slate-700 leading-relaxed font-semibold">
            Recovery score is above ward average. Infection risk remains low, but monitor any sudden increase in respiratory rate.
          </p>
        </article>
      </div>
    </section>
  );
}
