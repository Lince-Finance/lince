import React from 'react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div style={{ textAlign: 'center', marginTop: 50 }}>
      <h1>Welcome to Lince</h1>
      <p>
        <Link 
          href="/auth/signIn"
          style={{ color: 'blue', textDecoration: 'underline' }}
        >
          Go to Sign In
        </Link>
      </p>
    </div>
  );
}
