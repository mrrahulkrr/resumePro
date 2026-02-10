import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export async function POST(request: NextRequest) {
    try {
        // Check authentication
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Get request body
        const body = await request.json();
        const { resume_id, resume_content, job_description } = body;

        // Determine which endpoint to use
        const endpoint = resume_id
            ? `${BACKEND_URL}/api/v1/ats/analyze`
            : `${BACKEND_URL}/api/v1/ats/analyze-direct`;

        const payload = resume_id
            ? { resume_id, job_description: job_description || "" }
            : { resume_content, job_description: job_description || "" };

        // Call backend API
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session.accessToken}`,
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const error = await response.json();
            return NextResponse.json(
                { error: error.detail || "Failed to analyze resume" },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error("AI Analysis Error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
