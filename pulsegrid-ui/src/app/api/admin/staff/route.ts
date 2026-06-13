import { NextResponse, type NextRequest } from "next/server";
import fs from "fs";
import path from "path";

const BACKEND = "http://localhost:3001";
const DB_FILE = path.join(process.cwd(), "..", "backend", "database-fallback.json");

function readDB(): Record<string, object[]> {
  try { return JSON.parse(fs.readFileSync(DB_FILE, "utf-8")); }
  catch { return { patients: [], users: [], staff: [] }; }
}
function writeDB(data: Record<string, object[]>) {
  try { fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2)); } catch { /* silent */ }
}

export async function GET(req: NextRequest) {
  const role = req.nextUrl.searchParams.get("role") || "";
  const hospitalCode = req.nextUrl.searchParams.get("hospitalCode") || "CITYHOSP01";
  try {
    const res = await fetch(`${BACKEND}/auth/staff?role=${role}&hospitalCode=${hospitalCode}`);
    if (!res.ok) throw new Error();
    return NextResponse.json(await res.json());
  } catch {
    const db = readDB();
    const staff = (db.staff || []) as object[];
    const filtered = staff.filter((s: object) => {
      const member = s as { role?: string; hospitalCode?: string };
      return (!role || member.role === role) && (!hospitalCode || member.hospitalCode === hospitalCode);
    });
    return NextResponse.json(filtered);
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  try {
    const res = await fetch(`${BACKEND}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error();
    return NextResponse.json(await res.json(), { status: 201 });
  } catch {
    const db = readDB();
    const newMember = { ...body, id: `USR-${Date.now()}` };
    db.staff = [...(db.staff ?? []), newMember];
    writeDB(db);
    return NextResponse.json(newMember, { status: 201 });
  }
}
