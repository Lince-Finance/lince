
import { GetServerSideProps, GetServerSidePropsContext } from 'next';

let _csrfCache = { token: '', exp: 0 };
async function getCachedCsrf(cookie = ''): Promise<string> {
  
  if (_csrfCache.exp > Date.now()) return _csrfCache.token;

  
  const r = await fetch(
    `${process.env.NEXT_PUBLIC_AUTH_BASE_URL}/auth/csrf-token`,
    { headers: { cookie,  accept: 'application/json' } },
  );

  
  const token =
    r.status === 204
      ? r.headers.get('x-csrf-token') || ''
      : (await r.json()).csrfToken ?? '';

  _csrfCache = { token, exp: Date.now() + 60_000 };   
  return token;
}





export async function fetchCsrfToken(cookie: string): Promise<string> {
  try {
    const base = process.env.NEXT_PUBLIC_AUTH_BASE_URL!;
    const r = await fetch(`${base}/auth/csrf-token`, {
      method : 'GET',
      headers: { cookie },      
    });
    if (!r.ok) return '';
    const { csrfToken = '' } = await r.json();
    return csrfToken;
  } catch {
    return '';
  }
}

export function withUserSSR(gssp?: GetServerSideProps) {
  return async (ctx: GetServerSidePropsContext) => {
    console.log("[withUserSSR] SSR =>", ctx.req.url);
    const cookies = ctx.req.headers.cookie || '';

    
    const baseAuthUrl = process.env.NEXT_PUBLIC_AUTH_BASE_URL;
    const profileRes = await fetch(`${baseAuthUrl}/user/profile`, {
      method: 'GET',
      headers: { cookie: cookies }, 
      
    });

    if (!profileRes.ok) {
      
      return {
        redirect: {
          destination: '/auth/signIn',
          permanent: false,
        },
      };
    }

    
    const data = await profileRes.json();
    const user = data.profile; 

    
    const csrfToken = await getCachedCsrf(cookies);

    
    let result = { props: {} };
    if (gssp) {
      
      result = await gssp(ctx) as any; 
      if (!result.props) result.props = {};
    }

    
    return {
      ...result,
      props: {
        ...result.props,
        user,
        csrfToken,
      },
    };
  };
}
