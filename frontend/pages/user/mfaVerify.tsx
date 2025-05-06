import React, { useState } from 'react';
import { useRouter } from 'next/router';
import UserLayout from '../../components/UserLayout';
import { csrfFetch } from '../../utils/fetcher';
import { withUserSSR } from '../../lib/withUserSSR';

function MfaVerifyPage() {
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_AUTH_BASE_URL;
  const [msg, setMsg] = useState('');
  const [userCode, setUserCode] = useState('');

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setMsg('Verifying TOTP...');
    try {
      const res = await csrfFetch(`${baseUrl}/user/mfa-verify`, {
        method: 'POST',
        body: JSON.stringify({ userCode })
      });
      await res.json();
      setMsg('MFA TOTP verified & enabled successfully!');
      setTimeout(() => {
        router.push('/user/dashboard');
      }, 1500);
    } catch (err: any) {
      setMsg(`Error: ${err.message}`);
    }
  }

  return (
    <UserLayout>
      <h1>Verify MFA (Step 2)</h1>
      <p>Enter your 6-digit code from Authenticator</p>
      <form onSubmit={handleVerify}>
        <input
          type="text"
          value={userCode}
          onChange={e => setUserCode(e.target.value)}
        />
        <button type="submit">Verify TOTP</button>
      </form>
      {msg && <p>{msg}</p>}
    </UserLayout>
  );
}

export const getServerSideProps = withUserSSR();

export default MfaVerifyPage;
