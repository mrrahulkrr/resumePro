from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

# Shared properties
class ResumeBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    content: Optional[str] = Field(None, description="LaTeX code content")
    job_description: Optional[str] = None

# Properties to receive on Resume creation
class ResumeCreate(ResumeBase):
    content: str = Field(..., description="Initial LaTeX code is required")

# Properties to receive on Resume update
class ResumeUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    content: Optional[str] = None
    job_description: Optional[str] = None
    ats_score: Optional[int] = Field(None, ge=0, le=100)
    is_tailored: Optional[bool] = None

# Analysis Result Schema
class ResumeAnalysisResult(BaseModel):
    ats_score: int
    feedback: List[str]
    missing_keywords: List[str]
    tailored_content: Optional[str] = None # Suggested improvements

# Properties to return to client
class ResumeResponse(ResumeBase):
    id: int
    user_id: int
    ats_score: Optional[int] = None
    is_tailored: bool
    created_at: datetime
    updated_at: datetime
    
    # Optional field if analysis was just performed
    analysis: Optional[ResumeAnalysisResult] = None

    class Config:
        from_attributes = True
