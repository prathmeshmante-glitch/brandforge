const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') || 'test-token-user1' : 'test-token-user1';
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
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

  getBaseUrl: () => API_BASE_URL,
};
