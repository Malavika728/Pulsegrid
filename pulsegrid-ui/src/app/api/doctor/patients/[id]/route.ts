import { NextResponse } from "next/server";
import { patients as fallbackPatients } from "../../data";

const BACKEND = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const res = await fetch(`${BACKEND}/patients/${id}`, { cache: "no-store" });
    if (res.ok) return NextResponse.json(await res.json());
  } catch { /* fallback */ }

  const patient = fallbackPatients.find((item) => item.id === id);
  if (!patient) return NextResponse.json({ error: "Patient not found" }, { status: 404 });
  return NextResponse.json(patient);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();

  try {
    if (body.labTests !== undefined) {
      const res = await fetch(`${BACKEND}/patients/${id}/lab-tests`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ labTests: body.labTests }),
      });
      if (res.ok) return NextResponse.json(await res.json());
    } else {
      const res = await fetch(`${BACKEND}/patients/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) return NextResponse.json(await res.json());
    }
  } catch { /* fallback */ }

  // Local in-memory fallback
  const patient = fallbackPatients.find((item) => item.id === id);
  if (patient) {
    if (body.labTests !== undefined) (patient as Record<string, unknown>).labTests = body.labTests;
    if (body.labTest !== undefined) (patient as Record<string, unknown>).labTest = body.labTest;
  }
  return NextResponse.json({ id, ...body });
}
