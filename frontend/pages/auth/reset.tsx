import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AuthLayout from '../../components/AuthLayout';
import { csrfFetch } from '../../utils/fetcher';

export default function ResetPage() {
  const baseUrl = process.env.NEXT_PUBLIC_AUTH_BASE_URL;
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (router.query.email) {
      setEmail(router.query.email as string);
    }
  }, [router.query.email]);

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setMsg('');
    if (newPassword !== confirmNewPassword) {
      setMsg('Passwords do not match. Please check and try again.');
      return;
    }
    try {
      const res = await csrfFetch(`${baseUrl}/auth/reset`, {
        method: 'POST',
        body: JSON.stringify({ email, code, newPassword })
      });
      const data = await res.json();
      setMsg('Password reset successfully! Please sign in with your new password.');
      setTimeout(() => {
        router.push('/auth/signIn');
      }, 2000);
    } catch (err: any) {
      setMsg(`Error: ${err.message}`);
    }
  }

  return (
    <AuthLayout>
      <h1>Reset Password</h1>
      <form onSubmit={handleReset}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Code (sent to your email):</label>
          <input
            type="text"
            value={code}
            onChange={e => setCode(e.target.value)}
          />
        </div>
        <div>
          <label>New Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
          />
        </div>
        <div>
          <label>Confirm New Password:</label>
          <input
            type="password"
            value={confirmNewPassword}
            onChange={e => setConfirmNewPassword(e.target.value)}
          />
        </div>
        <button type="submit">Reset</button>
      </form>
      {msg && <p>{msg}</p>}
    </AuthLayout>
  );
}
