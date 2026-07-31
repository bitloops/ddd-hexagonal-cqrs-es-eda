const DEFAULT_API_BASE_URL = 'http://localhost:8080';

const configuredUrl = (value: string | undefined, fallback: string): string => {
  const url = value?.trim() || fallback;
  return url.replace(/\/+$/, '');
};

// Vite exposes only VITE_-prefixed variables and substitutes them during the
// build. These values are public client configuration, never secrets.
export const TODO_URL = configuredUrl(import.meta.env.VITE_API_BASE_URL, DEFAULT_API_BASE_URL);
export const AUTH_URL = configuredUrl(import.meta.env.VITE_AUTH_URL, `${TODO_URL}/auth/login`);
export const REGISTRATION_URL = configuredUrl(
  import.meta.env.VITE_REGISTRATION_URL,
  `${TODO_URL}/auth/register`,
);
