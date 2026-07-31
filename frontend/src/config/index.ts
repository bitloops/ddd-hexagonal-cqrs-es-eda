const DEFAULT_API_BASE_URL = 'http://localhost:8080';

const configuredUrl = (value: string | undefined, fallback: string): string => {
  const url = value?.trim() || fallback;
  return url.replace(/\/+$/, '');
};

// Vite exposes only VITE_-prefixed variables and substitutes them during the
// build. These values are public client configuration, never secrets.
export const TODO_URL = configuredUrl(import.meta.env.VITE_API_BASE_URL, DEFAULT_API_BASE_URL);
export const OIDC_AUTHORITY = configuredUrl(
  import.meta.env.VITE_OIDC_AUTHORITY,
  'http://localhost:8090/realms/bitloops',
);
export const OIDC_CLIENT_ID = import.meta.env.VITE_OIDC_CLIENT_ID?.trim() || 'todo-frontend';
export const OIDC_REDIRECT_URI = `${window.location.origin}/auth/callback`;
export const OIDC_POST_LOGOUT_REDIRECT_URI = `${window.location.origin}/auth/logout/callback`;
