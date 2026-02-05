import { getSession } from "next-auth/react"
import type { Session } from "next-auth"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"

export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    message: string
  ) {
    super(message)
    this.name = "ApiError"
  }
}

async function getAuthHeaders(): Promise<HeadersInit> {
  const session: Session | null = await getSession()
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  }

  if (session && (session as any).accessToken) {
    headers.Authorization = `Bearer ${(session as any).accessToken}`
  }

  return headers
}

async function getAuthHeadersWithoutContentType(): Promise<HeadersInit> {
  const session: Session | null = await getSession()
  const headers: HeadersInit = {}

  if (session && (session as any).accessToken) {
    headers.Authorization = `Bearer ${(session as any).accessToken}`
  }

  return headers
}

export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = await getAuthHeaders()

  const response = await fetch(`${BACKEND_URL}${endpoint}`, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  })

  if (!response.ok) {
    const error = await response.text()
    try {
      const errorData = JSON.parse(error)
      throw new ApiError(response.status, response.statusText, errorData.detail || response.statusText)
    } catch (e) {
      if (e instanceof ApiError) throw e
      throw new ApiError(response.status, response.statusText, error)
    }
  }

  if (response.status === 204) {
    return null as any
  }

  return response.json() as Promise<T>
}

// Convenience methods
export const api = {
  get: <T,>(endpoint: string) => fetchApi<T>(endpoint),
  post: <T,>(endpoint: string, data?: any) =>
    fetchApi<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    }),
  put: <T,>(endpoint: string, data?: any) =>
    fetchApi<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    }),
  delete: <T,>(endpoint: string) => fetchApi<T>(endpoint, { method: "DELETE" }),
  download: async (endpoint: string, filename: string) => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      headers,
    });
    if (!response.ok) throw new Error("Download failed");
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },
  uploadFile: async <T,>(endpoint: string, file: File): Promise<T> => {
    const headers = await getAuthHeadersWithoutContentType();
    const formData = new FormData();
    formData.append("file", file);
    
    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      method: "POST",
      headers,
      body: formData,
    });
    
    if (!response.ok) {
      const error = await response.text();
      try {
        const errorData = JSON.parse(error);
        throw new ApiError(response.status, response.statusText, errorData.detail || response.statusText);
      } catch (e) {
        if (e instanceof ApiError) throw e;
        throw new ApiError(response.status, response.statusText, error);
      }
    }
    
    return response.json() as Promise<T>;
  },
  getPreviewUrl: async (endpoint: string): Promise<string> => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      headers,
    });
    if (!response.ok) throw new Error("Preview failed");
    const blob = await response.blob();
    return window.URL.createObjectURL(blob);
  },
}
