import type {
  UserProfile,
  Assignment,
  Submission,
  NotificationResponse,
} from '@/types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

function getToken(): string {
  const clientId = import.meta.env.VITE_CLIENT_ID;
  return localStorage.getItem(`${clientId}-token`) || '';
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      Authorization: token ? `Bearer ${token}` : '',
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

// --- Users ---
export function getMe(): Promise<UserProfile> {
  return request('/api/users/me');
}

// --- Assignments ---
export function listAssignments(): Promise<Assignment[]> {
  return request('/api/assignments');
}

export function getAssignment(id: string): Promise<Assignment> {
  return request(`/api/assignments/${id}`);
}

export function createAssignment(data: {
  title: string;
  description?: string;
  due_date?: string;
  file?: File;
}): Promise<Assignment> {
  const form = new FormData();
  form.append('title', data.title);
  if (data.description) form.append('description', data.description);
  if (data.due_date) form.append('due_date', data.due_date);
  if (data.file) form.append('file', data.file);

  return request('/api/assignments', { method: 'POST', body: form });
}

export function updateAssignment(
  id: string,
  data: { title?: string; description?: string; due_date?: string; file?: File },
): Promise<Assignment> {
  const form = new FormData();
  if (data.title) form.append('title', data.title);
  if (data.description !== undefined) form.append('description', data.description);
  if (data.due_date !== undefined) form.append('due_date', data.due_date);
  if (data.file) form.append('file', data.file);

  return request(`/api/assignments/${id}`, { method: 'PUT', body: form });
}

export function deleteAssignment(id: string): Promise<void> {
  return request(`/api/assignments/${id}`, { method: 'DELETE' });
}

// --- Submissions ---
export function submitHomework(
  assignmentId: string,
  data: { file: File; comment?: string },
): Promise<Submission> {
  const form = new FormData();
  form.append('file', data.file);
  if (data.comment) form.append('comment', data.comment);

  return request(`/api/assignments/${assignmentId}/submissions`, {
    method: 'POST',
    body: form,
  });
}

export function listSubmissions(assignmentId: string): Promise<Submission[]> {
  return request(`/api/assignments/${assignmentId}/submissions`);
}

export function gradeSubmission(
  assignmentId: string,
  submissionId: string,
  data: { grade: string; feedback?: string },
): Promise<Submission> {
  return request(
    `/api/assignments/${assignmentId}/submissions/${submissionId}/grade`,
    { method: 'PUT', body: JSON.stringify(data) },
  );
}

// --- Notifications ---
export function getNotifications(): Promise<NotificationResponse> {
  return request('/api/notifications');
}

export function markNotificationRead(id: string): Promise<void> {
  return request(`/api/notifications/${id}/read`, { method: 'PUT' });
}

export function markAllNotificationsRead(): Promise<void> {
  return request('/api/notifications/read-all', { method: 'PUT' });
}
