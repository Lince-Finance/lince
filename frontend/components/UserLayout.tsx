

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { csrfFetch } from '../utils/fetcher';
import { invalidateCsrfToken } from '../utils/csrf';
import Head from 'next/head';

interface UserLayoutProps {
  children: React.ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_AUTH_BASE_URL;
      await csrfFetch(`${baseUrl}/auth/logout`, { method: 'POST' });
      invalidateCsrfToken();
      router.push('/auth/signIn');
    } catch (err) {
      console.error('Logout error:', err);
      router.push('/auth/signIn');
    }
  }

  function toggleMenu() {
    setMenuOpen(!menuOpen);
  }

  return (
    <>
      <Head key="robots">
        <meta name="robots" content="noindex" />
      </Head>

      <div style={{ margin: 20 }}>
        <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        <button onClick={() => router.push('/user/dashboard')}>
          Dashboard
        </button>
        <div>
          <button onClick={toggleMenu}>User Menu</button>
          {menuOpen && (
            <div
              style={{
                position: 'absolute',
                top: '2.5rem',
                right: 0,
                background: '#f0f0f0',
                border: '1px solid #ccc',
                padding: '0.5rem',
              }}
            >
              <button
                style={{ display: 'block', margin: '0.5rem 0' }}
                onClick={() => {
                  setMenuOpen(false);
                  router.push('/user/profile');
                }}
              >
                Profile
              </button>
              <button
                style={{ display: 'block' }}
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

        <main style={{ marginTop: '1rem' }}>{children}</main>
      </div>
    </>
  );
}
