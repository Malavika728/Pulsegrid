import { NextResponse, type NextRequest } from "next/server";

const BACKEND = "http://localhost:3001";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ role: string }> }
) {
  const { role } = await context.params;
  const email = req.nextUrl.searchParams.get("email") || "";

  try {
    const res = await fetch(`${BACKEND}/dashboard/${role}?email=${encodeURIComponent(email)}`, {
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error("Backend error");
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    // Return default fallback data based on role
    const defaults: Record<string, object> = {
      doctor: {
        title: "Doctor Dashboard",
        summary: "Manage your patients and lab results.",
        stats: [
          { label: "Total Patients", value: "24", detail: "Under your care" },
          { label: "Pending Tests", value: "7", detail: "Awaiting lab results" },
          { label: "Reports Ready", value: "17", detail: "Available to review" },
        ],
        alerts: [],
        tasks: ["Review morning lab reports", "Update patient records", "Ward rounds at 10 AM"],
        identity: { name: "Dr. Sarah Johnson", specialty: "Cardiologist", ward: "ICU-A" },
        activeUsers: [],
        notifications: [],
      },
      nurse: {
        title: "Nurse Dashboard",
        summary: "Ward rounds, bedside triage, and critical-care coordination.",
        stats: [
          { label: "Assigned Patients", value: "12", detail: "On your ward" },
          { label: "Medications Due", value: "4", detail: "Next 2 hours" },
          { label: "Vitals Pending", value: "3", detail: "To be recorded" },
        ],
        alerts: [
          { title: "Patient check required", patient: "Arjun Sharma P-1043", detail: "Vitals due in 30 minutes" },
        ],
        tasks: ["Morning vitals — Ward ICU-A", "Medication round at 09:00", "Wound dressing — Bed 4"],
        identity: { name: "Maya Patel", ward: "ICU-B", role: "Charge Nurse", email: "nurse@pulsegrid.health" },
        activeUsers: [],
        notifications: [],
      },
      lab: {
        title: "Lab Technician Dashboard",
        summary: "Upload patient lab report PDFs and manage pending tests.",
        stats: [
          { label: "Pending Reports", value: "5", detail: "To be uploaded" },
          { label: "Uploaded Today", value: "3", detail: "Completed" },
          { label: "Total Patients", value: "8", detail: "Assigned to you" },
        ],
        alerts: [],
        tasks: ["Upload CBC report for P-1043", "Complete Lipid Panel for P-1044"],
        identity: { name: "Raju Verma", role: "Lab Technician" },
        activeUsers: [],
        notifications: [],
      },
      admin: {
        title: "Hospital Admin Dashboard",
        summary: "Manage patients, doctors, and nurses for your hospital.",
        stats: [
          { label: "Total Patients", value: "48", detail: "Registered" },
          { label: "Doctors", value: "12", detail: "Active" },
          { label: "Nurses", value: "28", detail: "On roster" },
        ],
        alerts: [],
        tasks: ["Review new patient registrations", "Generate monthly report"],
        identity: { name: "Admin User", hospitalCode: "CITYHOSP01" },
        activeUsers: [],
        notifications: [],
      },
      patient: {
        title: "Patient Dashboard",
        summary: "Your personal health portal — view reports and monitor vitals.",
        stats: [
          { label: "Lab Tests", value: "3", detail: "Assigned" },
          { label: "Reports Ready", value: "1", detail: "Available" },
          { label: "Next Appointment", value: "Mon", detail: "9:00 AM" },
        ],
        alerts: [
          { title: "Lab report uploaded", patient: "", detail: "CBC report is now available for review." },
        ],
        tasks: ["Take medication at 08:00 AM", "Follow-up with Dr. Johnson on Tuesday"],
        identity: { name: "Lakshmi Menon", patientId: "P-1049", ward: "POST-OP", attending: "Dr. Sarah Johnson", status: "Stable" },
        notifications: [],
      },
    };
    return NextResponse.json(defaults[role] ?? { title: "Dashboard", stats: [], alerts: [], tasks: [] });
  }
}
