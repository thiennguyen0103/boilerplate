import { apiFetch } from './api-client';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  status: string;
  emailVerified: boolean;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  tokenType: 'Bearer';
}

// The access token lives in memory only. The refresh token is an HttpOnly cookie
// the browser sends to /auth routes, so a page reload recovers via refresh().
let accessToken: string | null = null;

export function getAccessToken(): string | null {
  return accessToken;
}

async function authenticate(
  path: string,
  body?: unknown,
): Promise<AuthResponse> {
  const result = await apiFetch<AuthResponse>(path, {
    method: 'POST',
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  accessToken = result.accessToken;
  return result;
}

function authorizedFetch<T>(path: string, init?: RequestInit): Promise<T> {
  return apiFetch<T>(path, {
    ...init,
    headers: {
      ...init?.headers,
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  });
}

export const authClient = {
  register(input: { email: string; password: string; name: string }) {
    return authenticate('/auth/register', input);
  },

  login(input: { email: string; password: string }) {
    return authenticate('/auth/login', input);
  },

  loginWithGoogle(idToken: string) {
    return authenticate('/auth/google', { idToken });
  },

  async refresh(): Promise<AuthResponse> {
    try {
      return await authenticate('/auth/refresh');
    } catch (error) {
      accessToken = null;
      throw error;
    }
  },

  async logout(): Promise<void> {
    try {
      await apiFetch<void>('/auth/logout', { method: 'POST' });
    } finally {
      accessToken = null;
    }
  },

  async me(): Promise<AuthUser> {
    const result = await authorizedFetch<{ data: AuthUser }>('/auth/me');
    return result.data;
  },
};
