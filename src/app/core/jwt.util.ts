import { UserProfile } from './api.models';

export interface DemoJwtPayload {
  sub: string;
  email: string;
  name: string;
  role: UserProfile['role'];
  exp: number;
  iat: number;
}

function encodeBase64Url(value: string): string {
  return btoa(unescape(encodeURIComponent(value)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function decodeBase64Url(value: string): string {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padding = '='.repeat((4 - (normalized.length % 4)) % 4);

  return decodeURIComponent(escape(atob(`${normalized}${padding}`)));
}

export function createDemoJwt(user: UserProfile, expiresInMinutes: number): string {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload: DemoJwtPayload = {
    sub: String(user.id),
    email: user.email,
    name: user.name,
    role: user.role,
    iat: now,
    exp: now + expiresInMinutes * 60
  };

  return [
    encodeBase64Url(JSON.stringify(header)),
    encodeBase64Url(JSON.stringify(payload)),
    encodeBase64Url(`nomadtrips-demo-${user.id}`)
  ].join('.');
}

export function decodeDemoJwt(token: string | null): DemoJwtPayload | null {
  if (!token) {
    return null;
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    return null;
  }

  try {
    return JSON.parse(decodeBase64Url(parts[1])) as DemoJwtPayload;
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string | null): boolean {
  const payload = decodeDemoJwt(token);

  if (!payload) {
    return true;
  }

  return payload.exp <= Math.floor(Date.now() / 1000);
}
