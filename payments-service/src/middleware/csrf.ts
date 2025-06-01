import csrf from 'csurf';
import { Request, Response, NextFunction } from 'express';
import { getBaseDomain } from '../utils/baseDomain';

const realCsrf = csrf({
  cookie: {
    key: 'XSRF-TOKEN',
    httpOnly: false,
    secure: true,
    sameSite: 'none',
    path: '/',
    maxAge: 24 * 60 * 60,
    //domain: '.' + getBaseDomain(),
  },
});

export function csrfProtection(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.log('[CSRF] check', req.method, req.path);
  realCsrf(req, res, (err: any) => {
    if (err) console.log('[CSRF] ✖', err.code || err.message);
    next(err);
  });
}

export function sendCsrfToken(req: Request, res: Response) {
  const token = req.csrfToken();

  res.locals._csrf = token;

  res.setHeader('Cache-Control', 'no-store, private');
  res.json({ csrfToken: token });
}

export function excludePublicWebhook(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  return req.path.toLowerCase() === '/webhook'
    ? next()
    : csrfProtection(req, res, next);
}
