from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, BackgroundTasks
from fastapi.responses import Response
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
import sqlalchemy as sa

from app.db.session import get_db
from app.models.resume import Resume
from app.models.users import User
from app.schemas.resume import ResumeCreate, ResumeUpdate, ResumeResponse
from app.api.deps import get_current_user

router = APIRouter(prefix="/resumes", tags=["resumes"])

async def background_upload_task(
    db: AsyncSession, 
    resume_id: int, 
    user_id: int, 
    pdf_content: bytes
):
    """Background task to upload PDF to GCP and update resume metadata."""
    from app.services.gcp_storage import storage_service
    if storage_service.client:
        blob_name = f"resumes/user_{user_id}/resume_{resume_id}.pdf"
        storage_service.upload_file(pdf_content, blob_name)
        
        # Update resume in db
        from app.models.resume import Resume
        await db.execute(
            sa.update(Resume)
            .where(Resume.id == resume_id)
            .values(pdf_blob_name=blob_name)
        )
        await db.commit()

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
        
    await db.delete(resume)
    await db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
        
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
    
    # 1.5 Check Credits
    if current_user.credits < 10:
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail="Insufficient credits. You need at least 10 credits for an AI analysis."
        )
    
    # 2. Call AI Service
    from app.services.ai_service import ai_service
    analysis_result = await ai_service.analyze_resume(
        resume_latex=resume.content,
        job_description=resume.job_description or ""
    )
    
    # 2.5 Subtract Credits
    current_user.credits -= 10
    db.add(current_user) # Ensure user is marked as modified
    
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
    db: AsyncSession = Depends(get_db),
    background_tasks: BackgroundTasks = None
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
    
    # 2. Compile LaTeX to PDF (Service now includes local hashing cache)
    from app.services.pdf_service import pdf_service
    pdf_content = await pdf_service.compile_latex(resume.content)
    
    if not pdf_content:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate PDF. Please check your LaTeX syntax."
        )
    
    # 3. Queue GCP upload to background
    if background_tasks:
        background_tasks.add_task(background_upload_task, db, resume.id, current_user.id, pdf_content)
    
    # 4. Return as PDF file immediately
    from fastapi.responses import Response
    filename = f"{resume.title.replace(' ', '_')}.pdf"
    
    return Response(
        content=pdf_content,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"'
        }
    )


@router.get("/{resume_id}/preview", status_code=status.HTTP_200_OK)
async def preview_resume(
    resume_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
    background_tasks: BackgroundTasks = None
):
    """Compile and return the resume as PDF for preview (inline display)"""
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
    
    # 2. Compile LaTeX to PDF (Includes cache check)
    from app.services.pdf_service import pdf_service
    pdf_content = await pdf_service.compile_latex(resume.content)
    
    if not pdf_content:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate PDF. Please check your LaTeX syntax."
        )
    
    # 3. Queue GCP upload to background
    if background_tasks:
        background_tasks.add_task(background_upload_task, db, resume.id, current_user.id, pdf_content)
    
    # 4. Return as inline PDF (for preview in browser)
    return Response(
        content=pdf_content,
        media_type="application/pdf",
        headers={
            "Content-Disposition": "inline"
        }
    )


@router.post("/parse-file")
async def parse_uploaded_file(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    """
    Parse an uploaded resume file (PDF or TXT) and extract text content.
    Returns the extracted text for further processing.
    """
    # Validate file type
    allowed_types = [".pdf", ".txt"]
    filename = file.filename or "unknown"
    
    if not any(filename.lower().endswith(ext) for ext in allowed_types):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file type. Allowed types: {', '.join(allowed_types)}"
        )
    
    # Read file content
    try:
        content = await file.read()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to read file: {str(e)}"
        )
    
    # Extract text
    from app.services.file_parser import extract_text_from_file
    extracted_text = extract_text_from_file(content, filename)
    
    if not extracted_text:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Could not extract text from file. Please ensure the file is not corrupted."
        )
    
    return {
        "filename": filename,
        "text": extracted_text,
        "char_count": len(extracted_text)
    }
