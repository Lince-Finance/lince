import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { parse as parseCookie } from 'cookie';

/* ╭──────────────────────────────────────────────────────────────╮
   │            Helpers / utilidades de depuración                │
   ╰──────────────────────────────────────────────────────────────╯ */
const ts = () => new Date().toISOString().split('T')[1].replace('Z', '');
const dbg = (tag: string, ...m: any[]) =>
  console.log(`[SSR ${ts()}] ${tag} ›`, ...m.map(serialise));

function serialise(v: any) {
  if (typeof v === 'string' && v.length > 120) return v.slice(0, 120) + '…';
  if (typeof v === 'object') {
    try {
      return JSON.stringify(v, (_, val) =>
        typeof val === 'string' && val.length > 120
          ? val.slice(0, 120) + '…'
          : val,
        2,
      );
    } catch { /* ignore */ }
  }
  return v;
}

/* ╭──────────────────────────────────────────────────────────────╮
   │                 Cache CSRF compartida (1 min)                │
   ╰──────────────────────────────────────────────────────────────╯ */
let _csrfCache = { token: '', exp: 0 };

export async function fetchCsrfToken(cookie = ''): Promise<string> {
  dbg('fetchCsrfToken:IN', { cookie });
  try {
    const r = await fetch(
      `${process.env.NEXT_PUBLIC_AUTH_BASE_URL}/auth/csrf-token`,
      { headers: { cookie, accept: 'application/json' } },
    );
    dbg('fetchCsrfToken:RES', r.status);
    if (!r.ok) return '';
    return r.status === 204
      ? r.headers.get('x-csrf-token') || ''
      : (await r.json()).csrfToken ?? '';
  } catch (e) {
    dbg('fetchCsrfToken:ERR', e);
    return '';
  }
}

/* ╭──────────────────────────────────────────────────────────────╮
   │                    SSR  H O C                                │
   ╰──────────────────────────────────────────────────────────────╯ */
export function withUserSSR(gssp?: GetServerSideProps) {
  return async (ctx: GetServerSidePropsContext) => {
    let rawCookies = (ctx.req.headers.cookie || '')
      .split(/;\s*/)
      .filter(p => !p.trim().startsWith('XSRF-TOKEN='))
      .join('; ');

    const cookies = parseCookie(rawCookies);


    const base     = process.env.NEXT_PUBLIC_AUTH_BASE_URL!;
    dbg('ENTRY', { url: ctx.req.url, rawCookies });

    /* ╭────────────────────────────────────────────────────────╮
       │   Funciones internas (scope por request)               │
       ╰────────────────────────────────────────────────────────╯ */

    const getCachedCsrf = async (forceFresh = false): Promise<string> => {
      dbg('getCachedCsrf:IN', { forceFresh, cache: _csrfCache });
      if (!forceFresh && _csrfCache.exp > Date.now() && _csrfCache.token) {
        dbg('getCachedCsrf:CACHE_HIT');
        return _csrfCache.token;
      }

      const r = await fetch(`${base}/auth/csrf-token`, {
        headers: { cookie: rawCookies, accept: 'application/json' },
      });
      dbg('getCachedCsrf:FETCH', r.status);

      const token =
        r.status === 204
          ? r.headers.get('x-csrf-token') || ''
          : (await r.json()).csrfToken ?? '';


      _csrfCache = { token, exp: Date.now() + 60_000 };


      dbg('getCachedCsrf:NEW', _csrfCache);
      return token;
    };

    const getCsrfHeader = async (forceFresh = false) => {
      dbg('getCsrfHeader:IN', { forceFresh });

      if (!forceFresh && _csrfCache.exp > Date.now() && _csrfCache.token) {
        dbg('getCsrfHeader:cacheHit');
        return { 'x-csrf-token': _csrfCache.token };
      }


      const fresh = await getCachedCsrf(forceFresh);
      dbg('getCsrfHeader:FRESH', fresh);
      return { 'x-csrf-token': fresh };
    };

    const makeHeaders = async (
      extra: Record<string, string> = {},
      addAuth = false,
    ): Promise<Record<string, string>> => {
      const h: Record<string, string> = {
        accept : 'application/json',
        ...(await getCsrfHeader()),
        ...extra,
      };
      if (rawCookies) h.cookie = rawCookies;

      if (addAuth) {
        if (cookies.accessToken) h.Authorization = `Bearer ${cookies.accessToken}`;
        else if (cookies.idToken)          h.Authorization = `Bearer ${cookies.idToken}`;
      }
      dbg('makeHeaders', { addAuth, h });
      return h;
    };

    let profileRes = await fetch(`${base}/user/profile`, {
      method : 'GET',
      headers: await makeHeaders(),
    });
    dbg('1st /user/profile', profileRes.status);

    const needsRefresh =
      profileRes.status === 401 ||
      (profileRes.status === 403 && profileRes.headers.get('x-refresh-required'));
    dbg('needRefresh?', needsRefresh);

    if (needsRefresh) {
      const canRefresh = Boolean(cookies.refreshToken);
      dbg('canRefresh?', canRefresh, 'refreshToken:', serialise(cookies.refreshToken));
    
      if (canRefresh) {
        const csrfHeader = await getCsrfHeader(true);
        const csrfToken  = csrfHeader['x-csrf-token'];
        dbg('refresh:csrfHeader', csrfHeader);
    
        const refreshHeaders = {
          cookie         : rawCookies,
          accept         : 'application/json',
          'content-type' : 'application/json',
          'x-csrf-token' : csrfToken,
        };
        
        const refreshBody = '{}';
        
        const refreshRes = await fetch(`${base}/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
          headers: refreshHeaders,
          body: refreshBody,
        });
        
        dbg('/auth/refresh status', refreshRes.status);
        
        const bodyTxt = await refreshRes.text().catch(() => '');
        dbg('/auth/refresh body', bodyTxt);
        
        let rawSetCookies: string[] =
          (refreshRes.headers as any).raw?.()['set-cookie'] ??
          (refreshRes.headers as any).getSetCookie?.() ??
          [];
          rawSetCookies = rawSetCookies.filter(
            c => !c.startsWith('XSRF-TOKEN='),
        );
        dbg('/auth/refresh set-cookie (filtered)', rawSetCookies);

        if (refreshRes.ok) {
          if (rawSetCookies.length) {
            ctx.res.setHeader('set-cookie', rawSetCookies);
          }
          
          _csrfCache = { token: '', exp: 0 };
          await getCachedCsrf(true);
          
          profileRes = await fetch(`${base}/user/profile`, {
            method: 'GET',
            headers: await makeHeaders({}, true),
          });
          dbg('2nd /user/profile', profileRes.status);
        }
        
        if (!refreshRes.ok || !profileRes.ok) {
          dbg('redirect → /auth/signIn');
          return { redirect: { destination: '/auth/signIn', permanent: false } };
        }
      } else {
        dbg('redirect → /auth/signIn (no refresh token)');
        return { redirect: { destination: '/auth/signIn', permanent: false } };
      }
    }

    if (!profileRes.ok) {
      const body = await profileRes.text().catch(() => '');
      const dest =
        profileRes.status === 403 && body.includes('Invite pending')
          ? '/auth/invite'
          : '/auth/signIn';
      dbg('final redirect', { dest, status: profileRes.status, body });
      return { redirect: { destination: dest, permanent: false } };
    }

    const { profile: user } = await profileRes.json();
    dbg('profile OK', user?.email ?? '(sin email)');

    await getCachedCsrf();

    if (gssp) {
      dbg('delegating to gssp');
      const r = await gssp(ctx);
      return 'props' in r ? { ...r, props: { ...r.props, user } } : r;
    }

    return { props: { user } };
  };
}

