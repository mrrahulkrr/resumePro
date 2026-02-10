"use client";

import { useState } from "react";
import { toast } from "sonner";

interface AnalysisResult {
    ats_score: number;
    feedback: string[];
    missing_keywords: string[];
    tailored_content?: string;
}

interface AnalyzeOptions {
    resume_id?: number;
    resume_content?: string;
    job_description?: string;
}

export function useAIAnalysis() {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const analyzeResume = async (options: AnalyzeOptions): Promise<AnalysisResult | null> => {
        setIsAnalyzing(true);
        setError(null);

        try {
            const response = await fetch("/api/ai/analyze", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(options),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to analyze resume");
            }

            const result: AnalysisResult = await response.json();
            setAnalysis(result);

            toast.success("Resume analyzed successfully!", {
                description: `ATS Score: ${result.ats_score}/100`,
            });

            return result;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "An error occurred";
            setError(errorMessage);
            toast.error("Analysis failed", {
                description: errorMessage,
            });
            return null;
        } finally {
            setIsAnalyzing(false);
        }
    };

    const checkAIHealth = async (): Promise<boolean> => {
        try {
            const response = await fetch("/api/ai/health");
            const data = await response.json();
            return data.status === "ready";
        } catch {
            return false;
        }
    };

    const reset = () => {
        setAnalysis(null);
        setError(null);
    };

    return {
        analyzeResume,
        checkAIHealth,
        isAnalyzing,
        analysis,
        error,
        reset,
    };
}
