"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, User, Beaker, FileText } from "lucide-react";

type LabTestItem = {
  id: string;
  name: string;
  status: string;
  pdfFilename?: string | null;
  pdfData?: string | null;
};

type Patient = {
  id: string;
  name: string;
  ward: string;
  age: number;
  labTests?: LabTestItem[];
};

export default function DoctorPatientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [resolvedId, setResolvedId] = useState<string>("");
  const [reviewingTest, setReviewingTest] = useState<LabTestItem | null>(null);

  useEffect(() => {
    params.then((p) => setResolvedId(p.id));
  }, [params]);

  useEffect(() => {
    if (!resolvedId) return;
    fetch(`/api/doctor/patients/${resolvedId}`)
      .then((r) => r.json())
      .then(setPatient)
      .catch(() => undefined);
  }, [resolvedId]);

  if (!patient) return (
    <div className="flex items-center justify-center h-64 text-slate-400">Loading patient data…</div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/doctor/patients" className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition">
          <ArrowLeft className="h-4 w-4 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{patient.name}</h1>
          <p className="text-sm text-slate-500">{patient.id} · Ward {patient.ward} · Age {patient.age}</p>
        </div>
      </div>

      {/* Lab Tests */}
      <section className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
        <div className="flex items-center gap-2 mb-5">
          <Beaker className="h-5 w-5 text-teal-600" />
          <h2 className="text-lg font-semibold text-slate-900">Lab Tests</h2>
        </div>
        {(!patient.labTests || patient.labTests.length === 0) ? (
          <p className="text-slate-500 text-sm">No lab tests assigned yet.</p>
        ) : (
          <div className="space-y-3">
            {patient.labTests.map((test) => (
              <div key={test.id} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <div className={`h-2.5 w-2.5 rounded-full ${test.status === "Uploaded" ? "bg-emerald-500" : "bg-amber-400"}`} />
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{test.name}</p>
                    <p className="text-xs text-slate-400">{test.status}</p>
                  </div>
                </div>
                {test.status === "Uploaded" && test.pdfData && (
                  <button
                    onClick={() => setReviewingTest(test)}
                    className="flex items-center gap-1.5 rounded-xl bg-teal-600 px-3 py-2 text-xs font-semibold text-white hover:bg-teal-700 transition"
                  >
                    <FileText className="h-3.5 w-3.5" /> Review
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* PDF Review Modal */}
      {reviewingTest && reviewingTest.pdfData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative flex w-full max-w-4xl flex-col rounded-[28px] bg-white shadow-2xl" style={{ maxHeight: "90vh" }}>
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{reviewingTest.name} Report</h3>
                <p className="text-sm text-slate-500">{reviewingTest.pdfFilename}</p>
              </div>
              <button onClick={() => setReviewingTest(null)} className="h-9 w-9 flex items-center justify-center rounded-xl hover:bg-slate-100 transition text-slate-500 text-xl">&times;</button>
            </div>
            <div className="flex-1 overflow-hidden p-4">
              <iframe src={reviewingTest.pdfData} className="h-[65vh] w-full rounded-xl border border-slate-100" title="Lab Report PDF" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
