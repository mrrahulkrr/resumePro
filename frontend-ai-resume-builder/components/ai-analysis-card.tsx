"use client";

import { useState } from "react";
import { useAIAnalysis } from "@/hooks/use-ai-analysis";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, TrendingUp, AlertCircle, CheckCircle2, Coins } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useCredits } from "@/lib/credit-context";
import { toast } from "sonner";

interface AIAnalysisCardProps {
  resumeId?: number;
  resumeContent?: string;
  onAnalysisComplete?: (score: number) => void;
}

export function AIAnalysisCard({ resumeId, resumeContent, onAnalysisComplete }: AIAnalysisCardProps) {
  const [jobDescription, setJobDescription] = useState("");
  const { analyzeResume, isAnalyzing, analysis, error } = useAIAnalysis();
  const { credits, consumeAICredits, refreshCredits } = useCredits();

  const handleAnalyze = async () => {
    if (credits < 10) {
      toast.error("Insufficient credits", {
        description: "AI Analysis costs 10 credits. Please upgrade your plan.",
      });
      return;
    }

    const result = await analyzeResume({
      resume_id: resumeId,
      resume_content: resumeContent,
      job_description: jobDescription,
    });

    if (result) {
      await consumeAICredits();
      await refreshCredits(); // Sync with backend
      if (onAnalysisComplete) {
        onAnalysisComplete(result.ats_score);
      }
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Needs Improvement";
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          AI Resume Analysis
        </CardTitle>
        <CardDescription>
          Get AI-powered feedback on your resume and improve your ATS score
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Job Description Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Job Description (Optional)
          </label>
          <Textarea
            placeholder="Paste the job description here to get tailored feedback..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={4}
            className="resize-none"
          />
        </div>

        {/* Analyze Button */}
        <Button
          onClick={handleAnalyze}
          disabled={isAnalyzing || (!resumeId && !resumeContent)}
          className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg transition-all duration-200"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              AI is Thinking...
            </>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="h-5 w-5" />
              <span>Analyze Now</span>
              <div className="flex items-center gap-1 ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs font-medium">
                <Coins className="h-3 w-3" />
                <span>10</span>
              </div>
            </div>
          )}
        </Button>

        {/* Error Display */}
        {error && (
          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <div className="text-sm text-red-800">{error}</div>
          </div>
        )}

        {/* Analysis Results */}
        {analysis && (
          <div className="space-y-4 pt-4 border-t">
            {/* ATS Score */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">ATS Score</span>
                <div className="flex items-center gap-2">
                  <span className={`text-2xl font-bold ${getScoreColor(analysis.ats_score)}`}>
                    {analysis.ats_score}
                  </span>
                  <span className="text-sm text-muted-foreground">/ 100</span>
                </div>
              </div>
              <Progress value={analysis.ats_score} className="h-2" />
              <Badge variant={analysis.ats_score >= 60 ? "default" : "destructive"}>
                {getScoreLabel(analysis.ats_score)}
              </Badge>
            </div>

            {/* Feedback */}
            {analysis.feedback.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Improvement Suggestions</span>
                </div>
                <ul className="space-y-2">
                  {analysis.feedback.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Missing Keywords */}
            {analysis.missing_keywords.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium">Missing Keywords</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {analysis.missing_keywords.map((keyword, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Tailored Content */}
            {analysis.tailored_content && (
              <div className="space-y-2">
                <span className="text-sm font-medium text-green-600">
                  ✨ AI has generated optimized content for your resume!
                </span>
                <p className="text-xs text-muted-foreground">
                  Review the suggestions and apply them to improve your resume.
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
