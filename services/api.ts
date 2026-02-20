
const API_BASE = 'http://localhost:3001/api';

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('core_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  } as HeadersInit;

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP Error ${response.status}`);
    }
    return await response.json();
  } catch (error: any) {
    console.error(`API Fetch Error [${endpoint}]:`, error.message);
    throw error;
  }
};

export const authService = {
  login: (creds: any) => apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(creds) }),
  register: (data: any) => apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  updateProfile: (data: any) => apiFetch('/auth/profile', { method: 'PUT', body: JSON.stringify(data) }),
};

export const leadService = {
  getAll: () => apiFetch('/leads'),
  create: (data: any) => apiFetch('/leads', { method: 'POST', body: JSON.stringify(data) }),
};

export const dealService = {
  getAll: () => apiFetch('/deals'),
  update: (id: string, data: any) => apiFetch(`/deals/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
};

export const analyticsService = {
  getOverview: () => apiFetch('/analytics/overview'),
};

export const trackingService = {
  getLogs: () => apiFetch('/tracking'),
  checkIn: (location: string) => apiFetch('/tracking/checkin', { method: 'POST', body: JSON.stringify({ location }) }),
  checkOut: () => apiFetch('/tracking/checkout', { method: 'POST' }),
};
