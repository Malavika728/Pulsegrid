"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PatientHeader from "@/components/patient/PatientHeader";
import PatientStats from "@/components/patient/PatientStats";
import DiagnosisCard from "@/components/patient/DiagnosisCard";
import LiveVitals from "@/components/patient/LiveVitals";
import ECGMonitor from "@/components/patient/ECGMonitor";

import AIInsights from "@/components/patient/AIInsights";
import MedicationSchedule from "@/components/patient/MedicationSchedule";
import LabResults from "@/components/patient/LabResults";
import AlertTimeline from "@/components/patient/AlertTimeline";
import TrendCard from "@/components/patient/TrendCard";
import DoctorNotes from "@/components/patient/DoctorNotes";

export default function PatientProfilePage() {
  const params = useParams<{ id: string }>();
  const [patient, setPatient] = useState<any>(null);

  useEffect(() => {
    if (!params?.id) return;

    fetch(`/api/doctor/patients/${params.id}`)
      .then((res) => res.json())
      .then(setPatient)
      .catch(() => undefined);
  }, [params?.id]);

  return (
    <div className="space-y-6">
      <PatientHeader patient={patient} />
      <PatientStats patient={patient} />
      <ECGMonitor />
      <LiveVitals />

      <TrendCard />
      <DiagnosisCard patient={patient} />

      <AIInsights />

      <div className="grid gap-6 xl:grid-cols-2">
        <MedicationSchedule />
        <LabResults />
      </div>

      <AlertTimeline />
      <DoctorNotes />
    </div>
  );
}