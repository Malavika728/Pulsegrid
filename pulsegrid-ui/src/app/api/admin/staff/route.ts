import { NextResponse, type NextRequest } from "next/server";

// Railway Backend URL
const BACKEND =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://pulsegrid-production.up.railway.app";

export async function GET(req: NextRequest) {
  const hospitalCode =
    req.nextUrl.searchParams.get("hospitalCode") || "CITYHOSP01";

  try {
    const url =
      `${BACKEND}/admin/users?hospitalCode=${hospitalCode}`;

    console.log("Calling:", url);

    const res = await fetch(url, {
      method: "GET",
      cache: "no-store",
    });

    const text = await res.text();

    return NextResponse.json({
      backend: BACKEND,
      status: res.status,
      response: text,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: String(error),
        backend: BACKEND,
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const res = await fetch(`${BACKEND}/admin/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        {
          error: data,
        },
        {
          status: res.status,
        }
      );
    }

    return NextResponse.json(data, {
      status: 201,
    });
  } catch (error) {
    console.error("POST /admin/users failed:", error);

    return NextResponse.json(
      {
        error: "Failed to create user",
      },
      {
        status: 500,
      }
    );
  }
}