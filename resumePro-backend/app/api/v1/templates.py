from fastapi import APIRouter, HTTPException, status
from typing import List
from pydantic import BaseModel

from app.services.templates import get_all_templates, get_template_by_id

router = APIRouter(prefix="/templates", tags=["Templates"])


class TemplateMetadata(BaseModel):
    id: str
    name: str
    category: str
    description: str
    color: str


class TemplateDetail(TemplateMetadata):
    content: str


@router.get("", response_model=List[TemplateMetadata])
async def list_templates():
    """
    Get all available resume templates (metadata only).
    Returns template list without the full LaTeX content.
    """
    return get_all_templates()


@router.get("/{template_id}", response_model=TemplateDetail)
async def get_template(template_id: str):
    """
    Get a specific template by ID, including the full LaTeX content.
    """
    template = get_template_by_id(template_id)
    if not template:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Template '{template_id}' not found"
        )
    return template
