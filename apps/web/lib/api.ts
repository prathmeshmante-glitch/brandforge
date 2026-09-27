import { getSupabaseClient } from './supabase';

export class APIError extends Error {
  status: number;
  detail: string;
  isAuthError: boolean;
  isNetworkError: boolean;

  constructor(status: number, detail: string, isNetworkError: boolean = false) {
    super(detail || `API error (${status})`);
    this.name = 'APIError';
    this.status = status;
    this.detail = detail || `API error (${status})`;
    this.isAuthError = status === 401 || status === 403;
    this.isNetworkError = isNetworkError;
  }
}

export function getBaseApiUrl(): string {
  const envUrl = (process.env.NEXT_PUBLIC_API_URL || '').trim();
  const isProd = process.env.NODE_ENV === 'production';

  if (isProd) {
    if (!envUrl) {
      throw new Error(
        'Production configuration error: NEXT_PUBLIC_API_URL is missing. ' +
        'An explicit backend API URL is required in production.'
      );
    }
    return envUrl.replace(/\/+$/, '');
  }

  // Development mode allows localhost fallback
  return (envUrl || 'http://localhost:8000').replace(/\/+$/, '');
}

export async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  let token: string | null = null;
  const baseUrl = getBaseApiUrl();

  // Retrieve current Supabase session access token
  if (typeof window !== 'undefined') {
    try {
      const supabase = getSupabaseClient();
      const { data } = await supabase.auth.getSession();
      token = data.session?.access_token || null;
    } catch (e) {
      console.warn('Could not read session token from Supabase client:', e);
    }
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${baseUrl}${endpoint}`, {
      ...options,
      headers,
    });
  } catch (err: any) {
    // Network failure (server down, CORS failure, or offline)
    console.error(`Network fetch failed for ${endpoint}:`, err);
    throw new APIError(0, 'Unable to connect to the BrandForge API server. Please check your network connection.', true);
  }

  if (!response.ok) {
    if (response.status === 401 && typeof window !== 'undefined') {
      console.warn('API returned 401 Unauthorized for:', endpoint);
      try {
        const supabase = getSupabaseClient();
        const { data: refreshData } = await supabase.auth.refreshSession();
        if (refreshData?.session?.access_token) {
          headers['Authorization'] = `Bearer ${refreshData.session.access_token}`;
          const retryResponse = await fetch(`${baseUrl}${endpoint}`, {
            ...options,
            headers,
          });
          if (retryResponse.ok) {
            return retryResponse.json();
          }
        }
      } catch (refreshErr) {
        console.warn('Session refresh on 401 failed:', refreshErr);
      }
    }

    let detail = `Request failed with status ${response.status}`;
    try {
      const errorData = await response.json();
      detail = errorData.detail || errorData.message || detail;
    } catch {
      // Body was not JSON
    }

    throw new APIError(response.status, detail);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const api = {
  createProject: (data: { name: string; idea: string; constraints?: any }) =>
    fetchAPI('/api/projects', { method: 'POST', body: JSON.stringify(data) }),

  listProjects: () => fetchAPI('/api/projects'),

  getProjects: () => fetchAPI('/api/projects'),

  getProject: (id: string) => fetchAPI(`/api/projects/${id}`),

  deleteProject: (id: string) => fetchAPI(`/api/projects/${id}`, { method: 'DELETE' }),

  startWorkflow: (projectId: string) =>
    fetchAPI(`/api/projects/${projectId}/workflow/start`, { method: 'POST' }),

  getWorkflowStatus: (projectId: string, runId: string) =>
    fetchAPI(`/api/projects/${projectId}/workflow/${runId}`),

  saveSelection: (projectId: string, selection: { direction_type: string; selected_value: any }) =>
    fetchAPI(`/api/projects/${projectId}/selection`, { method: 'POST', body: JSON.stringify(selection) }),

  requestRevision: (projectId: string, revision: { target_stage: string; feedback: string }) =>
    fetchAPI(`/api/projects/${projectId}/revise`, { method: 'POST', body: JSON.stringify(revision) }),

  getBrandKit: (projectId: string) => fetchAPI(`/api/projects/${projectId}/brand-kit`),

  exportBrandKit: (projectId: string, format: string = 'pdf', runId?: string | null) =>
    fetchAPI(`/api/projects/${projectId}/export`, {
      method: 'POST',
      body: JSON.stringify({ format, ...(runId ? { run_id: runId } : {}) }),
    }),

  downloadExportFile: async (downloadUrl: string, defaultFilename: string = 'brand-kit.pdf') => {
    const baseUrl = getBaseApiUrl();
    const headers: Record<string, string> = {};

    try {
      const supabase = getSupabaseClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }
    } catch {
      // Proceed without token if not available
    }

    const fullUrl = downloadUrl.startsWith('http') ? downloadUrl : `${baseUrl}${downloadUrl}`;
    const response = await fetch(fullUrl, { headers });

    if (!response.ok) {
      let detail = `Download failed with status ${response.status}`;
      try {
        const errorData = await response.json();
        detail = errorData.detail || detail;
      } catch {
        // Not JSON
      }
      throw new APIError(response.status, detail);
    }

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = defaultFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  },

  createShareLink: (projectId: string) =>
    fetchAPI(`/api/projects/${projectId}/share`, { method: 'POST' }),

  revokeShareLink: (projectId: string, shareToken: string) =>
    fetchAPI(`/api/projects/${projectId}/share/${shareToken}`, { method: 'DELETE' }),

  getPublicBrandKit: (shareToken: string) =>
    fetchAPI(`/api/share/${shareToken}`),

  getChatHistory: (projectId: string) => fetchAPI(`/api/projects/${projectId}/chat`),

  sendChatMessage: (projectId: string, message: string) =>
    fetchAPI(`/api/projects/${projectId}/chat`, { method: 'POST', body: JSON.stringify({ message }) }),

  getBaseUrl: () => getBaseApiUrl(),
};
