
export interface ResumeAnalysisResult {
    ats_score: number
    feedback: string[]
    missing_keywords: string[]
    tailored_content?: string
}

export interface Resume {
    id: number
    user_id: number
    title: string
    content: string // LaTeX code
    job_description?: string
    ats_score?: number
    is_tailored: boolean
    created_at: string
    updated_at: string
    analysis?: ResumeAnalysisResult
}

export interface ResumeCreate {
    title: string
    content: string
    job_description?: string
}

export interface ResumeUpdate {
    title?: string
    content?: string
    job_description?: string
    ats_score?: number
    is_tailored?: boolean
}

export interface ResumeTemplate {
    id: string
    name: string
    category: string
    description: string
    color: string
    content?: string // Only included when fetching single template
}
