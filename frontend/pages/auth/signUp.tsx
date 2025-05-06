import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AuthLayout from '../../components/AuthLayout';
import { csrfFetch } from '../../utils/fetcher';
import Cookies from 'js-cookie';
import { getPasswordPolicy } from '../../utils/passwordPolicy';

export default function SignupPage() {
  const baseUrl = process.env.NEXT_PUBLIC_AUTH_BASE_URL;
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [policy, setPolicy] = useState<{minLength:number}>({minLength:8});

  
  function validatePwd(pwd:string) {
    return pwd.length >= policy.minLength;
    
    
  }
  
  useEffect(() => {        
    getPasswordPolicy().then(setPolicy);
  }, []);

  const [msg, setMsg] = useState('');
  const [displayName, setDisplayName] = useState('');

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setMsg('');

    if (!validatePwd(password)) {
      setMsg(`Password must be at least ${policy.minLength} characters`);
      return;
    }

    if (password !== confirmPassword) {
      setMsg('Passwords do not match. Please check and try again.');
      return;
    }
    try {
      const inviteCode = Cookies.get('inviteCode') ?? '';
      const res = await csrfFetch(`${baseUrl}/auth/signup`, {
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
          displayName,
          inviteCode
        })
      });
      await res.json();                              
      setMsg('Signup OK. Check your email for the code.');
      router.push('/auth/confirm');
    } catch (err: any) {
      setMsg(`Error: ${err.message}`);
    }
  }

  return (
    <AuthLayout>
      <h1>Signup</h1>
      <form onSubmit={handleSignup}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            placeholder="Name"
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
          />
        </div>
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
          <p style={{fontSize:12,opacity:.7,margin:0}}>
            Minimum length: {policy.minLength}
          </p>
        </div>
        <div>
          <label>Confirm Password:</label>
          <input
            type="password"
            autoComplete="off"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />
        </div>
        <button type="submit">Sign Up</button>
      </form>
      {msg && <p>{msg}</p>}
      <div style={{ marginTop: '1rem' }}>
        <p>Already have an account?</p>
        <Link href="/auth/signIn">Sign In</Link>
      </div>
    </AuthLayout>
  );
}