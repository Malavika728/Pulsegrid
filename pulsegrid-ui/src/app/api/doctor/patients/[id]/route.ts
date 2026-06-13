import { NextResponse } from "next/server";
import { patients as fallbackPatients } from "../../data";

async function getBackendData(id: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    const response = await fetch(`${baseUrl}/patients/${id}`, { cache: "no-store" });

    if (!response.ok) {
      throw new Error("Backend unavailable");
    }

    return await response.json();
  } catch {
    return null;
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const backendPatient = await getBackendData(id);

  if (backendPatient) {
    return NextResponse.json(backendPatient);
  }

  const patient = fallbackPatients.find((item) => item.id === id);

  if (!patient) {
    return NextResponse.json({ error: "Patient not found" }, { status: 404 });
  }

  return NextResponse.json(patient);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();

  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    if (body.labTests !== undefined) {
      const response = await fetch(`${baseUrl}/patients/${id}/lab-tests`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ labTests: body.labTests }),
      });

      if (response.ok) {
        return NextResponse.json(await response.json());
      }
    } else if (body.filename !== undefined || body.labReportPdf !== undefined) {
      const filename = body.filename || body.labReportPdf;
      const response = await fetch(`${baseUrl}/patients/${id}/upload-report`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename }),
      });

      if (response.ok) {
        return NextResponse.json(await response.json());
      }
    } else {
      const response = await fetch(`${baseUrl}/patients/${id}/lab-test`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        return NextResponse.json(await response.json());
      }
    }
  } catch {}

  // Local fallback
  const patient = fallbackPatients.find((item) => item.id === id);
  if (patient) {
    if (body.labTest !== undefined) {
      (patient as any).labTest = body.labTest;
    }
    if (body.labTests !== undefined) {
      (patient as any).labTests = body.labTests;
    }
    if (body.filename !== undefined || body.labReportPdf !== undefined) {
      (patient as any).labReportPdf = body.filename || body.labReportPdf;
    }
  }
  return NextResponse.json({ id, ...body });
}
