import { getSupabaseClient } from './supabase';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  let token: string | null = null;

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

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401 && typeof window !== 'undefined') {
      console.warn('API returned 401 Unauthorized for:', endpoint);
      try {
        const supabase = getSupabaseClient();
        const { data: refreshData } = await supabase.auth.refreshSession();
        if (refreshData?.session?.access_token) {
          headers['Authorization'] = `Bearer ${refreshData.session.access_token}`;
          const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, {
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

    const errorData = await response.json().catch(() => ({ detail: 'Network request failed' }));
    throw new Error(errorData.detail || `API error (${response.status})`);
  }

  return response.json();
}

export const api = {
  createProject: (data: { name: string; idea: string; constraints?: any }) =>
    fetchAPI('/api/projects', { method: 'POST', body: JSON.stringify(data) }),

  listProjects: () => fetchAPI('/api/projects'),

  getProjects: () => fetchAPI('/api/projects'),

  getProject: (id: string) => fetchAPI(`/api/projects/${id}`),

  startWorkflow: (projectId: string) =>
    fetchAPI(`/api/projects/${projectId}/workflow/start`, { method: 'POST' }),

  getWorkflowStatus: (projectId: string, runId: string) =>
    fetchAPI(`/api/projects/${projectId}/workflow/${runId}`),

  saveSelection: (projectId: string, selection: { direction_type: string; selected_value: any }) =>
    fetchAPI(`/api/projects/${projectId}/selection`, { method: 'POST', body: JSON.stringify(selection) }),

  requestRevision: (projectId: string, revision: { target_stage: string; feedback: string }) =>
    fetchAPI(`/api/projects/${projectId}/revise`, { method: 'POST', body: JSON.stringify(revision) }),

  getBrandKit: (projectId: string) => fetchAPI(`/api/projects/${projectId}/brand-kit`),

  exportBrandKit: (projectId: string, format: string = 'pdf') =>
    fetchAPI(`/api/projects/${projectId}/export`, { method: 'POST', body: JSON.stringify({ format }) }),

  getChatHistory: (projectId: string) => fetchAPI(`/api/projects/${projectId}/chat`),

  sendChatMessage: (projectId: string, message: string) =>
    fetchAPI(`/api/projects/${projectId}/chat`, { method: 'POST', body: JSON.stringify({ message }) }),

  getBaseUrl: () => API_BASE_URL,
};
