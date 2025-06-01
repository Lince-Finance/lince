// Currently integrating payment via crypto transactions.

import React from 'react';
import UserLayout from '../../components/UserLayout';
import { withUserSSR } from '../../lib/withUserSSR';

type BuyCryptoPageProps = { onramperUrl?: string };

function BuyCryptoPage({ onramperUrl = '' }: BuyCryptoPageProps) {
  React.useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_PAYMENTS_BASE_URL}/payments/csrf-token`,
          { credentials: 'include' }).catch(() => {});
  }, []);

  return (
    <UserLayout>
      <p style={{ fontWeight: 'bold', color: 'grayCliff.solid.100', marginBottom: '20px' }}>
        Currently integrating payment via crypto transactions.
      </p>
      <h1>Buy Crypto with Onramper</h1>

      {onramperUrl && new URL(onramperUrl).protocol === 'https:' ? (
        <iframe
          src={onramperUrl}
          width="100%"
          height="600"
          sandbox="allow-scripts allow-same-origin allow-forms"
        />
      ) : (
        <p>Loading Onramper URL failed or returned empty.</p>
      )}
    </UserLayout>
  );
}

export const getServerSideProps = withUserSSR(async (ctx) => {
  try {
    const basePaymentsUrl = process.env.NEXT_PUBLIC_PAYMENTS_BASE_URL!;
    const clientCookies   = ctx.req.headers.cookie ?? '';

    const csrfResp = await fetch(`${basePaymentsUrl}/payments/csrf-token`, {
      headers: { cookie: clientCookies },
    });
    if (!csrfResp.ok) throw new Error('csrf-token failed');
    const { csrfToken } = await csrfResp.json();
    
    const setCookieHeader = csrfResp.headers.get('set-cookie') ?? '';
    const firstCookie     = setCookieHeader.split(/,(?=[^;]+?=)/)[0];
    const xsrfCookiePair  = firstCookie.split(';')[0];
    const mergedCookies   = [clientCookies, xsrfCookiePair].filter(Boolean).join('; ');
    

    const createResp = await fetch(`${basePaymentsUrl}/payments/onramper/createUrl`, {
      method : 'POST',
      headers: {
        'Content-Type': 'application/json',
        cookie        : mergedCookies,
        'X-Csrf-Token': csrfToken,
      },
      body: JSON.stringify({
        sourceCurrency: 'usd',
        amount:         100,
        country:        'us',
        wallets: [
          { currency: 'eth', address: '0xE7dCF29b5B0B4C34AdaA0455F9e670F5F0511109' },
          { currency: 'sol', address: '3MySoLaNaAddressAddressAddress' },
        ],
      }),
    });

    if (!createResp.ok)
      throw new Error(`payments service → ${createResp.status}`);

    const { url } = await createResp.json();

    return {
      props: { onramperUrl: url ?? '' },
    };
  } catch (err) {
    console.error('[buyCrypto] SSR error:', err);
    return { props: { onramperUrl: '' } };
  }
});

export default BuyCryptoPage;
