from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


class UserBase(BaseModel):
    """Base user schema"""
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=255)
    full_name: Optional[str] = None


class UserRegister(UserBase):
    """Schema for user registration"""
    password: str = Field(..., min_length=8, max_length=255)


class UserLogin(BaseModel):
    """Schema for user login"""
    email: EmailStr
    password: str


class UserResponse(UserBase):
    """Schema for user response (without password)"""
    id: int
    is_active: bool
    is_verified: bool
    credits: int
    created_at: datetime
    
    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    """Schema for token response"""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int


class TokenRequest(BaseModel):
    """Schema for refresh token request"""
    refresh_token: str


class TokenData(BaseModel):
    """Schema for token data"""
    user_id: int
    email: str
    sub: int  # subject (user_id)


class OAuthLogin(BaseModel):
    """Schema for OAuth login"""
    email: EmailStr
    provider: str
    provider_id: str
    name: Optional[str] = None
    image_url: Optional[str] = None
