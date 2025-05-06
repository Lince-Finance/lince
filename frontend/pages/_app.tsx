
import { useEffect } from 'react';
import { cacheInviteFromUrl } from '../utils/inviteCookie';
import { setInitialCsrfToken } from '../utils/csrf';

export function reportWebVitals(){}

export default function MyApp({ Component, pageProps }) {
  useEffect(cacheInviteFromUrl, []);   
  
  useEffect(() => { if (pageProps?.csrfToken) setInitialCsrfToken(pageProps.csrfToken); },
            [pageProps?.csrfToken]);
  return <Component {...pageProps} />;
}
