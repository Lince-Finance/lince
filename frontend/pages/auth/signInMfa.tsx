import React, { useState } from 'react';
import { useRouter } from 'next/router';
import AuthLayout from '../../components/AuthLayout';
import { csrfFetch } from '../../utils/fetcher';

interface Props { mfaToken: string | null }
export default function SignInMfaPage({ mfaToken }: Props) {
  const router  = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_AUTH_BASE_URL;
  const [msg, setMsg]   = useState('');
  const [totpCode, setTotpCode] = useState('');

  if (!mfaToken) {
    if (typeof window !== 'undefined') router.replace('/auth/signIn');
    return null;
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setMsg('');
    if (!mfaToken) {
      setMsg('Missing MFA token. Please sign in again.');
      router.replace('/auth/signIn');
      return;
    }
    try {
      const res = await csrfFetch(`${baseUrl}/auth/signinmfa`, {
        method: 'POST',
        body: JSON.stringify({ mfaToken, totpCode })
      });
      const data = await res.json();
      sessionStorage.removeItem('mfaToken');
      setMsg('MFA verified. Redirecting...');
      setTimeout(() => {
        router.push('/user/dashboard');
      }, 1500);
    } catch (err: any) {
      setMsg(`Error: ${err.message}`);
    }
  }

  return (
    <AuthLayout>
      <h1>Sign In - MFA</h1>
      <p>Enter your TOTP code from Authenticator</p>
      {mfaToken && (
        <form onSubmit={handleVerify}>
          <input
            type="text"
            value={totpCode}
            onChange={e => setTotpCode(e.target.value)}
          />
          <button type="submit">Submit MFA Code</button>
        </form>
      )}
      {msg && <p>{msg}</p>}
    </AuthLayout>
  );
}

export const getServerSideProps = async ({ req }) => {
  return {
    props: { mfaToken: req.cookies.mfaToken ?? null },
  };
};