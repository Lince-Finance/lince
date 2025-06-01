import { createContext, ReactNode, useContext } from 'react';

export interface User {
  id: string;
  email: string;
  /** Estado del MFA:  
   *  • false  → deshabilitado  
   *  • true   → habilitado  
   *  • 'PENDING' → asociación en curso
   */
  mfaEnabled: true | false | 'PENDING';
}

export const AuthContext = createContext<User | null>(null);

export function AuthProvider({
  initialUser,
  children,
}: {
  initialUser: User | null;
  children: ReactNode;
}) {
  return (
    <AuthContext.Provider value={initialUser}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const user = useContext(AuthContext);
  return { user };
}