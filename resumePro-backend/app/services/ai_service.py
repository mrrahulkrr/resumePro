import google.generativeai as genai
import json
from app.core.config import settings
from app.schemas.resume import ResumeAnalysisResult

class AIService:
    def __init__(self):
        if settings.GEMINI_API_KEY:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            self.model = genai.GenerativeModel('gemini-1.5-flash')
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
        Act as an expert ATS (Applicant Tracking System) and Resume Coach.
        Analyze the following LaTeX resume against the provided Job Description (if any).
        
        Resume Content (LaTeX):
        {resume_latex}
        
        Job Description:
        {job_description if job_description else "No specific job description provided. Analyze for general software engineering best practices."}
        
        Provide the output STRICTLY as a JSON object with the following keys:
        - ats_score: number (0-100)
        - feedback: list of strings (concrete, actionable improvements)
        - missing_keywords: list of strings (important keywords from JD missing in resume)
        - tailored_content: string (Optional: Return the full optimized LaTeX code if simple fixes are possible, otherwise null)
        
        Do not include markdown formatting (like ```json) in the response, just the raw JSON string.
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
