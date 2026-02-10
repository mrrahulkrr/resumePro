from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_current_user, get_db
from app.models.user import User
from app.models.resume import Resume
from app.schemas.resume import ResumeAnalysisResult
from app.services.ai_service import ai_service
from pydantic import BaseModel

router = APIRouter(prefix="/ats", tags=["ATS Analysis"])

class AnalyzeRequest(BaseModel):
    resume_id: int
    job_description: str = ""

class AnalyzeDirectRequest(BaseModel):
    resume_content: str
    job_description: str = ""

@router.post("/analyze", response_model=ResumeAnalysisResult)
async def analyze_resume(
    request: AnalyzeRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Analyze a resume against a job description using AI.
    Requires a resume_id from the database.
    """
    # Fetch the resume from database
    result = await db.execute(
        Resume.__table__.select().where(
            Resume.id == request.resume_id,
            Resume.user_id == current_user.id
        )
    )
    resume = result.first()
    
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found"
        )
    
    # Analyze using AI service
    analysis = await ai_service.analyze_resume(
        resume_latex=resume.content,
        job_description=request.job_description
    )
    
    # Update resume with ATS score
    await db.execute(
        Resume.__table__.update()
        .where(Resume.id == request.resume_id)
        .values(ats_score=analysis.ats_score)
    )
    await db.commit()
    
    return analysis

@router.post("/analyze-direct", response_model=ResumeAnalysisResult)
async def analyze_resume_direct(
    request: AnalyzeDirectRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Analyze resume content directly without saving to database.
    Useful for quick analysis or preview.
    """
    analysis = await ai_service.analyze_resume(
        resume_latex=request.resume_content,
        job_description=request.job_description
    )
    
    return analysis

@router.get("/health")
async def check_ai_health():
    """
    Check if AI service is configured and ready.
    """
    if ai_service.model is None:
        return {
            "status": "unavailable",
            "message": "Gemini API key not configured"
        }
    
    return {
        "status": "ready",
        "message": "AI service is configured and ready",
        "model": "gemini-1.5-flash"
    }
