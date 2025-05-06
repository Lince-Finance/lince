import express, { ErrorRequestHandler, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import csrf from 'csurf';
import cors, { CorsOptionsDelegate } from 'cors';
import proxyaddr from 'proxy-addr';

import { getAllowedOrigins } from './utils/allowedOrigins';
import authRoutes            from './routes/authRoutes';
import userRoutes            from './routes/userRoutes';
import { csrfRateLimiter }   from './middleware/rateLimiter';


let CF_CIDRS = [
  '173.245.48.0/20','103.21.244.0/22','103.22.200.0/22','103.31.4.0/22',
  '141.101.64.0/18','108.162.192.0/18','190.93.240.0/20','188.114.96.0/20',
  '197.234.240.0/22','198.41.128.0/17','162.158.0.0/15','104.16.0.0/13',
  '104.24.0.0/14','172.64.0.0/13','131.0.72.0/22',
  '2400:cb00::/32','2606:4700::/32','2803:f800::/32','2405:b500::/32',
  '2405:8100::/32','2a06:98c0::/29','2c0f:f248::/32',
];


let isFromCF = proxyaddr.compile(CF_CIDRS) as (addr: string, i: number) => boolean;


async function refreshCfCidrs(): Promise<void> {
  const abort = new AbortController();
  const timer = setTimeout(() => abort.abort(), 1_500).unref();

  try {
    const resp = await fetch('https://api.cloudflare.com/client/v4/ips',
                             { signal: abort.signal });
    clearTimeout(timer);

    const json: any = await resp.json();
    if (json.success &&
        Array.isArray(json.result?.ipv4_cidrs) &&
        Array.isArray(json.result?.ipv6_cidrs)) {

      CF_CIDRS = [...json.result.ipv4_cidrs, ...json.result.ipv6_cidrs];
      isFromCF = proxyaddr.compile(CF_CIDRS) as any;

      console.log('[CF] rangos actualizados →', CF_CIDRS.length);
    } else {
      throw new Error('Formato de respuesta inesperado');
    }
  } catch (err) {
    console.warn('[CF] no pude descargar rangos; sigo con la lista local');
  }
}
refreshCfCidrs().catch(() => {});
setInterval(refreshCfCidrs, 86_400_000).unref();   


const app = express();


app.set('trust proxy', (addr: string, idx: number) =>
  Boolean(addr && isFromCF(addr, idx)),
);

app.use((req, _res, next) => {
  console.log('[HTTP]', req.method, req.originalUrl);
  next();
});


const allowed = new Set(getAllowedOrigins());
const corsOpts: CorsOptionsDelegate<Request> = (req, cb) => {
  const origin = req.headers.origin ?? '';
  cb(null, allowed.has(origin)
    ? { origin: true, credentials: true, optionsSuccessStatus: 204 }
    : { origin: false });
};
app.use(cors(corsOpts));
app.options('*', cors(corsOpts));


app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
    contentSecurityPolicy: {
      directives: {
        …
      },
    },
  }),
);

app.use(cookieParser());
app.use(express.json());


const csrfProtection = csrf({
  cookie: {
    key: '_csrf',
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
    maxAge: 24 * 60 * 60,
  },
});


app.get('/auth/csrf-token', csrfRateLimiter, csrfProtection, (req, res) => {
  const wantsJson = (req.get('accept') || '').includes('application/json');
  if (wantsJson) {
    return res.json({ csrfToken: res.locals._csrf as string });
  }
  res.setHeader('x-csrf-token', res.locals._csrf as string);
  return res.status(204).end();
});


app.use('/auth', authRoutes);
app.use('/user', userRoutes);


app.use((_req, res) => res.status(404).json({ error: 'Not Found' }));
const errorMw: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error('UNCAUGHT', err);
  if ((err as any).code === 'EBADCSRFTOKEN') {
    return res.status(403).json({ error: 'CSRF token inválido o ausente' });
  }
  res.status(500).json({ error: err.message ?? 'Internal Server Error' });
};
app.use(errorMw);

export default app;