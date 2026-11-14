const RAW_API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');
const API_BASE_URL = RAW_API_URL.replace(/\/+$/, '');

export function getAuthToken(): string | null {
  return localStorage.getItem('ssbm_auth_token');
}

export function setAuthToken(token: string): void {
  localStorage.setItem('ssbm_auth_token', token);
}

export function clearAuthToken(): void {
  localStorage.removeItem('ssbm_auth_token');
}

export async function apiRequest<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const response = await fetch(`${API_BASE_URL}${cleanEndpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({ success: false, message: 'Server error' }));

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
}
