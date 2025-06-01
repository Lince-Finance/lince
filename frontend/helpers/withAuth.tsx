import { ComponentType, FC, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth }   from '@/contexts/AuthContext';

export function withAuth<P extends object>(
  WrappedComponent: ComponentType<P>,
): FC<P> {

  const ProtectedRoute: FC<P> = (props) => {
    const { user } = useAuth();
    const router   = useRouter();

    useEffect(() => {
      if (!user) router.replace('/auth/login');
    }, [user, router]);

    if (!user) return null;

    return <WrappedComponent {...props} />;
  };

  ProtectedRoute.displayName =
    `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return ProtectedRoute;
}

export default withAuth;
