import React, { useState } from 'react';
import { useRouter } from 'next/router';
import AuthLayout from '../../components/AuthLayout';
import { csrfFetch } from '../../utils/fetcher';
import { GetServerSideProps } from 'next';

interface Props { signupToken: string | null }
export default function ConfirmPage({ signupToken }: Props) {
  const baseUrl = process.env.NEXT_PUBLIC_AUTH_BASE_URL;
  const router  = useRouter();
  const [code, setCode] = useState('');
  const [msg, setMsg] = useState('');

  if (!signupToken) return null;

  async function handleConfirm(e: React.FormEvent) {
    e.preventDefault();
    setMsg('');
    try {
      const res = await csrfFetch(`${baseUrl}/auth/confirm`, {
        method: 'POST',
        body: JSON.stringify({ token: signupToken, code })
      });
      const data = await res.json();
      setMsg('User confirmed successfully!');
      setTimeout(() => {
        router.push('/auth/invite');
      }, 1000);
    } catch (err: any) {
      if (err.message === 'Invalid or expired token') {
        setMsg('Your token has expired. Please sign up again.');
        setTimeout(() => {
          router.push('/auth/signUp');
        }, 1000);
      } else {
        setMsg(`Error: ${err.message}`);
      }
    }
  }

  async function handleResend() {
    try {
      setMsg('Resending code...');
      const res = await csrfFetch(`${baseUrl}/auth/resend`, {
        method: 'POST',
        body: JSON.stringify({ token: signupToken })
      });
      const data = await res.json();
      setMsg('New code sent! Check your email.');
    } catch (err: any) {
      if (err.message === 'Invalid or expired token') {
        setMsg('Token expired. Please sign up again.');
        setTimeout(() => {
          router.push('/auth/signUp');
        }, 1000);
      } else {
        setMsg(`Error: ${err.message}`);
      }
    }
  }

  return (
    <AuthLayout>
      <h1>Confirm Account (with ephemeral token)</h1>
      <form onSubmit={handleConfirm}>
        <div>
          <label>Confirmation Code:</label>
          <input
            type="text"
            value={code}
            onChange={e => setCode(e.target.value)}
          />
        </div>
        <button type="submit">Confirm</button>
      </form>
      <button onClick={handleResend}>Resend Code</button>
      {msg && <p>{msg}</p>}
    </AuthLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const signupToken = req.cookies.signupToken ?? null;

  
  if (!signupToken) {
    return {
      redirect: { destination: '/auth/signUp', permanent: false },
    };
  }

  
  return { props: { signupToken } };
};
