import React from 'react';
import Link from 'next/link';
import UserLayout from '../../components/UserLayout';
import { withUserSSR } from '../../lib/withUserSSR';

function DashboardPage() {
  return (
    <UserLayout>
      <h1>Bienvenido</h1>
      <p>Contenido del dashboard...</p>
      <div style={{ marginTop: '1rem' }}>
        <Link href="/payments/buyCrypto">
          Ir a comprar cripto
        </Link>
      </div>
    </UserLayout>
  );
}

export const getServerSideProps = withUserSSR();

export default DashboardPage;
