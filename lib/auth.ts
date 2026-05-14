import { cookies } from 'next/headers';
import crypto from 'crypto';

const SESSION_COOKIE = 'session';

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':');
  const verify = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hash === verify;
}

export function createSession(user: { id: number; username: string; nombre: string; rol: string }): string {
  const data = { userId: user.id, username: user.username, nombre: user.nombre, rol: user.rol };
  return Buffer.from(JSON.stringify(data)).toString('base64');
}

export function parseSession(sessionValue: string): { userId: number; username: string; nombre: string; rol: string } | null {
  try {
    return JSON.parse(Buffer.from(sessionValue, 'base64').toString('utf8'));
  } catch {
    return null;
  }
}

export async function getSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE);
  if (!sessionCookie) return null;
  return parseSession(sessionCookie.value);
}
