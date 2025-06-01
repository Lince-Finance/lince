import React, { createContext, useContext, useEffect, useState } from 'react';

type Creds = { email: string; password: string } | null;

const Ctx = createContext<{
  creds: Creds;
  setCreds: (c: Creds) => void;
  clearCreds: () => void;
}>({ creds: null, setCreds: () => {}, clearCreds: () => {} });

export const SignupCredsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [creds, _setCreds] = useState<Creds>(() => {
    try {
      const json = sessionStorage.getItem('signupCreds');
      return json ? JSON.parse(json) as Creds : null;
    } catch { return null; }
  });

  function setCreds(c: Creds) {
    _setCreds(c);
    if (c) sessionStorage.setItem('signupCreds', JSON.stringify(c));
  }
  function clearCreds() {
    _setCreds(null);
    sessionStorage.removeItem('signupCreds');
  }

  return <Ctx.Provider value={{ creds, setCreds, clearCreds }}>{children}</Ctx.Provider>;
};

export const useSignupCreds = () => useContext(Ctx);
