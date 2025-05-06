import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import UserLayout from '../../components/UserLayout';
import { csrfFetch } from '../../utils/fetcher';
import { withUserSSR } from '../../lib/withUserSSR';

function ProfilePage() {
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_AUTH_BASE_URL;
  const [loading, setLoading] = useState(true);
  const [isMfaEnabled, setIsMfaEnabled] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await csrfFetch(`${baseUrl}/user/mfa-status`, {
          method: 'POST'
        });
        const data = await res.json();
        setIsMfaEnabled(data.isMfaEnabled);
      } catch (err: any) {
        setMsg(`Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  if (loading) {
    return null;
  }

  return (
    <UserLayout>
      <h1>User Profile</h1>
      <p>Información del usuario.</p>
      {msg && <p>{msg}</p>}
      <div style={{ marginTop: '1rem' }}>
        <button onClick={() => router.push('/user/changePassword')}>
          Change Password
        </button>
        {!isMfaEnabled && (
          <button onClick={() => router.push('/user/mfaAssociate')}>
            Configure MFA
          </button>
        )}
      </div>
    </UserLayout>
  );
}

export const getServerSideProps = withUserSSR();

export default ProfilePage;
