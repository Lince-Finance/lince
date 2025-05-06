import React, { useState } from 'react';
import { useRouter } from 'next/router';
import UserLayout from '../../components/UserLayout';
import { csrfFetch } from '../../utils/fetcher';
import { withUserSSR } from '../../lib/withUserSSR';

function ChangePasswordPage() {
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_AUTH_BASE_URL;
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [msg, setMsg] = useState('');

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setMsg('');
    if (newPassword !== confirmNewPassword) {
      setMsg('New passwords do not match.');
      return;
    }
    try {
      const res = await csrfFetch(`${baseUrl}/user/changePassword`, {
        method: 'POST',
        body: JSON.stringify({
          oldPassword: currentPassword,
          newPassword
        })
      });
      await res.json();
      setMsg('Password changed successfully!');
      setTimeout(() => {
        router.push('/user/profile');
      }, 2000);
    } catch (err: any) {
      setMsg(`Error: ${err.message}`);
    }
  }

  return (
    <UserLayout>
      <h1>Change Password</h1>
      <form onSubmit={handleChangePassword}>
        <div>
          <label>Current Password:</label>
          <input
            type="password"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
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
        <button type="submit">Change Password</button>
        {msg && <p>{msg}</p>}
      </form>
    </UserLayout>
  );
}

export const getServerSideProps = withUserSSR();

export default ChangePasswordPage;
