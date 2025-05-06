
import React from 'react';
import UserLayout from '../../components/UserLayout';
import { withUserSSR, fetchCsrfToken } from '../../lib/withUserSSR';
import { setInitialCsrfToken } from '../../utils/csrf';

type BuyCryptoPageProps = {
  onramperUrl?: string;
  csrfToken?: string;          
};

function BuyCryptoPage({ onramperUrl = '', csrfToken = '' }: BuyCryptoPageProps) {
  
  React.useEffect(() => {
    if (csrfToken) setInitialCsrfToken(csrfToken);
  }, [csrfToken]);

  return (
    <UserLayout>
      <h1>Buy Crypto with Onramper</h1>

      {onramperUrl && new URL(onramperUrl).protocol === 'https:' ? (
        <iframe src={onramperUrl} width="100%" height="600" sandbox="allow-scripts allow-same-origin allow-forms" />
      ) : (
        <p>Loading Onramper URL failed or returned empty.</p>
      )}
    </UserLayout>
  );
}

export const getServerSideProps = withUserSSR(async (ctx) => {
  try {
    const basePaymentsUrl   = process.env.NEXT_PUBLIC_PAYMENTS_BASE_URL!;
    const forwardCookies    = ctx.req.headers.cookie || ''; 
    const { csrfToken: csrf } = ctx as any;
    const resp = await fetch(`${basePaymentsUrl}/payments/onramper/createUrl`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        cookie: forwardCookies,
        'X-Csrf-Token' : csrf,
      },
      body: JSON.stringify({
        sourceCurrency: 'usd',
        amount:         100,
        country:        'us',
        wallets: [
          { currency: 'eth', address: '0xE7dCF29b5B0B4C34AdaA0455F9e670F5F0511109' },
          { currency: 'sol', address: '3MySoLaNaAddress...' },
        ],
      }),
    });

    if (!resp.ok) throw new Error(`payments service → ${resp.status}`);

    const { url } = await resp.json();
    return { props: { onramperUrl: url ?? '' } };

  } catch (err) {
    console.error('[buyCrypto] SSR error:', err);
    return { props: { onramperUrl: '' } };
  }
});

export default BuyCryptoPage;
