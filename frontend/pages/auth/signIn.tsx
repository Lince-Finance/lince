import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AuthLayout from '../../components/AuthLayout';
import { csrfFetch } from '../../utils/fetcher';

export default function SignInPage() {
  const baseUrl = process.env.NEXT_PUBLIC_AUTH_BASE_URL;
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setMsg('');

    try {
      const res = await csrfFetch(`${baseUrl}/auth/signin`, {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      console.log("FRONT Step1 - signIn response =>", data);

      if (data.challenge === 'SOFTWARE_TOKEN_MFA') {
        router.push('/auth/signInMfa');
      } else if (data.tokenType) {
        setMsg('Sign in successful. Redirecting...');
        setTimeout(() => {
          router.push('/user/dashboard');
        }, 1000);
      } else {
        setMsg('Unexpected response.');
      }
    } catch (err: any) {
      console.error('SignIn error =>', err);
      setMsg(`Error: ${err.message}`);
    }
  }

  return (
    <AuthLayout>
      <h1>Sign In</h1>

      <form onSubmit={handleSignIn}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            autoComplete="off"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            autoComplete="off"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Sign In</button>
      </form>
      {msg && <p>{msg}</p>}

      <div style={{ marginTop: '1rem' }}>
      <a href={`${process.env.NEXT_PUBLIC_AUTH_BASE_URL}/auth/google/login`}>
        Sign in with Google
      </a>
      <br />
      <a href={`${process.env.NEXT_PUBLIC_AUTH_BASE_URL}/auth/apple/login`}>
        Sign in with Apple
      </a>
      </div>


      <p style={{ marginTop: '1rem' }}>
        <Link href="/auth/forgot">Forgot your password?</Link>
      </p>

      <p style={{ marginTop: '1rem' }}>
        <Link href="/auth/signUp">Register here</Link>
      </p>
    </AuthLayout>
  );
}
