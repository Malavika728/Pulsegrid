"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, Plus, Trash2, Eye, ClipboardList, Check, AlertCircle } from "lucide-react";

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

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Selection state for PDF review
  const [selectedReportPatient, setSelectedReportPatient] = useState<Patient | null>(null);
  const [selectedReportTest, setSelectedReportTest] = useState<LabTestItem | null>(null);

  // Manage tests modal states
  const [activeManagePatient, setActiveManagePatient] = useState<Patient | null>(null);
  const [testsList, setTestsList] = useState<LabTestItem[]>([]);
  const [newTestsInputs, setNewTestsInputs] = useState<string[]>([""]); // starts with one empty input field
  const [savingTests, setSavingTests] = useState(false);
  const [successToast, setSuccessToast] = useState("");

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

  const openManageTests = (patient: Patient) => {
    setActiveManagePatient(patient);
    setTestsList(patient.labTests || []);
    setNewTestsInputs([""]); // Reset new inputs to a single empty field
    setSuccessToast("");
  };

  const handleAddNewInputRow = () => {
    setNewTestsInputs((current) => [...current, ""]);
  };

  const handleNewInputChange = (index: number, val: string) => {
    setNewTestsInputs((current) =>
      current.map((item, idx) => (idx === index ? val : item))
    );
  };

  const handleRemoveNewInputRow = (index: number) => {
    setNewTestsInputs((current) => current.filter((_, idx) => idx !== index));
  };

  const handleDeleteExistingTest = (testId: string) => {
    setTestsList((current) => current.filter((t) => t.id !== testId));
  };

  const handleSaveLabTests = async () => {
    if (!activeManagePatient) return;
    setSavingTests(true);

    // Filter out empty input strings
    const freshNames = newTestsInputs.map((n) => n.trim()).filter((n) => n !== "");

    // Create fresh test objects
    const freshTests: LabTestItem[] = freshNames.map((name, idx) => ({
      id: "LT-" + Math.floor(1000 + Math.random() * 9000) + "-" + idx,
      name,
      status: "Pending",
      pdfFilename: null,
    }));

    // Merge non-deleted existing tests and fresh tests
    const finalTests = [...testsList, ...freshTests];

    try {
      const res = await fetch(`/api/doctor/patients/${activeManagePatient.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ labTests: finalTests }),
      });

      if (res.ok) {
        setSuccessToast("Lab tests updated successfully!");
        fetchPatients();
        setTimeout(() => {
          setSuccessToast("");
          setActiveManagePatient(null);
        }, 1500);
      }
    } catch {
      // Error handling
    } finally {
      setSavingTests(false);
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

      const matchesFilter =
        statusFilter === "All"
          ? true
          : statusFilter === "Pending"
            ? hasPendingTests
            : statusFilter === "Uploaded"
              ? hasUploadedTests
              : true;

      return matchesSearch && matchesFilter;
    });
  }, [patients, searchQuery, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h1 className="text-3xl font-bold">
          Patients Registry
        </h1>

        <p className="text-slate-500 mt-1">
          City General Hospital
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
              <th className="p-4">Assigned Lab Tests</th>
              <th className="p-4 pr-6 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-sm">
            {filteredPatients.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
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
                    <div className="flex flex-wrap gap-2 items-center">
                      {patient.labTests && patient.labTests.length > 0 ? (
                        patient.labTests.map((test) => (
                          <span
                            key={test.id}
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${
                              test.status === "Uploaded"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                : "bg-amber-50 text-amber-700 border-amber-100"
                            }`}
                          >
                            <span>{test.name}</span>
                            {test.status === "Uploaded" && (
                              <button
                                onClick={() => {
                                  setSelectedReportPatient(patient);
                                  setSelectedReportTest(test);
                                }}
                                className="text-[10px] text-teal-600 hover:text-teal-800 underline ml-1 font-semibold block"
                              >
                                View PDF
                              </button>
                            )}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400 italic">No tests assigned</span>
                      )}
                      
                      <button
                        type="button"
                        onClick={() => openManageTests(patient)}
                        className="text-xs text-teal-600 hover:text-teal-700 border border-teal-200 hover:bg-teal-50 px-2.5 py-1 rounded-xl font-bold transition flex items-center gap-1 shadow-sm"
                      >
                        <Plus size={12} /> Manage
                      </button>
                    </div>
                  </td>

                  <td className="pr-6 text-right p-4">
                    <Link
                      href={`/dashboard/doctor/patients/${patient.id}`}
                      className="text-teal-600 hover:text-teal-700 font-bold text-sm bg-slate-50 hover:bg-teal-50 px-3.5 py-2 rounded-xl transition"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Manage Lab Tests Modal */}
      {activeManagePatient && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden transform scale-100 transition-all animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-teal-600 to-cyan-500 p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">Manage Lab Tests</h3>
                <p className="text-teal-100 text-xs mt-1">Patient: {activeManagePatient.name} ({activeManagePatient.id}) • Age: {activeManagePatient.age} • Ward: {activeManagePatient.ward}</p>
              </div>
              <button
                onClick={() => setActiveManagePatient(null)}
                className="bg-white/10 hover:bg-white/20 text-white rounded-xl p-2 transition w-8 h-8 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8 space-y-6 max-h-[500px] overflow-y-auto">
              {successToast ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 text-2xl font-bold shadow-md">
                    ✓
                  </div>
                  <h4 className="text-lg font-bold text-slate-800">{successToast}</h4>
                  <p className="text-sm text-slate-500">Updating medical registry...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* List of existing tests */}
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">Currently Assigned Tests</label>
                    {testsList.length === 0 ? (
                      <div className="text-slate-400 text-sm italic py-2">No active tests assigned.</div>
                    ) : (
                      <div className="space-y-3">
                        {testsList.map((test) => (
                          <div
                            key={test.id}
                            className="flex justify-between items-center bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-medium"
                          >
                            <div className="flex items-center gap-3">
                              <span className="font-semibold text-slate-700">{test.name}</span>
                              <span
                                className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                  test.status === "Uploaded"
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                    : "bg-amber-50 text-amber-700 border-amber-100"
                                }`}
                              >
                                {test.status === "Uploaded" ? "Report Uploaded" : "Pending Report"}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              {test.status === "Uploaded" && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedReportPatient(activeManagePatient);
                                    setSelectedReportTest(test);
                                  }}
                                  className="text-teal-600 hover:text-teal-700 text-xs font-bold flex items-center gap-1"
                                >
                                  <Eye size={14} /> Review PDF
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleDeleteExistingTest(test.id)}
                                className="text-rose-600 hover:text-rose-700 p-1 rounded-lg hover:bg-rose-50 transition"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Inputs to add new tests */}
                  <div className="border-t border-slate-100 pt-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Assign New Tests</label>
                      <button
                        type="button"
                        onClick={handleAddNewInputRow}
                        className="text-xs text-teal-600 hover:text-teal-700 font-bold flex items-center gap-1"
                      >
                        <Plus size={14} /> Add test row
                      </button>
                    </div>

                    <div className="space-y-3">
                      {newTestsInputs.map((inputVal, idx) => (
                        <div key={idx} className="flex gap-3 items-center">
                          <span className="text-xs font-bold text-slate-400 w-16">Lab {idx + 1}</span>
                          <input
                            type="text"
                            value={inputVal}
                            onChange={(e) => handleNewInputChange(idx, e.target.value)}
                            placeholder="e.g. CRP, Blood Count, ECG"
                            className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-teal-500 text-sm font-medium"
                          />
                          {newTestsInputs.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveNewInputRow(idx)}
                              className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg transition"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            {!successToast && (
              <div className="bg-slate-50 p-6 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveManagePatient(null)}
                  className="bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-medium text-sm transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveLabTests}
                  disabled={savingTests}
                  className="bg-gradient-to-r from-teal-600 to-cyan-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md hover:scale-[1.02] active:scale-[0.98] transition disabled:opacity-50"
                >
                  {savingTests ? "Saving..." : "Save Assignments"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Review Modal */}
      {selectedReportPatient && selectedReportTest && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden transform scale-100 transition-all animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-teal-600 to-cyan-500 p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">Pathology Report Review</h3>
                <p className="text-teal-100 text-xs mt-1">Patient ID: {selectedReportPatient.id} • {selectedReportPatient.name}</p>
              </div>
              <button
                onClick={() => {
                  setSelectedReportPatient(null);
                  setSelectedReportTest(null);
                }}
                className="bg-white/10 hover:bg-white/20 text-white rounded-xl p-2 transition w-8 h-8 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8 space-y-6">
              {/* Report Meta Info */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-sm">
                <div>
                  <span className="text-slate-400 block text-xs">File Name</span>
                  <span className="font-semibold text-slate-700 truncate block">
                    📄 {selectedReportTest.pdfFilename}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-xs">Clinical Test</span>
                  <span className="font-semibold text-slate-700 block">
                    {selectedReportTest.name}
                  </span>
                </div>
              </div>

              {/* Simulated PDF Preview or Real PDF Iframe */}
              {selectedReportTest.pdfData ? (
                <div className="border border-slate-200 rounded-2xl overflow-hidden h-[500px] shadow-inner bg-slate-100 flex items-center justify-center">
                  <iframe
                    src={selectedReportTest.pdfData}
                    className="w-full h-full border-none"
                    title="Lab Report PDF"
                  />
                </div>
              ) : (
                <div className="border border-slate-200 rounded-2xl p-6 bg-[#FDFDFD] font-mono text-xs space-y-4 shadow-inner">
                  <div className="border-b-2 border-slate-800 pb-3 text-center">
                    <h4 className="font-extrabold text-base text-slate-800 tracking-wider">PulseGrid Diagnostics Lab</h4>
                    <p className="text-[10px] text-slate-500 font-sans mt-0.5">Clinical Pathology & Hematology Report</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-slate-600 border-b border-slate-200 pb-3">
                    <div>Patient: <span className="font-bold text-slate-800">{selectedReportPatient.name}</span></div>
                    <div>Age/Sex: <span className="font-bold text-slate-800">{selectedReportPatient.age} Y / M</span></div>
                    <div>Report Date: <span className="font-bold text-slate-800">{new Date().toLocaleDateString()}</span></div>
                    <div>Lab ID: <span className="font-bold text-slate-800">LAB-98013</span></div>
                  </div>

                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500">
                        <th className="py-1">TEST PARAMETER</th>
                        <th className="py-1 text-center">VALUE</th>
                        <th className="py-1 text-right">REFERENCE INTERVAL</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      <tr>
                        <td className="py-1.5 font-bold">WBC Count</td>
                        <td className="py-1.5 text-center">8.2 x10^3/uL</td>
                        <td className="py-1.5 text-right">4.5 - 11.0</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 font-bold">RBC Count</td>
                        <td className="py-1.5 text-center">4.7 x10^6/uL</td>
                        <td className="py-1.5 text-right">4.2 - 5.9</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 font-bold">Hemoglobin</td>
                        <td className="py-1.5 text-center">13.8 g/dL</td>
                        <td className="py-1.5 text-right">12.0 - 16.0</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 font-bold">Platelets</td>
                        <td className="py-1.5 text-center">265 x10^3/uL</td>
                        <td className="py-1.5 text-right">150 - 450</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 font-bold text-rose-600">CRP Level (High)</td>
                        <td className="py-1.5 text-center font-bold text-rose-600">5.4 mg/L</td>
                        <td className="py-1.5 text-right">0.0 - 1.0</td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="border-t border-slate-200 pt-4 text-center text-[10px] text-slate-400 font-sans">
                    *** End of Report • Verified Electronically by Lab Technician Ravi Thomas ***
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 p-6 border-t border-slate-100 flex justify-between items-center">
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full inline-block animate-pulse"></span>
                Digitally Signed & Secured
              </span>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setSelectedReportPatient(null);
                    setSelectedReportTest(null);
                  }}
                  className="bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-medium text-sm transition hover:bg-slate-50"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    if (selectedReportTest.pdfData) {
                      const link = document.createElement("a");
                      link.href = selectedReportTest.pdfData;
                      link.download = selectedReportTest.pdfFilename || "report.pdf";
                      link.click();
                    } else {
                      alert("Simulating document download...");
                    }
                  }}
                  className="bg-gradient-to-r from-teal-600 to-cyan-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md hover:scale-[1.02] active:scale-[0.98] transition"
                >
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}