import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      "https://pulsegrid-production.up.railway.app";

    // Call the real backend auth endpoint
    const response = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || "Invalid credentials." },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Unable to reach authentication server. Please try again." },
      { status: 500 }
    );
  }
}