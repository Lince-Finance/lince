import { csrfFetch } from './fetcher';

export type PasswordPolicy = {
  minLength: number;
  requireUppercase?: boolean;
  requireNumbers?: boolean;
  requireSymbols?: boolean;
};

export async function getPasswordPolicy(): Promise<PasswordPolicy> {
  try {
    const { minLength = 8,
            requireUppercase = false,
            requireNumbers   = false,
            requireSymbols   = false } =
      await csrfFetch(
        `${process.env.NEXT_PUBLIC_AUTH_BASE_URL}/auth/password-policy`,
        { method: 'GET' }
      ).then(r => r.json());

    return { minLength, requireUppercase, requireNumbers, requireSymbols };
  } catch {
    
    return { minLength: 8 };
  }
}
