import React, { useState } from 'react';
import { useRouter } from 'next/router';
import UserLayout from '../../components/UserLayout';
import { QRCodeSVG } from 'qrcode.react';
import { csrfFetch } from '../../utils/fetcher';
import { withUserSSR } from '../../lib/withUserSSR';

function MfaAssociatePage() {
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_AUTH_BASE_URL;
  const [msg, setMsg] = useState('');
  const [otpauthUri, setOtpauthUri] = useState('');

  async function handleAssociate() {
    setMsg('Associating TOTP...');
    try {
      const res = await csrfFetch(`${baseUrl}/user/mfa-associate`, {
        method: 'POST'
      });
      const data = await res.json();
      setMsg('TOTP Associated. Scan the QR code below, then verify it!');
      setOtpauthUri(data.otpauthUri);
    } catch (err: any) {
      setMsg(`Error: ${err.message}`);
    }
  }

  return (
    <UserLayout>
      <h1>Associate MFA (Step 1)</h1>
      <button onClick={handleAssociate}>Associate TOTP</button>
      {otpauthUri && (
        <div style={{ marginTop: '1rem' }}>
          <p>{msg}</p>
          <QRCodeSVG value={otpauthUri} size={200} />
          <p>{otpauthUri}</p>
          <button
            style={{ marginTop: '1rem' }}
            onClick={() => router.push('/user/mfaVerify')}
          >
            Verify Code
          </button>
        </div>
      )}
      {msg && !otpauthUri && <p>{msg}</p>}
    </UserLayout>
  );
}

export const getServerSideProps = withUserSSR();

export default MfaAssociatePage;
