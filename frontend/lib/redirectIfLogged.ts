// lib/redirectIfLogged.ts
import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from 'next';
import { fetchCsrfToken } from './withUserSSR';

/* Campo extra que siempre añadiremos */
type WithCsrf<T> = T & { csrfToken: string };

export function redirectIfLogged<P extends Record<string, any> = {}>(
  gssp?: GetServerSideProps<P>,
): GetServerSideProps<WithCsrf<P>> {

  return async (
    ctx: GetServerSidePropsContext,
  ): Promise<GetServerSidePropsResult<WithCsrf<P>>> => {

    /* ────────────────────────────────────────────────
       1) variables que NECESITAMOS en todo el cuerpo
    ───────────────────────────────────────────────── */
    const rawCookies = ctx.req.headers.cookie ?? '';               // ← ①
    const base       = process.env.NEXT_PUBLIC_AUTH_BASE_URL!;

    /* Llamada al backend para saber si YA está logado */
    const profileRes = await fetch(`${base}/user/profile`, {       // ← ②
      method : 'GET',
      headers: { cookie: rawCookies, accept: 'application/json' },
    });

    /* -------- si SÍ está logado → redirige al dashboard ------ */
    if (profileRes.ok) {
      return {
        redirect: { destination: '/user/dashboard', permanent: false },
      };
    }

    /* -------- si NO está logado → seguimos en página pública -- */
    const csrfToken = await fetchCsrfToken(rawCookies);

    if (!gssp) {
      return { props: { csrfToken } as WithCsrf<P> };
    }

    /* ejecuta el GSSP opcional y agrega el csrfToken */
    const r = await gssp(ctx);
    if ('props' in r) {
      return {
        ...r,
        props: { ...(r.props as P), csrfToken } as WithCsrf<P>,
      };
    }
    return r;                    // redirect / notFound que devuelva gssp
  };
}
