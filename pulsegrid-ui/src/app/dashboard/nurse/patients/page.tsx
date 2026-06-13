"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

type LabTestItem = {
  id: string;
  name: string;
  status: string; // "Pending" | "Uploaded"
  pdfFilename?: string | null;
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

export default function NursePatientsPage() {
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

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
          City General Hospital (Nurse Portal)
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
              <th className="p-4 pr-6 text-right">Actions</th>
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

                  <td className="pr-6 text-right p-4">
                    <Link
                      href={`/dashboard/nurse/patients/${patient.id}`}
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
    </div>
  );
}
