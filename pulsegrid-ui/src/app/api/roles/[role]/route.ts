import { NextResponse, type NextRequest } from "next/server";

const BACKEND =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://pulsegrid-production.up.railway.app";

// Static role metadata
const roleData = {
  doctor: {
    title: "Attending Cardiologist",
    summary: "Cardiac ICU round dashboard, patient telemetry streams, and lab coordination.",
    stats: [
      { label: "Patients", value: "3", detail: "In Cardiac ICU" },
      { label: "Active streams", value: "2", detail: "Telemetry online" },
      { label: "Open alerts", value: "1", detail: "Low SpO₂ alert" },
    ],
  },
  nurse: {
    title: "Nurse Portal",
    summary: "Ward rounds, bedside triage, and critical-care coordination.",
    stats: [
      { label: "Beds in care", value: "3", detail: "All stable" },
      { label: "Vital checks", value: "100%", detail: "Completed on time" },
      { label: "Pending tests", value: "2", detail: "Blood chemistry" },
    ],
  },
  patient: {
    title: "Patient Portal",
    summary: "Personal recovery view, medication reminders, and live monitoring status.",
    stats: [
      { label: "Recovery score", value: "92%", detail: "Improving trend" },
      { label: "Heart rate", value: "74 bpm", detail: "Stable" },
      { label: "SpO₂", value: "98%", detail: "Excellent oxygenation" },
    ],
  },
  lab: {
    title: "Lab Technician Portal",
    summary: "Diagnostics queue, test turnaround, and sample progress tracking.",
    stats: [
      { label: "Pending reports", value: "5", detail: "3 urgent cases" },
      { label: "Results uploaded", value: "0", detail: "All clear" },
      { label: "SLA compliance", value: "100%", detail: "On-time delivery" },
    ],
  },
  admin: {
    title: "Hospital Admin Portal",
    summary: "Hospital operations, staff scheduling, user accounts, and system health.",
    stats: [
      { label: "Doctors", value: "1", detail: "Registered" },
      { label: "Nurses", value: "1", detail: "On shift" },
      { label: "Patients", value: "4", detail: "Total in care" },
    ],
  },
};

const defaultIdentities: Record<string, any> = {
  doctor: { name: "Dr. Sarah Johnson", email: "doctor@pulsegrid.health", role: "Attending Cardiologist", specialtyOrDepartment: "Cardiology" },
  nurse: { name: "Nancy Wheeler", email: "nurse@pulsegrid.health", role: "Charge Nurse", specialtyOrDepartment: "Emergency Department" },
  patient: { name: "Arjun Sharma", email: "patient@pulsegrid.health", role: "Patient", specialtyOrDepartment: "General Ward" },
  lab: { name: "Ravi Thomas", email: "lab@pulsegrid.health", role: "Lab Analyst", specialtyOrDepartment: "Clinical Pathology" },
  admin: { name: "Jordan Lee", email: "hospital.admin@pulsegrid.health", role: "Hospital Operations Manager", specialtyOrDepartment: "Administration" },
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ role: string }> }
) {
  const { role } = await params;
  let normalized = role.toLowerCase();
  if (normalized === "hospital-admin" || normalized === "hospital_admin") normalized = "admin";
  if (normalized === "lab-tech" || normalized === "lab_tech") normalized = "lab";

  if (!roleData[normalized as keyof typeof roleData]) {
    return NextResponse.json({ error: "Role not found" }, { status: 404 });
  }

  const email = req.nextUrl.searchParams.get("email")?.trim().toLowerCase();
  const hospitalCode = req.nextUrl.searchParams.get("hospitalCode") || "CITYHOSP01";

  let identity: any = null;
  let stats = roleData[normalized as keyof typeof roleData].stats;

  // Fetch identity and stats from backend (not local filesystem)
  try {
    // Get users from backend to find the logged-in user's info
    if (email) {
      const usersRes = await fetch(
        `${BACKEND}/admin/users?hospitalCode=${encodeURIComponent(hospitalCode)}`,
        { cache: "no-store" }
      );
      if (usersRes.ok) {
        const users = await usersRes.json();
        if (Array.isArray(users)) {
          const found = users.find(
            (u: any) => u.email?.trim().toLowerCase() === email ||
                        u.email?.trim().toLowerCase() === email
          );
          if (found) {
            identity = {
              name: found.name,
              email: found.email,
              role: found.role,
              specialtyOrDepartment: found.specialtyOrDepartment || found.specialty_or_department,
              hospitalCode: found.hospitalCode || found.hospital_code,
            };
          }
          // Build live stats for admin role
          if (normalized === "admin") {
            const doctors = users.filter((u: any) => u.role === "Doctor").length;
            const nurses = users.filter((u: any) => u.role === "Nurse").length;
            const patients = users.filter((u: any) => u.role === "Patient").length;
            stats = [
              { label: "Doctors", value: String(doctors), detail: "Registered" },
              { label: "Nurses", value: String(nurses), detail: "On shift" },
              { label: "Patients", value: String(patients), detail: "Total in care" },
            ];
          }
        }
      }
    }

    // Get dashboard stats from backend
    if (normalized === "doctor" || normalized === "nurse") {
      const dashRes = await fetch(`${BACKEND}/dashboard/doctor`, { cache: "no-store" });
      if (dashRes.ok) {
        const data = await dashRes.json();
        stats = [
          { label: "Patients", value: String(data.totalPatients || 0), detail: "Active telemetry" },
          { label: "Monitoring active", value: String(data.activeMonitoring || 0), detail: "Bedside observation" },
          { label: "Open alerts", value: String(data.openAlerts || 0), detail: "Require attention" },
        ];
      }
    }
  } catch {
    // Backend not reachable — use defaults below
  }

  // Fall back to hardcoded identity if user not found in DB
  if (!identity) {
    identity = defaultIdentities[normalized] || defaultIdentities["doctor"];
  }

  const alerts = [
    { title: "Medication Scheduled", patient: identity?.name || "Patient", detail: "Morning dose of Aspirin (81mg) is due in 30 minutes." },
    { title: "Lab Request Received", patient: identity?.name || "Patient", detail: "Attending cardiologist assigned a new Blood Pathology panel." },
  ];

  const tasks = [
    "Confirm morning medication adherence",
    "Complete telemetry device calibration check",
    "Log daily vitals reading (blood pressure & temperature)",
  ];

  return NextResponse.json({
    title: roleData[normalized as keyof typeof roleData].title,
    summary: roleData[normalized as keyof typeof roleData].summary,
    stats,
    identity,
    alerts,
    tasks,
    notifications: [
      { source: "Hospital Ops", message: "PulseGrid platform online", priority: "Low" },
    ],
  });
}