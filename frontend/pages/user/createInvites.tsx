import React, { useState } from 'react';
import UserLayout from '../../components/UserLayout';
import { csrfFetch } from '../../utils/fetcher';
import { withUserSSR } from '../../lib/withUserSSR';

interface Invitation {
  inviteCode: string;
  used: boolean;
  createdAt?: string;
}

function CreateInvitesPage() {
  const baseUrl = process.env.NEXT_PUBLIC_AUTH_BASE_URL;
  const [invites, setInvites] = useState<Invitation[]>([]);
  const [msg, setMsg] = useState('');

  async function handleCreateOrList() {
    setMsg('Generating or listing invites...');
    try {
      const res = await csrfFetch(`${baseUrl}/user/invitations`, {
        method: 'POST'
      });
      const data = await res.json();
      setInvites(data.invites);
      setMsg(`You have ${data.invites.length} invites now.`);
    } catch (err: any) {
      setMsg(`Error: ${err.message}`);
    }
  }

  return (
    <UserLayout>
      <h1>Create or Show Invites (Up to 3)</h1>
      <button onClick={handleCreateOrList}>Generate / Show</button>
      {msg && <p>{msg}</p>}
      {invites.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Your Invites</h3>
          <ul>
            {invites.map(inv => (
              <li key={inv.inviteCode}>
                Code: <strong>{inv.inviteCode}</strong>
                {inv.used ? ' (used)' : ' (not used)'}
                {inv.createdAt && <> - created at {inv.createdAt}</>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </UserLayout>
  );
}

export const getServerSideProps = withUserSSR();

export default CreateInvitesPage;
