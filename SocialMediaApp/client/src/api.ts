const API = '/api';

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  let res: Response;
  try {
    const headers: HeadersInit = {
      ...options.headers,
    };
    // Let the browser set multipart boundaries for FormData
    if (!(options.body instanceof FormData)) {
      (headers as Record<string, string>)['Content-Type'] = 'application/json';
    }

    res = await fetch(`${API}${path}`, {
      ...options,
      credentials: 'include',
      headers,
    });
  } catch (e) {
    throw new Error('Network error. Is the server running?');
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg = (err as { error?: string }).error || res.statusText;
    if (res.status === 401) throw new Error('Please log in first.');
    if (res.status === 403) throw new Error('Access denied.');
    throw new Error(msg || 'Request failed');
  }
  return res.json();
}

export type UserMe = { id: number; fullName: string; email: string; roles: string[] } | null;

export const api = {
  account: {
    me: () => request<UserMe>('/AccountApi/me'),
    login: (email: string, password: string) =>
      request<{ id: number; fullName: string; email: string; roles: string[] }>('/AccountApi/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    register: (fullName: string, email: string, password: string) =>
      request<{ id: number; fullName: string; email: string; roles: string[] }>('/AccountApi/register', {
        method: 'POST',
        body: JSON.stringify({ fullName, email, password }),
      }),
    registerAdmin: (adminKey: string, fullName: string, email: string, password: string) =>
      request<{ id: number; fullName: string; email: string; roles: string[] }>('/AccountApi/register-admin', {
        method: 'POST',
        body: JSON.stringify({ adminKey, fullName, email, password }),
      }),
    logout: () => request<void>('/AccountApi/logout', { method: 'POST' }),
  },
  admin: {
    pendingCampaigns: () =>
      request<Array<{
        id: number;
        title: string;
        description: string;
        impactGoal: string;
        status: string;
        ownerName: string;
        ownerEmail: string;
        ownerId: number;
      }>>('/AdminApi/campaigns/pending'),
    approveCampaign: (id: number) =>
      request<{ id: number; status: string }>(`/AdminApi/campaigns/${id}/approve`, { method: 'POST' }),
    rejectCampaign: (id: number) =>
      request<{ id: number; status: string }>(`/AdminApi/campaigns/${id}/reject`, { method: 'POST' }),
    users: () =>
      request<Array<{ id: number; fullName: string; email: string; roles: string[] }>>('/AdminApi/users'),
    assignRole: (userId: number, roleName: string) =>
      request<{ userId: number; roleName: string }>(`/AdminApi/users/${userId}/role`, {
        method: 'POST',
        body: JSON.stringify({ roleName }),
      }),
    demotionRequests: () =>
      request<
        Array<{
          id: number;
          targetId: number;
          targetName: string;
          targetEmail: string;
          createdById: number;
          createdByName: string;
          approvalsCount: number;
          status: string;
          createdAt: string;
        }>
      >('/AdminApi/demotion-requests/pending'),
    createDemotionRequest: (targetUserId: number) =>
      request<{ requestId: number; status: string; message?: string }>(`/AdminApi/admins/${targetUserId}/demote`, {
        method: 'POST',
      }),
    approveDemotionRequest: (id: number) =>
      request<{ id: number; status: string; approvals: number }>(`/AdminApi/demotion-requests/${id}/approve`, {
        method: 'POST',
      }),
  },
  dashboard: () =>
    request<{
      user: { id: number; fullName: string; email: string };
      myCampaigns: Array<{ id: number; title: string; description: string; impactGoal: string; status: string }>;
      myBusinesses: Array<{ id: number; name: string; industry: string; website?: string; city?: string }>;
    }>('/DashboardApi'),
  campaigns: {
    list: () =>
      request<
        Array<{ id: number; title: string; description: string; impactGoal: string; status: string; images: string[] }>
      >('/CampaignsApi'),
    create: (data: { title: string; description?: string; impactGoal?: string; images?: File[] }) => {
      const fd = new FormData();
      fd.append('title', data.title);
      if (data.description) fd.append('description', data.description);
      if (data.impactGoal) fd.append('impactGoal', data.impactGoal);
      for (const f of data.images ?? []) fd.append('images', f);

      return fetch(`${API}/CampaignsApi`, {
        method: 'POST',
        body: fd,
        credentials: 'include',
      }).then(async (res) => {
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          const msg = (err as { error?: string }).error || res.statusText;
          if (res.status === 401) throw new Error('Please log in first.');
          if (res.status === 403) throw new Error('Access denied.');
          throw new Error(msg || 'Request failed');
        }
        return res.json() as Promise<{
          id: number;
          title: string;
          description: string;
          impactGoal: string;
          status: string;
          images: string[];
        }>;
      });
    },
  },
  businesses: {
    list: () =>
      request<Array<{ id: number; name: string; industry: string; website?: string; city?: string }>>('/businesses'),
    create: (data: { name: string; industry?: string; website?: string; city?: string }) =>
      request<{ id: number; name: string; industry: string }>('/businesses', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },
  feed: {
    list: () =>
      request<Array<{ id: number; authorName: string; content: string; createdAt: string; likes: number }>>('/feed'),
    create: (data: { authorName?: string; content: string }) =>
      request<{ id: number; authorName: string; content: string; createdAt: string; likes: number }>('/feed', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    like: (id: number) =>
      request<{ id: number; authorName: string; content: string; createdAt: string; likes: number }>(`/feed/${id}/like`, {
        method: 'POST',
      }),
  },
};
