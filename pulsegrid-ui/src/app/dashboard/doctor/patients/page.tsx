"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, Plus, Trash2, CheckCircle2, AlertCircle, FileText, Download, X } from "lucide-react";

type LabTestItem = {
  id: string;
  name: string;
  status: "Pending" | "Uploaded";
  pdfFilename: string | null;
  pdfData: string | null;
};

type Patient = {
  id: string;
  name: string;
  ward: string;
  age: number;
  labTest?: string;
  labTests?: LabTestItem[];
  hospitalCode?: string;
};

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Modal states
  const [managePatient, setManagePatient] = useState<Patient | null>(null);
  const [manageTests, setManageTests] = useState<Omit<LabTestItem, "pdfFilename" | "pdfData">[]>([]);
  const [reviewPatient, setReviewPatient] = useState<Patient | null>(null);
  const [selectedReportTest, setSelectedReportTest] = useState<LabTestItem | null>(null);

  const fetchPatients = () => {
    fetch("/api/doctor/patients")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPatients(data);
        }
      })
      .catch(() => undefined);
  };

  useEffect(() => {
    fetchPatients();
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const filter = params.get("filter");
      if (filter === "Pending" || filter === "Uploaded" || filter === "All") {
        setStatusFilter(filter);
      }
    }
  }, []);

  const filteredPatients = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return patients.filter((patient) => {
      const matchesSearch =
        !query ||
        patient.name.toLowerCase().includes(query) ||
        patient.id.toLowerCase().includes(query) ||
        patient.ward.toLowerCase().includes(query);

      const tests = patient.labTests || [];
      const hasPending = tests.some((t) => t.status === "Pending");
      const hasUploaded = tests.some((t) => t.status === "Uploaded");

      const matchesStatus =
        statusFilter === "All"
          ? true
          : statusFilter === "Pending"
            ? hasPending
            : statusFilter === "Uploaded"
              ? hasUploaded
              : true;

      return matchesSearch && matchesStatus;
    });
  }, [patients, searchQuery, statusFilter]);

  // Handle lab test management open
  const openManageLabTests = (patient: Patient) => {
    setManagePatient(patient);
    // Deep copy current tests without files
    const currentTests = (patient.labTests || []).map((t) => ({
      id: t.id,
      name: t.name,
      status: t.status,
    }));
    setManageTests(currentTests);
  };

  // Add new test item to form
  const addTestFormItem = () => {
    if (!managePatient) return;
    setManageTests([
      ...manageTests,
      {
        id: `LT-${managePatient.id}-${Date.now()}`,
        name: "",
        status: "Pending",
      },
    ]);
  };

  // Remove test item from form
  const removeTestFormItem = (id: string) => {
    setManageTests(manageTests.filter((t) => t.id !== id));
  };

  // Update test name in form
  const updateTestFormItemName = (id: string, name: string) => {
    setManageTests(
      manageTests.map((t) => (t.id === id ? { ...t, name } : t))
    );
  };

  // Save lab tests back to patient
  const saveLabTests = async () => {
    if (!managePatient) return;

    // Merge form changes with original test files (preserve uploaded reports)
    const updatedTests: LabTestItem[] = manageTests.map((formTest) => {
      const original = (managePatient.labTests || []).find((t) => t.id === formTest.id);
      return {
        id: formTest.id,
        name: formTest.name,
        status: original ? original.status : "Pending",
        pdfFilename: original ? original.pdfFilename : null,
        pdfData: original ? original.pdfData : null,
      };
    });

    const description = updatedTests.map((t) => t.name).join(", ") || "None";

    try {
      const res = await fetch(`/api/doctor/patients/${managePatient.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          labTest: description,
          labTests: updatedTests,
        }),
      });

      if (res.ok) {
        setManagePatient(null);
        fetchPatients();
      }
    } catch {}
  };

  // Review Pathology report
  const openReviewReport = (patient: Patient) => {
    setReviewPatient(patient);
    const uploaded = (patient.labTests || []).filter((t) => t.status === "Uploaded");
    if (uploaded.length > 0) {
      setSelectedReportTest(uploaded[0]);
    } else {
      setSelectedReportTest(null);
    }
  };

  const downloadReportPdf = (test: LabTestItem) => {
    if (!test.pdfData) return;
    const link = document.createElement("a");
    link.href = test.pdfData;
    link.download = `${test.name}_Report_${reviewPatient?.name || "Patient"}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Panel */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">Patients Registry</h1>
        <p className="text-slate-500 mt-1 text-sm font-medium">City General Hospital Panel</p>

        <div className="relative mt-6">
          <Search size={18} className="absolute left-4 top-4 text-slate-400" />
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search patient by name, ID, or ward..."
            className="w-full border border-slate-200 rounded-2xl pl-12 pr-4 py-3 outline-none transition focus:border-teal-500 focus:bg-slate-50/50 text-slate-800 text-sm font-medium"
          />
        </div>

        <div className="flex gap-2.5 mt-5 flex-wrap">
          {["All", "Pending", "Uploaded"].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setStatusFilter(item)}
              className={`rounded-xl px-5 py-2 text-xs font-semibold tracking-wide uppercase transition ${
                statusFilter === item
                  ? "bg-teal-600 text-white shadow-md shadow-teal-600/10"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-teal-500 hover:text-teal-600"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="text-xs text-slate-500 font-semibold px-2">
        Showing {filteredPatients.length} patient{filteredPatients.length === 1 ? "" : "s"} matching filters.
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wider text-left">
                <th className="p-5">Patient Name</th>
                <th>Ward Location</th>
                <th>Age</th>
                <th>Assigned Lab Tests</th>
                <th className="text-right p-5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-slate-400 font-semibold">
                    No patients match the current search filters.
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => {
                  const tests = patient.labTests || [];
                  const hasUploaded = tests.some((t) => t.status === "Uploaded");

                  return (
                    <tr key={patient.id} className="hover:bg-slate-50/40 transition">
                      <td className="p-5">
                        <div className="font-bold text-slate-900">{patient.name}</div>
                        <div className="text-xs text-slate-400 font-bold mt-0.5">{patient.id}</div>
                      </td>
                      <td className="text-slate-600">{patient.ward}</td>
                      <td className="text-slate-600">{patient.age}</td>
                      <td>
                        <div className="flex flex-wrap gap-1.5 max-w-md">
                          {tests.length === 0 ? (
                            <span className="text-xs text-slate-400 font-semibold bg-slate-100 px-2.5 py-1 rounded-lg">
                              No tests assigned
                            </span>
                          ) : (
                            tests.map((test) => (
                              <span
                                key={test.id}
                                className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg ${
                                  test.status === "Uploaded"
                                    ? "bg-teal-50 text-teal-700 border border-teal-100"
                                    : "bg-amber-50 text-amber-700 border border-amber-100"
                                }`}
                              >
                                {test.name}
                                {test.status === "Uploaded" ? (
                                  <CheckCircle2 size={10} className="text-teal-600" />
                                ) : (
                                  <AlertCircle size={10} className="text-amber-500" />
                                )}
                              </span>
                            ))
                          )}
                        </div>
                      </td>
                      <td className="p-5 text-right space-x-2">
                        <button
                          onClick={() => openManageLabTests(patient)}
                          className="px-3.5 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-teal-50 hover:text-teal-700 transition text-xs font-bold"
                        >
                          Manage Tests
                        </button>

                        {hasUploaded && (
                          <button
                            onClick={() => openReviewReport(patient)}
                            className="px-3.5 py-2 rounded-xl bg-teal-50 text-teal-700 hover:bg-teal-100 transition text-xs font-bold"
                          >
                            Review Reports
                          </button>
                        )}

                        <Link href={`/dashboard/doctor/patients/${patient.id}`}>
                          <span className="inline-block px-3.5 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition text-xs font-bold">
                            Vitals Stream
                          </span>
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: Manage Lab Tests */}
      {managePatient && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 p-6 space-y-6 animate-scale-in">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-950">Manage Lab Tests</h2>
                <p className="text-xs text-slate-400 font-bold mt-0.5">
                  Patient: {managePatient.name} ({managePatient.id})
                </p>
              </div>
              <button onClick={() => setManagePatient(null)} className="text-slate-400 hover:text-slate-900 p-1">
                <X size={20} />
              </button>
            </div>

            {/* Vitals Summary Auto-fill */}
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl text-xs font-bold text-slate-500">
              <div>
                <span className="text-slate-400 block uppercase tracking-wider text-[10px]">Ward</span>
                <span className="text-slate-800 font-bold text-sm mt-0.5 block">{managePatient.ward}</span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase tracking-wider text-[10px]">Age</span>
                <span className="text-slate-800 font-bold text-sm mt-0.5 block">{managePatient.age} Years</span>
              </div>
            </div>

            {/* Tests input list */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Tests Assigned</label>

              {manageTests.length === 0 ? (
                <p className="text-sm text-slate-400 font-semibold py-4 text-center">
                  No tests currently assigned to this patient.
                </p>
              ) : (
                manageTests.map((test) => (
                  <div key={test.id} className="flex gap-2 items-center bg-white border border-slate-100 rounded-xl p-2.5 shadow-sm">
                    <input
                      type="text"
                      value={test.name}
                      onChange={(e) => updateTestFormItemName(test.id, e.target.value)}
                      placeholder="e.g. CBC, CRP, ECG Study"
                      className="flex-1 text-sm text-slate-800 font-semibold px-2 py-1 outline-none focus:border-teal-500"
                    />
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        test.status === "Uploaded" ? "bg-teal-50 text-teal-700" : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {test.status}
                    </span>
                    <button
                      onClick={() => removeTestFormItem(test.id)}
                      className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={addTestFormItem}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed border-slate-200 text-slate-500 hover:text-teal-600 hover:border-teal-600 transition font-bold text-sm"
            >
              <Plus size={16} />
              <span>Add Another Lab Test</span>
            </button>

            <div className="flex gap-3 pt-4 border-t border-slate-100 justify-end">
              <button
                onClick={() => setManagePatient(null)}
                className="px-5 py-3 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-sm transition"
              >
                Cancel
              </button>
              <button
                onClick={saveLabTests}
                className="px-6 py-3 rounded-2xl bg-teal-600 text-white hover:bg-teal-700 shadow-md shadow-teal-600/10 font-bold text-sm transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Review Pathology Report */}
      {reviewPatient && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl border border-slate-100 p-6 space-y-5 animate-scale-in">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-950">Pathology Report Review</h2>
                <p className="text-xs text-slate-400 font-bold mt-0.5">
                  Patient: {reviewPatient.name} | Ward: {reviewPatient.ward}
                </p>
              </div>
              <button onClick={() => setReviewPatient(null)} className="text-slate-400 hover:text-slate-900 p-1">
                <X size={20} />
              </button>
            </div>

            {/* Test Picker */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Select Report:</span>
              <div className="flex gap-2 flex-wrap">
                {(reviewPatient.labTests || [])
                  .filter((t) => t.status === "Uploaded")
                  .map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedReportTest(t)}
                      className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
                        selectedReportTest?.id === t.id
                          ? "bg-slate-900 text-white shadow-sm"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {t.name}
                    </button>
                  ))}
              </div>
            </div>

            {/* PDF Viewer */}
            <div className="border border-slate-100 rounded-3xl overflow-hidden bg-slate-50 h-[500px] flex items-center justify-center">
              {selectedReportTest ? (
                selectedReportTest.pdfData ? (
                  <iframe
                    src={selectedReportTest.pdfData}
                    className="w-full h-full border-none"
                    title="Pathology Report PDF"
                  />
                ) : (
                  <div className="text-center space-y-4 max-w-md p-6">
                    <FileText size={48} className="text-slate-300 mx-auto" />
                    <h3 className="text-base font-bold text-slate-800">Legacy Parameter Table</h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                      This report was uploaded with parameters but lacks a PDF file. Rendered telemetry data is shown instead.
                    </p>
                  </div>
                )
              ) : (
                <p className="text-sm text-slate-400 font-bold">No uploaded tests found.</p>
              )}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
              <div>
                {selectedReportTest && (
                  <span className="text-xs text-slate-400 font-bold">
                    Filename: <span className="text-slate-800 font-semibold">{selectedReportTest.pdfFilename || `${selectedReportTest.name}_Report.pdf`}</span>
                  </span>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setReviewPatient(null)}
                  className="px-5 py-3 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-sm transition"
                >
                  Close
                </button>
                {selectedReportTest?.pdfData && (
                  <button
                    onClick={() => downloadReportPdf(selectedReportTest)}
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-teal-600 text-white hover:bg-teal-700 shadow-md shadow-teal-600/10 font-bold text-sm transition"
                  >
                    <Download size={16} />
                    <span>Download PDF</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}