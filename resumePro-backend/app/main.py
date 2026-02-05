from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1 import auth, resumes, templates

app = FastAPI(title=settings.PROJECT_NAME, version=settings.PROJECT_VERSION)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_URL,
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
        "https://resume-pro-sage.vercel.app",
    ],
    allow_origin_regex=r"https?://(localhost|127\\.0\\.0\\.1)(:\\d+)?$|https://.*\\.vercel\\.app$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(resumes.router, prefix="/api/v1") # /api/v1/resumes
app.include_router(templates.router, prefix="/api/v1") # /api/v1/templates


@app.get("/")
def read_root():
    return {"message": "Welcome to ResumePro API"}
