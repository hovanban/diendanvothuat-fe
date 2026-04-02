/**
 * API Client - thay thế toàn bộ lib/actions/ khi dùng NestJS backend
 * Tất cả request đều đi qua đây thay vì gọi MongoDB trực tiếp
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: any;
  token?: string;
  cache?: 'default' | 'no-store' | 'reload' | 'no-cache' | 'force-cache' | 'only-if-cached';
};

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, token, cache } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    cache,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Lỗi không xác định' }));
    throw new Error(error.message || `HTTP ${res.status}`);
  }

  return res.json();
}

// ---- Auth ----
export const authApi = {
  login: (email: string, password: string) =>
    request('/auth/login', { method: 'POST', body: { email, password } }),

  register: (data: any) =>
    request('/auth/register', { method: 'POST', body: data }),

  me: (token: string) =>
    request('/auth/me', { token }),
};

// ---- Questions ----
export const questionsApi = {
  getAll: (params: Record<string, any> = {}) =>
    request(`/questions?${new URLSearchParams(params)}`),

  getBySlug: (slug: string) =>
    request(`/questions/${slug}`),

  create: (data: any, token: string) =>
    request('/questions', { method: 'POST', body: data, token }),

  vote: (id: string, voteType: string, token: string) =>
    request(`/questions/${id}/vote`, { method: 'POST', body: { voteType }, token }),

  update: (id: string, data: any, token: string) =>
    request(`/questions/${id}`, { method: 'PATCH', body: data, token }),

  delete: (id: string, token: string) =>
    request(`/questions/${id}`, { method: 'DELETE', token }),
};

// ---- Answers ----
export const answersApi = {
  getByQuestion: (questionId: string, params: Record<string, string | number> = {}) => {
    const filtered: Record<string, string> = {};
    Object.entries(params).forEach(([k, v]) => { if (v !== "" && v !== undefined && v !== null) filtered[k] = String(v); });
    return request(`/answers/question/${questionId}?${new URLSearchParams(filtered)}`);
  },

  create: (data: { content: string; questionId: string; parentAnswerId?: string }, token: string) =>
    request('/answers', { method: 'POST', body: data, token }),

  vote: (id: string, voteType: string, token: string) =>
    request(`/answers/${id}/vote`, { method: 'POST', body: { voteType }, token }),

  edit: (id: string, data: any, token: string) =>
    request(`/answers/${id}`, { method: 'PATCH', body: data, token }),

  delete: (id: string, token: string) =>
    request(`/answers/${id}`, { method: 'DELETE', token }),

  getReplies: (answerId: string) =>
    request(`/answers/${answerId}/replies`),
};

// ---- Tags ----
export const tagsApi = {
  getAll: (params: Record<string, any> = {}) =>
    request(`/tags?${new URLSearchParams(params)}`),

  getTop: (limit = 5) =>
    request(`/tags/top?limit=${limit}`),

  getBySlug: (slug: string) =>
    request(`/tags/${slug}`),

  getQuestions: (slug: string, params: Record<string, any> = {}) =>
    request(`/tags/${slug}/questions?${new URLSearchParams(params)}`),
};

// ---- Users ----
export const usersApi = {
  getAll: (params: Record<string, any> = {}) =>
    request(`/users?${new URLSearchParams(params)}`),

  getById: (id: string) =>
    request(`/users/${id}`),

  getQuestions: (id: string, params: Record<string, any> = {}) =>
    request(`/users/${id}/questions?${new URLSearchParams(params)}`),

  getAnswers: (id: string, params: Record<string, any> = {}) =>
    request(`/users/${id}/answers?${new URLSearchParams(params)}`),

  updateProfile: (data: any, token: string) =>
    request('/users/profile', { method: 'PUT', body: data, token }),

  saveQuestion: (questionId: string, token: string) =>
    request('/users/save-question', { method: 'POST', body: { questionId }, token }),

  getSaved: (params: Record<string, any> = {}, token: string) =>
    request(`/users/saved?${new URLSearchParams(params)}`, { token }),

  getTopTags: (userId: string) =>
    request(`/users/${userId}/top-tags`),
};

// ---- Clubs ----
export const clubsApi = {
  getAll: (params: Record<string, any> = {}) =>
    request(`/clubs?${new URLSearchParams(params)}`),

  getBySlug: (slug: string) =>
    request(`/clubs/${slug}`),

  create: (data: any, token: string) =>
    request('/clubs', { method: 'POST', body: data, token }),

  getReviews: (id: string) =>
    request(`/clubs/${id}/reviews`),

  createReview: (id: string, data: any, token: string) =>
    request(`/clubs/${id}/reviews`, { method: 'POST', body: data, token }),

  getChildClubs: (parentId: string) =>
    request(`/clubs/${parentId}/children`),
};

// ---- Martial Arts ----
export const martialArtsApi = {
  getAll: () => request('/martial-arts'),
  getFeatured: () => request('/martial-arts/featured'),
  getBySlug: (slug: string) => request(`/martial-arts/${slug}`),
};

// ---- Provinces ----
export const provincesApi = {
  getAll: () => request('/provinces'),
};

// ---- Search ----
export const searchApi = {
  global: (query: string, type?: string) =>
    request(`/search?query=${encodeURIComponent(query)}${type ? `&type=${type}` : ''}`),
};

// ---- Affiliate ----
export const affiliateApi = {
  track: (affiliateCode: string) =>
    request('/affiliate/track', { method: 'POST', body: { affiliateCode } }),

  getStats: (token: string) =>
    request('/affiliate/stats', { token }),
};

export const adminApi = {
  getDashboardStats: (token: string) =>
    request('/admin/dashboard/stats', { token }),

  getUsers: (params: any, token: string) =>
    request(`/admin/users?${new URLSearchParams(params).toString()}`, { token }),

  getUser: (id: string, token: string) =>
    request(`/admin/users/${id}`, { token }),

  updateUser: (id: string, data: any, token: string) =>
    request(`/admin/users/${id}`, { method: 'PATCH', body: data, token }),

  deleteUser: (id: string, token: string) =>
    request(`/admin/users/${id}`, { method: 'DELETE', token }),

  getQuestions: (params: any, token: string) =>
    request(`/admin/questions?${new URLSearchParams(params).toString()}`, { token }),

  getQuestion: (id: string, token: string) =>
    request(`/admin/questions/${id}`, { token }),

  updateQuestion: (id: string, data: any, token: string) =>
    request(`/admin/questions/${id}`, { method: 'PATCH', body: data, token }),

  deleteQuestion: (id: string, token: string) =>
    request(`/admin/questions/${id}`, { method: 'DELETE', token }),

  getClubs: (params: any, token: string) =>
    request(`/admin/clubs?${new URLSearchParams(params).toString()}`, { token }),

  getClub: (id: string, token: string) =>
    request(`/admin/clubs/${id}`, { token }),

  updateClub: (id: string, data: any, token: string) =>
    request(`/admin/clubs/${id}`, { method: 'PATCH', body: data, token }),

  approveClub: (id: string, approved: boolean, token: string) =>
    request(`/admin/clubs/${id}/${approved ? 'approve' : 'reject'}`, { method: 'PATCH', token }),

  rejectClub: (id: string, data: any, token: string) =>
    request(`/admin/clubs/${id}/reject`, { method: 'PATCH', body: data, token }),

  toggleHideClub: (id: string, token: string) =>
    request(`/admin/clubs/${id}/toggle-hide`, { method: 'PATCH', token }),

  deleteClub: (id: string, token: string) =>
    request(`/admin/clubs/${id}`, { method: 'DELETE', token }),

  getTags: (params: any, token: string) =>
    request(`/admin/tags?${new URLSearchParams(params).toString()}`, { token }),

  deleteTag: (id: string, token: string) =>
    request(`/admin/tags/${id}`, { method: 'DELETE', token }),

  getMartialArts: (token: string) =>
    request('/martial-arts', { token }),

  createMartialArt: (data: any, token: string) =>
    request('/martial-arts', { method: 'POST', body: data, token }),

  updateMartialArt: (id: string, data: any, token: string) =>
    request(`/martial-arts/${id}`, { method: 'PATCH', body: data, token }),

  deleteMartialArt: (id: string, token: string) =>
    request(`/martial-arts/${id}`, { method: 'DELETE', token }),

  getProvinces: (token: string) =>
    request('/provinces', { token }),

  createProvince: (data: any, token: string) =>
    request('/provinces', { method: 'POST', body: data, token }),

  updateProvince: (id: string, data: any, token: string) =>
    request(`/provinces/${id}`, { method: 'PATCH', body: data, token }),

  deleteProvince: (id: string, token: string) =>
    request(`/provinces/${id}`, { method: 'DELETE', token }),

  getAffiliates: (params: any, token: string) =>
    request(`/admin/affiliates?${new URLSearchParams(params).toString()}`, { token }),

  getComments: (params: any, token: string) =>
    request(`/admin/comments?${new URLSearchParams(params).toString()}`, { token }),

  deleteComment: (id: string, token: string) =>
    request(`/admin/comments/${id}`, { method: 'DELETE', token }),

  blockUserFromComment: (commentId: string, reason: string, token: string) =>
    request(`/admin/comments/${commentId}/block-user`, { method: 'POST', body: { reason }, token }),

  getLandingPages: (params: any, token: string) =>
    request(`/admin/landing-pages?${new URLSearchParams(params).toString()}`, { token }),

  getLandingPage: (id: string, token: string) =>
    request(`/admin/landing-pages/${id}`, { token }),

  createLandingPage: (data: any, token: string) =>
    request('/admin/landing-pages', { method: 'POST', body: data, token }),

  updateLandingPage: (id: string, data: any, token: string) =>
    request(`/admin/landing-pages/${id}`, { method: 'PATCH', body: data, token }),

  deleteLandingPage: (id: string, token: string) =>
    request(`/admin/landing-pages/${id}`, { method: 'DELETE', token }),
};

export default request;
