import { useContext, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { AuthContext } from '@/contexts/AuthContext';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const user   = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (user && router.pathname.startsWith('/auth')) {
      router.replace('/user/dashboard');
    }
  }, [user, router.pathname]);

  if (user) return null;

  return (
    <>
      <Head>
        <meta name="robots" content="noindex" />
      </Head>
      <div>{children}</div>
    </>
  );
}
