import { NextResponse, type NextRequest } from "next/server";
import fs from "fs";
import path from "path";

const BACKEND = "http://localhost:3001";
const DB_FILE = path.join(process.cwd(), "..", "backend", "database-fallback.json");

function readDB(): Record<string, object[]> {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
  } catch {
    return { patients: [], users: [] };
  }
}

function writeDB(data: Record<string, object[]>) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch {
    // silently fail
  }
}

export async function GET(req: NextRequest) {
  const hospitalCode = req.nextUrl.searchParams.get("hospitalCode") || "CITYHOSP01";
  try {
    const res = await fetch(`${BACKEND}/patients?hospitalCode=${hospitalCode}`);
    if (!res.ok) throw new Error("Backend error");
    return NextResponse.json(await res.json());
  } catch {
    const db = readDB();
    const patients = (db.patients || []) as object[];
    const filtered = patients.filter((p: object) => {
      const patient = p as { hospitalCode?: string };
      return !patient.hospitalCode || patient.hospitalCode === hospitalCode;
    });
    return NextResponse.json(filtered);
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  try {
    const res = await fetch(`${BACKEND}/patients`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error("Backend error");
    return NextResponse.json(await res.json());
  } catch {
    const db = readDB();
    const newPatient = {
      ...body,
      id: `P-${1000 + (db.patients?.length ?? 0) + 1}`,
      labTests: body.labTests ?? [],
    };
    db.patients = [...(db.patients ?? []), newPatient];
    writeDB(db);
    return NextResponse.json(newPatient, { status: 201 });
  }
}
