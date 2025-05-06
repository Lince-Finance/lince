
const BASE_URL = (process.env.NEXT_PUBLIC_AUTH_BASE_URL || '').replace(/\/$/, '');

let cachedToken: string | null      = null;
let inFlight  : Promise<string> | null = null;

export function setInitialCsrfToken(tok: string) {
  if (tok) cachedToken = tok;
}

export async function ensureCsrfToken(): Promise<string> {
  if (cachedToken) return cachedToken;

  if (!inFlight) {
    inFlight = fetch(`${BASE_URL}/auth/csrf-token`, {
      credentials: 'include',
      headers: { accept: 'application/json' },   
    })
      .then(async r => {
        if (r.status === 204) {                 
          return r.headers.get('x-csrf-token') || '';
        }
        const { csrfToken } = await r.json();
        return csrfToken as string;
      })
      .then(tok => {
        cachedToken = tok;
        inFlight = null;
        return tok;
      })
      .catch(e => { inFlight = null; throw e; });
  }
  return inFlight;
}


export function invalidateCsrfToken() {
  cachedToken = null;
}
