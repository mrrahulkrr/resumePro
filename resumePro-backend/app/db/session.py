from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import NullPool
from app.core.config import settings

# Use NullPool to avoid stale connections with serverless/remote databases
engine = create_async_engine(
    settings.DATABASE_URL, 
    echo=True,
    poolclass=NullPool,  # Disable connection pooling for remote DB
)
async_session = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

async def get_db() -> AsyncSession:
    async with async_session() as session:
        yield session