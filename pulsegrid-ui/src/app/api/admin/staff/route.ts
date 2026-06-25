import { NextResponse, type NextRequest } from "next/server";

const BACKEND =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://pulsegrid-production.up.railway.app";

// GET /api/admin/staff?hospitalCode=CITYHOSP01&role=Doctor
export async function GET(req: NextRequest) {
  const hospitalCode =
    req.nextUrl.searchParams.get("hospitalCode") || "CITYHOSP01";
  const role = req.nextUrl.searchParams.get("role") || "";

  try {
    const params = new URLSearchParams({ hospitalCode });
    if (role) params.set("role", role);

    const res = await fetch(`${BACKEND}/admin/users?${params.toString()}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Backend returned ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();

    // Filter by role on the frontend side if backend doesn't filter
    if (role && Array.isArray(data)) {
      const filtered = data.filter(
        (u: any) => u.role?.toLowerCase() === role.toLowerCase() ||
                    u.role?.toLowerCase() === role.toLowerCase().replace(" ", "_")
      );
      return NextResponse.json(filtered);
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to reach backend: ${String(error)}` },
      { status: 500 }
    );
  }
}

// POST /api/admin/staff  — create a new user
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const res = await fetch(`${BACKEND}/admin/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: data?.message || data?.error || "Failed to create user" },
        { status: res.status }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to reach backend: ${String(error)}` },
      { status: 500 }
    );
  }
}