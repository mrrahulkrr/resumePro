# ResumePro - AI-Powered Resume Builder

An AI-powered resume builder with ATS optimization, LaTeX rendering, and intelligent analysis.

## Tech Stack

### Frontend
- **Framework:** Next.js 16 with App Router
- **UI:** React 19, Tailwind CSS 4, Shadcn UI
- **Auth:** NextAuth.js
- **State:** React Hook Form, Zod validation

### Backend
- **Framework:** FastAPI (Python)
- **Database:** PostgreSQL with SQLAlchemy
- **Auth:** JWT tokens
- **Services:** LaTeX compilation, PDF generation, file parsing

## Local Development Setup

### Prerequisites
- Node.js 18+ and pnpm
- Python 3.10+
- PostgreSQL
- LaTeX distribution (for PDF generation)

### Frontend Setup

```bash
cd frontend-ai-resume-builder

# Install dependencies
pnpm install

# Copy environment variables
cp .env.local.example .env.local

# Update .env.local with:
# NEXTAUTH_URL=http://localhost:3000
# NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>
# NEXT_PUBLIC_BACKEND_URL=http://localhost:8000

# Run development server
pnpm dev
```

### Backend Setup

```bash
cd resumePro-backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment variables
cp .env.example .env

# Update .env with your database URL and secrets

# Run migrations
alembic upgrade head

# Start server
uvicorn app.main:app --reload
```

## Deployment

### Frontend (Vercel)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Go to https://vercel.com
   - Import your GitHub repository
   - Set root directory: `frontend-ai-resume-builder`
   - Add environment variables:
     - `NEXTAUTH_URL`: Your Vercel URL
     - `NEXTAUTH_SECRET`: Generated secret
     - `NEXT_PUBLIC_BACKEND_URL`: Your backend URL

3. **After Deployment**
   - Update `NEXTAUTH_URL` with actual Vercel URL
   - Redeploy to apply changes

### Backend (Render)

1. **Database Setup (Neon)**
   - Go to https://neon.tech
   - Create free PostgreSQL database
   - Copy connection string

2. **Deploy on Render**
   - Go to https://render.com
   - New → Web Service
   - Connect GitHub repository
   - Set root directory: `resumePro-backend`
   - Build command: `pip install -r requirements.txt`
   - Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

3. **Environment Variables on Render**
   ```
   DATABASE_URL=<neon-connection-string>
   SECRET_KEY=<generate-with-openssl-rand-hex-32>
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   FRONTEND_URL=<your-vercel-url>
   OPENAI_API_KEY=<optional>
   ANTHROPIC_API_KEY=<optional>
   ```

4. **Run Migrations**
   - Use Render Shell: `alembic upgrade head`

5. **Update Frontend**
   - Update `NEXT_PUBLIC_BACKEND_URL` in Vercel
   - Update CORS in `app/main.py` with Vercel URL
   - Redeploy backend

## Environment Variables

### Frontend (.env.local)
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

### Backend (.env)
```env
DATABASE_URL=postgresql://user:pass@host:5432/db
SECRET_KEY=your-jwt-secret
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
FRONTEND_URL=http://localhost:3000
```

## Build Commands

### Frontend
```bash
pnpm build    # Build for production
pnpm start    # Start production server
pnpm dev      # Development server
pnpm lint     # Run linter
```

### Backend
```bash
# Run server
uvicorn app.main:app --reload

# Run migrations
alembic upgrade head

# Create migration
alembic revision --autogenerate -m "description"

# Test
pytest
```

## Project Structure

```
resumePro/
├── frontend-ai-resume-builder/
│   ├── app/                    # Next.js app router
│   │   ├── auth/              # Authentication pages
│   │   ├── dashboard/         # Dashboard
│   │   ├── editor/            # Resume editor
│   │   ├── templates/         # Template library
│   │   └── api/               # API routes
│   ├── components/            # React components
│   ├── lib/                   # Utilities & API client
│   └── types/                 # TypeScript types
│
└── resumePro-backend/
    ├── app/
    │   ├── api/              # API routes
    │   ├── core/             # Config & security
    │   ├── models/           # Database models
    │   ├── schemas/          # Pydantic schemas
    │   └── services/         # Business logic
    └── alembic/              # Database migrations
```

## Features

- 🎨 **Resume Editor** - LaTeX-based resume editing
- 🤖 **AI Analysis** - ATS score and suggestions
- 📄 **Templates** - Professional resume templates
- 📊 **Dashboard** - Resume management
- 🔐 **Authentication** - Secure user accounts
- 📥 **File Upload** - Parse existing resumes
- 📦 **PDF Export** - Download as PDF

