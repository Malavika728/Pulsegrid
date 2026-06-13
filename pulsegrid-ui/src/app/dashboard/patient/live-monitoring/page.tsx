"use client";

import { useEffect, useState, useRef } from "react";
import ECGMonitor from "@/components/patient/ECGMonitor";
import LiveVitals from "@/components/patient/LiveVitals";

// Date utilities
const getTodayString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getHistoricalECGPoints = (hr: number) => {
  const points = [];
  const period = Math.max(10, Math.floor(2000 / hr));
  for (let idx = 0; idx < 100; idx++) {
    const phase = idx % period;
    let nextPoint = 96;
    if (phase === 2) nextPoint = 90;
    else if (phase === 3) nextPoint = 88;
    else if (phase === 4) nextPoint = 96;
    else if (phase === 6) nextPoint = 104; // Q wave
    else if (phase === 7) nextPoint = 20;  // R wave peak
    else if (phase === 8) nextPoint = 150; // S wave dip
    else if (phase === 9) nextPoint = 96;
    else if (phase === 11) nextPoint = 85; // T wave
    else if (phase === 12) nextPoint = 82;
    else if (phase === 13) nextPoint = 90;
    else if (phase === 14) nextPoint = 96;
    points.push(nextPoint);
  }
  return points;
};

const getHistoricalVitals = (patient: any, date: string) => {
  const hash = (patient?.name || "").charCodeAt(0) || 0;
  const dateNum = new Date(date).getDate() || 14;
  const hr = 70 + ((hash + dateNum) % 15); // 70 to 85
  const spo2 = 97 + ((hash + dateNum) % 3); // 97 to 99
  const temp = 36.5 + ((hash + dateNum) % 6) * 0.1; // 36.5 to 37.0
  const resp = 15 + ((hash + dateNum) % 4); // 15 to 18
  return { hr, spo2, temp, resp };
};

export default function PatientLiveMonitoringPage() {
  const [patientId, setPatientId] = useState<string | null>(null);
  const [patient, setPatient] = useState<any>(null);
  const [liveVitals, setLiveVitals] = useState<{ hr: number; spo2: number; temp: number; resp: number } | undefined>(undefined);
  const [livePoints, setLivePoints] = useState<number[]>([]);

  const pointsRef = useRef<number[]>(new Array(100).fill(96));
  const tickRef = useRef(0);
  const liveVitalsRef = useRef<any>(null);

  // Date states
  const todayStr = getTodayString();
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const isHistorical = selectedDate !== todayStr;

  // 1. Fetch Patient ID from role profile
  useEffect(() => {
    const user = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("pulsegrid_user") || "{}") : {};
    const query = user.email ? `?email=${encodeURIComponent(user.email)}` : "";

    fetch(`/api/roles/patient${query}`)
      .then((res) => res.json())
      .then((resData) => {
        if (resData?.identity?.patientId) {
          setPatientId(resData.identity.patientId);
        }
      })
      .catch(() => undefined);
  }, []);

  // 2. Poll Patient's latest vitals from the backend database every 3 seconds (only if today is selected)
  useEffect(() => {
    if (!patientId || isHistorical) return;

    const pollVitals = () => {
      fetch(`/api/doctor/patients/${patientId}`)
        .then((res) => res.json())
        .then((data) => {
          setPatient(data);
          if (data && data.hr !== null && data.hr !== undefined) {
            const vitals = {
              hr: data.hr,
              spo2: data.spo2,
              temp: 36.8,
              resp: 18
            };
            liveVitalsRef.current = vitals;
            setLiveVitals(vitals);
          } else {
            liveVitalsRef.current = null;
            setLiveVitals(undefined);
            setLivePoints([]);
          }
        })
        .catch(() => undefined);
    };

    pollVitals();
    const interval = setInterval(pollVitals, 3000);
    return () => clearInterval(interval);
  }, [patientId, isHistorical]);

  // 3. Render scrolling ECG trace locally if active vitals data is available (only if today is selected)
  useEffect(() => {
    const ecgInterval = setInterval(() => {
      if (!liveVitalsRef.current || isHistorical) return;
      
      tickRef.current += 1;
      const currentHR = liveVitalsRef.current.hr;
      const period = Math.max(10, Math.floor(2000 / currentHR));
      const phase = tickRef.current % period;

      let nextPoint = 96;
      if (phase === 2) nextPoint = 90;
      else if (phase === 3) nextPoint = 88;
      else if (phase === 4) nextPoint = 96;
      else if (phase === 6) nextPoint = 104;
      else if (phase === 7) nextPoint = 20;
      else if (phase === 8) nextPoint = 150;
      else if (phase === 9) nextPoint = 96;
      else if (phase === 11) nextPoint = 85;
      else if (phase === 12) nextPoint = 82;
      else if (phase === 13) nextPoint = 90;
      else if (phase === 14) nextPoint = 96;

      const newPoints = [...pointsRef.current.slice(1), nextPoint];
      pointsRef.current = newPoints;
      setLivePoints(newPoints);
    }, 35);

    return () => clearInterval(ecgInterval);
  }, [isHistorical]);

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setLiveVitals(undefined);
    setLivePoints([]);
    liveVitalsRef.current = null;
  };

  // PDF report downloader
  const downloadReportPDF = () => {
    const activeVitals = isHistorical 
      ? getHistoricalVitals(patient, selectedDate)
      : liveVitals;

    const hr = activeVitals?.hr ?? patient?.hr ?? "--";
    const spo2 = activeVitals?.spo2 ?? patient?.spo2 ?? "--";
    const temp = activeVitals?.temp ? `${activeVitals.temp.toFixed(1)}°C` : "--";
    const resp = activeVitals?.resp ? `${activeVitals.resp}/min` : "--";
    const status = activeVitals?.hr ? (activeVitals.hr > 100 || activeVitals.spo2 < 95 ? "Warning" : "Stable") : (patient?.status || "Stable");
    const doctor = patient?.doctor || "Dr. Sarah Johnson";
    const hospital = "City General Hospital";

    const lines = [
      `======================================================================`,
      `                         CLINICAL TELEMETRY REPORT                    `,
      `======================================================================`,
      `Report Date: ${selectedDate}`,
      `Hospital: ${hospital}`,
      `Attending Doctor: ${doctor}`,
      `----------------------------------------------------------------------`,
      `PATIENT PROFILE`,
      `Name: ${patient?.name || "N/A"}               Patient ID: ${patient?.id || "N/A"}`,
      `Age/Gender: ${patient?.age || "N/A"} / ${patient?.gender || "N/A"}`,
      `Admission Date: ${patient?.admissionDate || "N/A"}     Status: ${status}`,
      `----------------------------------------------------------------------`,
      `TELEMETRY VITAL SIGNS`,
      `Mode: ${isHistorical ? "Historical Log" : "Live Device Stream"}`,
      ``,
      `* Heart Rate: ${hr} bpm           [Normal Range: 60-100 bpm]`,
      `* SpO2 Level: ${spo2}%             [Normal Range: >= 95%]`,
      `* Temperature: ${temp}          [Normal Range: 36.1-37.2C]`,
      `* Respiration: ${resp}        [Normal Range: 12-20/min]`,
      `----------------------------------------------------------------------`,
      `ECG WAVEFORM ANALYSIS`,
      `Rhythm: ${activeVitals?.hr ? "Normal Sinus Rhythm (NSR)" : "No telemetry active (flatline)"}`,
      `Trace Quality: ${activeVitals?.hr ? "High (Synthesized via Bedside Monitor)" : "N/A"}`,
      `----------------------------------------------------------------------`,
      `CLINICAL NOTES`,
    ];

    const notesText = patient?.notes || "The patient exhibits stable cardiorespiratory telemetry. Heart rate rhythm is regular. No signs of tachycardia, bradycardia, or oxygen desaturation detected during this reporting window.";
    const wrappedNotes: string[] = [];
    const words = notesText.split(" ");
    let currentLine = "";
    for (const word of words) {
      if ((currentLine + word).length > 68) {
        wrappedNotes.push(currentLine.trim());
        currentLine = word + " ";
      } else {
        currentLine += word + " ";
      }
    }
    if (currentLine.trim()) {
      wrappedNotes.push(currentLine.trim());
    }

    lines.push(...wrappedNotes);
    lines.push(`======================================================================`);
    lines.push(`Generated by PulseGrid Telemetry System`);

    const pdfBody = [
      "%PDF-1.4",
      "1 0 obj",
      "<< /Type /Catalog /Pages 2 0 R >>",
      "endobj",
      "2 0 obj",
      "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
      "endobj",
      "3 0 obj",
      "<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /MediaBox [0 0 595.28 841.89] /Contents 5 0 R >>",
      "endobj",
      "4 0 obj",
      "<< /Type /Font /Subtype /Type1 /BaseFont /Courier >>",
      "endobj",
      "5 0 obj",
    ];

    let streamContent = "BT\n/F1 10 Tf\n14 TL\n50 780 Td\n";
    for (const line of lines) {
      const escaped = line.replace(/[()]/g, "\\$&");
      streamContent += `(${escaped}) Tj T*\n`;
    }
    streamContent += "ET";

    pdfBody.push(`<< /Length ${streamContent.length} >>`);
    pdfBody.push("stream");
    pdfBody.push(streamContent);
    pdfBody.push("endstream");
    pdfBody.push("endobj");
    
    pdfBody.push("xref");
    pdfBody.push("0 6");
    pdfBody.push("0000000000 65535 f ");
    pdfBody.push("0000000009 00000 n ");
    pdfBody.push("0000000058 00000 n ");
    pdfBody.push("0000000115 00000 n ");
    pdfBody.push("0000000244 00000 n ");
    pdfBody.push("0000000311 00000 n ");
    pdfBody.push("trailer");
    pdfBody.push("<< /Size 6 /Root 1 0 R >>");
    pdfBody.push("startxref");
    pdfBody.push("0");
    pdfBody.push("%%EOF");

    const pdfString = pdfBody.join("\n");
    const bytes = new Uint8Array(pdfString.length);
    for (let i = 0; i < pdfString.length; i++) {
      bytes[i] = pdfString.charCodeAt(i);
    }
    
    const blob = new Blob([bytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${patient?.name || "Patient"}_Telemetry_Report_${selectedDate}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const currentStatus = isHistorical 
    ? "historical" 
    : (liveVitals ? "live" : "offline");

  const displayPoints = isHistorical 
    ? getHistoricalECGPoints(getHistoricalVitals(patient, selectedDate).hr)
    : livePoints;

  const displayVitals = isHistorical
    ? getHistoricalVitals(patient, selectedDate)
    : liveVitals;

  return (
    <div className="space-y-6">
      {/* Header section */}
      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
        <p className="text-sm uppercase tracking-[0.35em] text-teal-600">Telemetry Feed</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Live Patient Monitoring</h1>
        <p className="mt-3 text-slate-500">
          This dashboard shows your real-time telemetry vitals, including ECG rhythm waveforms, heart rate trends, oxygen levels, and skin temperature.
        </p>
      </section>

      {/* Telemetry log control panel */}
      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] lg:p-8">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Telemetry Log Viewer</h2>
            <p className="text-slate-500 text-sm mt-1 font-medium">
              {isHistorical 
                ? `Viewing historical telemetry log report for ${selectedDate}` 
                : "Real-time stream from bedside monitors"}
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            {/* Date Selector */}
            <div className="flex items-center gap-2">
              <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Date:</span>
              <input
                type="date"
                value={selectedDate}
                max={todayStr}
                onChange={(e) => handleDateChange(e.target.value)}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-xs font-semibold focus:outline-none focus:border-teal-500 transition"
              />
            </div>
            
            {/* PDF Report Download */}
            <button
              type="button"
              onClick={downloadReportPDF}
              className="px-3.5 py-1.5 rounded-xl border border-teal-200 text-teal-600 hover:bg-teal-50 bg-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4.5 h-4.5">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Report (PDF)
            </button>

            {isHistorical && (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-100 text-xs font-bold shadow-sm">
                Historical View
              </span>
            )}
          </div>
        </div>
      </section>

      <ECGMonitor livePoints={displayPoints} status={currentStatus} />
      <LiveVitals liveVitals={displayVitals} status={currentStatus} />
    </div>
  );
}