from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.db.session import get_db
from app.models.resume import Resume
from app.models.users import User
from app.schemas.resume import ResumeCreate, ResumeUpdate, ResumeResponse
from app.api.deps import get_current_user

router = APIRouter(prefix="/resumes", tags=["resumes"])

@router.post("/", response_model=ResumeResponse, status_code=status.HTTP_201_CREATED)
async def create_resume(
    resume_in: ResumeCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new resume"""
    new_resume = Resume(
        user_id=current_user.id,
        title=resume_in.title,
        content=resume_in.content,
        job_description=resume_in.job_description,
        ats_score=0 # Default score
    )
    
    db.add(new_resume)
    await db.commit()
    await db.refresh(new_resume)
    return new_resume

@router.get("/", response_model=List[ResumeResponse])
async def read_resumes(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Retrieve all resumes for the current user"""
    result = await db.execute(
        select(Resume)
        .where(Resume.user_id == current_user.id)
        .offset(skip)
        .limit(limit)
    )
    resumes = result.scalars().all()
    return resumes

@router.get("/{resume_id}", response_model=ResumeResponse)
async def read_resume(
    resume_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Retrieve a specific resume by ID"""
    result = await db.execute(
        select(Resume).where(Resume.id == resume_id, Resume.user_id == current_user.id)
    )
    resume = result.scalar_one_or_none()
    
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found"
        )
    return resume

@router.put("/{resume_id}", response_model=ResumeResponse)
async def update_resume(
    resume_id: int,
    resume_in: ResumeUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update a resume"""
    result = await db.execute(
        select(Resume).where(Resume.id == resume_id, Resume.user_id == current_user.id)
    )
    resume = result.scalar_one_or_none()
    
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found"
        )
    
    update_data = resume_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(resume, field, value)
        
    await db.commit()
    await db.refresh(resume)
    return resume

@router.delete("/{resume_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_resume(
    resume_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a resume"""
    result = await db.execute(
        select(Resume).where(Resume.id == resume_id, Resume.user_id == current_user.id)
    )
    resume = result.scalar_one_or_none()
    
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found"
        )
        
@router.post("/{resume_id}/analyze", response_model=ResumeResponse)
async def analyze_resume_endpoint(
    resume_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Analyze a resume using AI"""
    # 1. Fetch Resume
    result = await db.execute(
        select(Resume).where(Resume.id == resume_id, Resume.user_id == current_user.id)
    )
    resume = result.scalar_one_or_none()
    
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found"
        )
    
    # 2. Call AI Service
    from app.services.ai_service import ai_service
    analysis_result = await ai_service.analyze_resume(
        resume_latex=resume.content,
        job_description=resume.job_description or ""
    )
    
    # 3. Update Resume
    resume.ats_score = analysis_result.ats_score
    resume.is_tailored = True # Mark as processed
    
    await db.commit()
    await db.refresh(resume)
    
    # 4. Construct Response with Analysis
    response = ResumeResponse.model_validate(resume)
    response.analysis = analysis_result
    
    return response
@router.get("/{resume_id}/download", status_code=status.HTTP_200_OK)
async def download_resume(
    resume_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Compile and download the resume as PDF"""
    # 1. Fetch Resume
    result = await db.execute(
        select(Resume).where(Resume.id == resume_id, Resume.user_id == current_user.id)
    )
    resume = result.scalar_one_or_none()
    
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found"
        )
    
    # 2. Compile LaTeX to PDF
    from app.services.pdf_service import pdf_service
    pdf_content = await pdf_service.compile_latex(resume.content)
    
    if not pdf_content:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate PDF. Please check your LaTeX syntax."
        )
    
    # 3. Return as PDF file
    from fastapi.responses import Response
    filename = f"{resume.title.replace(' ', '_')}.pdf"
    
    return Response(
        content=pdf_content,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"'
        }
    )
