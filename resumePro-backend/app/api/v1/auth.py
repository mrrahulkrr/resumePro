from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from datetime import timedelta

from app.db.session import get_db
from app.models import User
from app.schemas.auth import (
    UserRegister, UserLogin, TokenResponse, UserResponse, TokenRequest, OAuthLogin
)
from app.core.security import PasswordManager, TokenManager
from app.core.config import settings

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserRegister, db: AsyncSession = Depends(get_db)):
    """Register a new user"""
    
    # Check if email already exists
    result = await db.execute(select(User).where(User.email == user_data.email))
    existing_user = result.scalar_one_or_none()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Check if username already exists
    result = await db.execute(select(User).where(User.username == user_data.username))
    existing_username = result.scalar_one_or_none()
    
    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )
    
    # Create new user
    hashed_password = PasswordManager.hash_password(user_data.password)
    
    new_user = User(
        email=user_data.email,
        username=user_data.username,
        full_name=user_data.full_name,
        hashed_password=hashed_password,
        is_verified=False,
        credits=50,  # Free tier credits
        auth_provider='email',  # Explicitly set lowercase for PostgreSQL enum
    )
    
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    
    return new_user


@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin, db: AsyncSession = Depends(get_db)):
    """Login user with email and password"""
    
    # Find user by email
    result = await db.execute(select(User).where(User.email == credentials.email))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Verify password
    if not PasswordManager.verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive"
        )
    
    # Create tokens - sub must be a string for JWT
    token_data = {"sub": str(user.id), "email": user.email}
    access_token = TokenManager.create_access_token(subject=token_data)
    refresh_token = TokenManager.create_refresh_token(subject=token_data)
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(token_request: TokenRequest, db: AsyncSession = Depends(get_db)):
    """Refresh access token using refresh token"""
    
    # Decode refresh token
    payload = TokenManager.decode_token(token_request.refresh_token)
    
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token"
        )
    
    user_id = int(payload.get("sub"))
    
    # Verify user still exists and is active
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive"
        )
    
    # Create new access token - sub must be string for JWT
    token_data = {"sub": str(user.id), "email": user.email}
    new_access_token = TokenManager.create_access_token(subject=token_data)
    new_refresh_token = TokenManager.create_refresh_token(subject=token_data)
    
    return TokenResponse(
        access_token=new_access_token,
        refresh_token=new_refresh_token,
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )


@router.get("/me", response_model=UserResponse)
async def get_current_user(
    authorization: str | None = Header(default=None, alias="Authorization"),
    db: AsyncSession = Depends(get_db)
):
    """Get current authenticated user"""
    
    print(f"Authorization header: {authorization}")  # Debug log
    
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    # Extract token from Bearer scheme
    try:
        scheme, token = authorization.split()
        print(f"Scheme: {scheme}, Token: {token[:20]}...")  # Debug log
        if scheme.lower() != "bearer":
            raise ValueError
    except (ValueError, IndexError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header"
        )
    
    # Decode token
    payload = TokenManager.decode_token(token)
    print(f"Decoded payload: {payload}")  # Debug log
    
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )
    
    user_id = int(payload.get("sub"))
    
    # Get user from database
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    return user


@router.post("/logout", status_code=status.HTTP_200_OK)
async def logout():
    """Logout user (token invalidation handled client-side)"""
    return {"message": "Logged out successfully"}


@router.post("/oauth-login", response_model=TokenResponse)
async def oauth_login(oauth_data: OAuthLogin, db: AsyncSession = Depends(get_db)):
    """Login or register user via OAuth (Google/GitHub)"""
    
    # 1. Check if user exists by email
    result = await db.execute(select(User).where(User.email == oauth_data.email))
    user = result.scalar_one_or_none()
    
    if user:
        # User exists - Account Merging strategy
        if user.auth_provider != oauth_data.provider or user.provider_id != oauth_data.provider_id:
            # Update provider info to link the latest OAuth method
            user.auth_provider = oauth_data.provider
            user.provider_id = oauth_data.provider_id
            if oauth_data.name and not user.full_name:
                user.full_name = oauth_data.name
            if oauth_data.image_url and not user.profile_picture:
                user.profile_picture = oauth_data.image_url
            
            db.add(user)
            await db.commit()
            await db.refresh(user)
            
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User account is inactive"
            )
    else:
        # 2. User does not exist - create a new user
        # Note: hashed_password is set to None for OAuth users
        user = User(
            email=oauth_data.email,
            username=oauth_data.email.split('@')[0] + "_" + oauth_data.provider[:2], # fallback username
            full_name=oauth_data.name,
            profile_picture=oauth_data.image_url,
            hashed_password=None, 
            is_verified=True, # OAuth emails are considered verified
            credits=50,  # Free tier credits
            auth_provider=oauth_data.provider, 
            provider_id=oauth_data.provider_id
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
        
    # 3. Create tokens for the user session
    token_data = {"sub": str(user.id), "email": user.email}
    access_token = TokenManager.create_access_token(subject=token_data)
    refresh_token = TokenManager.create_refresh_token(subject=token_data)
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )
