from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.dialects.postgresql import ENUM as PgEnum
from sqlalchemy.sql import func
import enum
from app.models.base import Base


class AuthProvider(str, enum.Enum):
    """OAuth provider enum"""
    EMAIL = "email"
    GOOGLE = "google"
    GITHUB = "github"


# Create PostgreSQL enum that uses lowercase values
AuthProviderEnum = PgEnum(
    'email', 'google', 'github',
    name='authprovider',
    create_type=False  # Already created in migration
)


class User(Base):
    """User model for storing user authentication and profile information"""
    
    __tablename__ = "users"
    
    # Primary Key
    id = Column(Integer, primary_key=True, index=True)
    
    # Authentication Fields
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=True)  # Nullable for OAuth-only accounts
    
    # Profile Fields
    full_name = Column(String(255), nullable=True)
    profile_picture = Column(String(500), nullable=True)
    
    # Account Status
    is_active = Column(Boolean, default=True, index=True)
    is_verified = Column(Boolean, default=False)
    
    # Credits/Subscription
    credits = Column(Integer, default=5)  # Free tier credits
    
    # OAuth Provider Information
    auth_provider = Column(AuthProviderEnum, default='email')
    provider_id = Column(String(255), nullable=True)  # OAuth provider user ID
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    last_login = Column(DateTime(timezone=True), nullable=True)
    
    def __repr__(self):
        return f"<User(id={self.id}, email={self.email}, username={self.username})>"
