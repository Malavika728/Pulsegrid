"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { Search, Trash2, Upload, FileText, Check, AlertCircle } from "lucide-react";

type LabTestItem = {
  id: string;
  name: string;
  status: string; // "Pending" | "Uploaded"
  pdfFilename?: string | null;
  pdfData?: string | null;
};

type Patient = {
  id: string;
  name: string;
  ward: string;
  age: number;
  labTest?: string;
  labTests?: LabTestItem[];
  status?: string;
  labReportPdf?: string;
  hospitalCode?: string;
};

const initialPatients: Patient[] = [
  {
    id: "P-1043",
    name: "Arjun Sharma",
    ward: "ICU-A",
    age: 64,
    labTest: "CBC, Lipid Panel",
    labTests: [
      { id: "LT-1", name: "CBC", status: "Pending", pdfFilename: null },
      { id: "LT-2", name: "Lipid Panel", status: "Pending", pdfFilename: null },
    ],
  },
  {
    id: "P-1044",
    name: "Meera Iyer",
    ward: "ICU-A",
    age: 71,
    labTest: "CRP, ECG Study",
    labTests: [
      { id: "LT-3", name: "CRP", status: "Pending", pdfFilename: null },
      { id: "LT-4", name: "ECG Study", status: "Pending", pdfFilename: null },
    ],
  },
  {
    id: "P-1045",
    name: "Vikram Reddy",
    ward: "ICU-B",
    age: 58,
    labTest: "Urinalysis",
    labTests: [
      { id: "LT-5", name: "Urinalysis", status: "Pending", pdfFilename: null },
    ],
  },
];

export default function LabPatientsPage() {
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Upload modal states
  const [activePatient, setActivePatient] = useState<Patient | null>(null);
  const [activeTest, setActiveTest] = useState<LabTestItem | null>(null);
  const [selectedFilename, setSelectedFilename] = useState("");
  const [selectedFileData, setSelectedFileData] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchPatients = () => {
    const localUser = JSON.parse(localStorage.getItem("pulsegrid_user") || "{}");
    const hCode = localUser.hospitalCode || "CITYHOSP01";
    fetch(`/api/doctor/patients?hospitalCode=${hCode}`)
      .then((res) => res.json())
      .then(setPatients)
      .catch(() => undefined);
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const openUploadModal = (patient: Patient, test: LabTestItem) => {
    setActivePatient(patient);
    setActiveTest(test);
    setSelectedFilename(
      test.pdfFilename ||
      `${test.name.toLowerCase().replace(/[^a-z0-9]/g, "_")}_report_${patient.id}.pdf`
    );
    setSelectedFileData(test.pdfData || null);
    setSuccessMsg("");
  };

  const handleUploadSubmit = async () => {
    if (!activePatient || !activeTest || !selectedFilename.trim()) return;
    setUploading(true);

    // Update the status of the specific test inside the patient's labTests array
    const updatedTests = (activePatient.labTests || []).map((t) =>
      t.id === activeTest.id
        ? { ...t, status: "Uploaded", pdfFilename: selectedFilename.trim(), pdfData: selectedFileData }
        : t
    );

    try {
      const response = await fetch(`/api/doctor/patients/${activePatient.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ labTests: updatedTests }),
      });

      if (response.ok) {
        setSuccessMsg("Report uploaded successfully!");
        fetchPatients();
        setTimeout(() => {
          setActivePatient(null);
          setActiveTest(null);
          setSuccessMsg("");
          setSelectedFilename("");
          setSelectedFileData(null);
        }, 1500);
      }
    } catch {
      // Error handling
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteReport = async (patient: Patient, test: LabTestItem) => {
    if (!confirm(`Are you sure you want to delete the report for ${test.name}?`)) {
      return;
    }

    // Reset the test status back to Pending
    const updatedTests = (patient.labTests || []).map((t) =>
      t.id === test.id
        ? { ...t, status: "Pending", pdfFilename: null, pdfData: null }
        : t
    );

    try {
      const response = await fetch(`/api/doctor/patients/${patient.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ labTests: updatedTests }),
      });

      if (response.ok) {
        fetchPatients();
      }
    } catch {
      // Error handling
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFilename(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setSelectedFileData(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredPatients = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return patients.filter((patient) => {
      const matchesSearch =
        !query ||
        patient.name.toLowerCase().includes(query) ||
        patient.id.toLowerCase().includes(query) ||
        patient.ward.toLowerCase().includes(query);

      const hasPendingTests = (patient.labTests || []).some((t) => t.status === "Pending");
      const hasUploadedTests = (patient.labTests || []).some((t) => t.status === "Uploaded");

      const matchesStatus =
        statusFilter === "All"
          ? true
          : statusFilter === "Pending"
            ? hasPendingTests
            : statusFilter === "Uploaded"
              ? hasUploadedTests
              : true;

      return matchesSearch && matchesStatus;
    });
  }, [patients, searchQuery, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h1 className="text-3xl font-bold">
          Patients Registry
        </h1>

        <p className="text-slate-500 mt-1">
          City General Hospital (Lab Portal)
        </p>

        <div className="relative mt-6">
          <Search
            size={18}
            className="absolute left-4 top-4 text-slate-400"
          />

          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search patient by name, ID, or ward..."
            className="w-full border border-slate-200 rounded-xl pl-12 pr-4 py-3 outline-none transition focus:border-teal-200 focus:bg-slate-50"
          />
        </div>

        <div className="flex gap-3 mt-5 flex-wrap">
          {[
            "All",
            "Pending",
            "Uploaded",
          ].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setStatusFilter(item)}
              className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
                statusFilter === item
                  ? "border-teal-600 bg-teal-600 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:border-teal-200 hover:bg-teal-50"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3 text-sm text-slate-500">
        Showing {filteredPatients.length} patient{filteredPatients.length === 1 ? "" : "s"} matching your current search and filters.
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 mt-6 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr className="text-left text-xs uppercase tracking-wider text-slate-400 font-bold border-b border-slate-100">
              <th className="p-4 pl-6">Patient</th>
              <th className="p-4">Ward</th>
              <th className="p-4">Age</th>
              <th className="p-4">Assigned Tests & PDF Reports</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-sm">
            {filteredPatients.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                  No patients match the current search.
                </td>
              </tr>
            ) : (
              filteredPatients.map((patient) => (
                <tr
                  key={patient.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="p-4 pl-6">
                    <div className="font-semibold text-slate-900">
                      {patient.name}
                    </div>
                    <div className="text-xs text-slate-400 font-mono">
                      {patient.id}
                    </div>
                  </td>

                  <td className="text-slate-600 font-medium p-4">{patient.ward}</td>

                  <td className="text-slate-600 font-medium p-4">{patient.age}</td>

                  <td className="p-4">
                    {patient.labTests && patient.labTests.length > 0 ? (
                      <div className="space-y-3 max-w-2xl">
                        {patient.labTests.map((test) => (
                          <div
                            key={test.id}
                            className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs"
                          >
                            <div className="flex items-center gap-3">
                              <span className="font-bold text-slate-700 text-sm">{test.name}</span>
                              {test.status === "Uploaded" ? (
                                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-full font-bold">
                                  <span>📄</span> {test.pdfFilename}
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded-full font-bold">
                                  Pending PDF
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              {test.status === "Uploaded" ? (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteReport(patient, test)}
                                  className="bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 p-1.5 rounded-xl border border-rose-100 transition shadow-sm font-semibold flex items-center gap-1"
                                  title="Delete Report"
                                >
                                  <Trash2 size={13} />
                                  <span>Delete</span>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => openUploadModal(patient, test)}
                                  className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:scale-[1.02] active:scale-[0.98] text-white px-3.5 py-1.5 rounded-xl font-bold transition shadow-sm flex items-center gap-1"
                                >
                                  <Upload size={13} />
                                  <span>Upload PDF</span>
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">No assigned tests</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Upload Modal */}
      {activePatient && activeTest && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden transform scale-100 transition-all animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-teal-600 to-cyan-500 p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">Upload Lab Report</h3>
                <p className="text-teal-100 text-xs mt-1">Patient: {activePatient.name} ({activePatient.id})</p>
              </div>
              <button
                onClick={() => {
                  setActivePatient(null);
                  setActiveTest(null);
                }}
                className="bg-white/10 hover:bg-white/20 text-white rounded-xl p-2 transition w-8 h-8 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8 space-y-6">
              {successMsg ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 text-2xl font-bold shadow-md">
                    ✓
                  </div>
                  <h4 className="text-lg font-bold text-slate-800">{successMsg}</h4>
                  <p className="text-sm text-slate-500">Refreshing diagnostics queue...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Selected Test</label>
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm text-slate-800">
                      {activeTest.name}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Filename</label>
                    <input
                      type="text"
                      value={selectedFilename}
                      onChange={(e) => setSelectedFilename(e.target.value)}
                      placeholder="report_name.pdf"
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-teal-500 font-medium text-sm"
                    />
                  </div>

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center bg-slate-50/50 hover:bg-slate-50 transition cursor-pointer"
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept=".pdf"
                      className="hidden"
                    />
                    <span className="text-4xl block mb-2">📄</span>
                    <p className="text-sm font-semibold text-slate-700">Drag & drop report PDF here</p>
                    <p className="text-xs text-slate-400 mt-1">or click to browse local laboratory files</p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            {!successMsg && (
              <div className="bg-slate-50 p-6 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setActivePatient(null);
                    setActiveTest(null);
                  }}
                  className="bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-medium text-sm transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUploadSubmit}
                  disabled={uploading || !selectedFilename.trim()}
                  className="bg-gradient-to-r from-teal-600 to-cyan-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md hover:scale-[1.02] active:scale-[0.98] transition disabled:opacity-50"
                >
                  {uploading ? "Uploading..." : "Submit Report"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
