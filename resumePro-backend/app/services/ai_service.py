import google.generativeai as genai
import json
from app.core.config import settings
from app.schemas.resume import ResumeAnalysisResult

class AIService:
    def __init__(self):
        if settings.GEMINI_API_KEY:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            self.model = genai.GenerativeModel('gemini-3.1-flash-lite')
        else:
            self.model = None

    async def analyze_resume(self, resume_latex: str, job_description: str = "") -> ResumeAnalysisResult:
        if not self.model:
            # Fallback for dev/test without API key
            return ResumeAnalysisResult(
                ats_score=0, 
                feedback=["API Key missing. Please configure GEMINI_API_KEY."], 
                missing_keywords=[]
            )

        prompt = f"""
        Act as an elite Technical Recruiter and ATS Optimization Expert.
        Analyze the following LaTeX resume against the provided Job Description (JD).
        
        Resume Content (LaTeX):
        {resume_latex}
        
        Job Description:
        {job_description if job_description else "No JD provided. Analyze for high-growth Software Engineering roles (Tier 1 tech companies)."}
        
        CRITERIA FOR ANALYSIS:
        1. ATS SCORE (0-100):
           - 90-100: Perfect keyword match, strong metrics, clean LaTeX structure.
           - 70-89: Good match, but could use more quantifiable achievements.
           - 40-69: Missing key technologies or weak bullet points.
           - 0-39: Poor formatting or significant gaps in skills/experience.

        2. FEEDBACK (Actionable & Concrete):
           - Evaluate bullet points using the Google XYZ Formula: 'Accomplished [X] as measured by [Y], by doing [Z]'.
           - Identify filler words and recommend strong action verbs.
           - Check for proper LaTeX formatting (avoiding common compilation errors).

        3. KEYWORDS:
           - Extract missing hard skills, frameworks, and tools from the JD that are absent in the resume.

        4. TAILORED CONTENT (LaTeX):
           - Provide a suggested improvement for ONE specific high-impact section (like Professional Summary or a key Experience bullet).
           - ENSURE the output is valid LaTeX that can be compiled.

        OUTPUT REQUIREMENTS:
        Return ONLY a raw JSON object. NO markdown, NO ```json blocks, NO preamble.
        
        JSON Structure:
        {{
          "ats_score": number,
          "feedback": ["point 1", "point 2", ...],
          "missing_keywords": ["keyword 1", ...],
          "tailored_content": "Suggested LaTeX snippet or full section"
        }}
        """

        try:
            response = await self.model.generate_content_async(prompt)
            # Cleanup potential markdown code blocks
            clean_text = response.text.replace("```json", "").replace("```", "").strip()
            data = json.loads(clean_text)
            
            return ResumeAnalysisResult(**data)
            
        except Exception as e:
            print(f"AI Analysis Error: {e}")
            return ResumeAnalysisResult(
                ats_score=0,
                feedback=["Error analyzing resume. Please try again."],
                missing_keywords=[]
            )

ai_service = AIService()
