import type { RequestHandler } from 'express';
import csrf from 'csurf';
import { getBaseDomain } from '../utils/baseDomain';

declare module 'express-serve-static-core' {
  interface Request {
    csrfToken(): string;
  }
}

const realCsrf: RequestHandler = csrf({
  cookie: {
    key      : 'XSRF-TOKEN',
    httpOnly : false,
    secure   : true,
    sameSite : 'none',
    path     : '/',
    maxAge   : 24 * 60 * 60,
    // domain: '.' + getBaseDomain(),
  },
}) as unknown as RequestHandler;

export const csrfProtection: RequestHandler = (req, res, next) => {
  console.log('[CSRF] check', req.method, req.path);

  realCsrf(req, res, (err: any) => {
    if (err) console.log('[CSRF] ✖', err.code || err.message);
    next(err);
  });
};

export const sendCsrfToken: RequestHandler = (req, res) => {
  const token = req.csrfToken();

  res.locals._csrf = token;
  res.setHeader('Cache-Control', 'no-store, private');
  res.json({ csrfToken: token });
};
