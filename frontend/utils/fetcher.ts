
import { ensureCsrfToken, invalidateCsrfToken } from './csrf';

const BASE_URL = (process.env.NEXT_PUBLIC_AUTH_BASE_URL || '').replace(/\/$/, '');
let refreshPromise: Promise<void> | null = null;

export async function csrfFetch(
  url: string,
  options: RequestInit = {},
  _retry = false,
) {
  const token = await ensureCsrfToken();

  const res = await fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Csrf-Token': token,
      ...(options.headers || {}),
    },
  });

  
  if (res.status === 403 && !_retry) {
    invalidateCsrfToken();
    return csrfFetch(url, options, true);
  }

  
  
  if (res.status === 403 && res.headers.get('x-refresh-required')) {

    
    if (_retry) {
      throw new Error('Session expired');     
    }

    
    if (!refreshPromise) {
      refreshPromise = fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'X-Csrf-Token': await ensureCsrfToken() },
      })
        .then(r => {
          if (!r.ok) throw new Error(`refresh → ${r.status}`);
        })
        .finally(() => { refreshPromise = null; });
    }

    await refreshPromise;    
    invalidateCsrfToken();   
    return csrfFetch(url, options, true);   
  }

  
  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try {
      const { error } = await res.json();
      if (error) msg = error;
    } catch {}
    throw new Error(msg);
  }

  return res;
}
