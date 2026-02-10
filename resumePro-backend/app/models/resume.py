from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.models.base import Base

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)  # Stores the LaTeX code
    
    # Analysis/Tailoring Metadata
    ats_score = Column(Integer, nullable=True)
    is_tailored = Column(Boolean, default=False)
    job_description = Column(Text, nullable=True)
    pdf_blob_name = Column(String(500), nullable=True) # GCP Storage path
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    user = relationship("User", backref="resumes")

    def __repr__(self):
        return f"<Resume(id={self.id}, title={self.title}, user_id={self.user_id})>"
