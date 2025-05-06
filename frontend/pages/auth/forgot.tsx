import React, { useState } from 'react';
import { useRouter } from 'next/router';
import AuthLayout from '../../components/AuthLayout';
import { csrfFetch } from '../../utils/fetcher';

export default function ForgotPage() {
  const baseUrl = process.env.NEXT_PUBLIC_AUTH_BASE_URL;
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault();
    setMsg('');
    try {
      const res = await csrfFetch(`${baseUrl}/auth/forgot`, {
        method: 'POST',
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      setMsg('A code has been sent to your email. Redirecting to reset...');
      setTimeout(() => {
        router.push(`/auth/reset?email=${encodeURIComponent(email)}`);
      }, 1500);
    } catch (err: any) {
      setMsg(`Error: ${err.message}`);
    }
  }

  return (
    <AuthLayout>
      <h1>Forgot Password</h1>
      <form onSubmit={handleForgot}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <button type="submit">Send Code</button>
      </form>
      {msg && <p>{msg}</p>}
    </AuthLayout>
  );
}
