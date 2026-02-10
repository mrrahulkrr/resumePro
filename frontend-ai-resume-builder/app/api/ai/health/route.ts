import { NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export async function GET() {
    try {
        const response = await fetch(`${BACKEND_URL}/api/v1/ats/health`);
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { status: "error", message: "Cannot connect to AI service" },
            { status: 503 }
        );
    }
}
