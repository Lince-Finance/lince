import csrf from 'csurf';
import { cookieDomain } from '../utils/cookieDomain';

export const csrfProtection = csrf({
  cookie: {
    key      : 'XSRF-TOKEN',
    httpOnly : false,
    secure   : true,
    sameSite : 'none',
    path     : '/',
    maxAge   : 24 * 60 * 60,
    //domain : cookieDomain(),
  },
});
