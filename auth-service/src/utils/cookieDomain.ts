import { getBaseDomain } from './baseDomain';


export function cookieDomain(): string | undefined {
    return process.env.FRONTEND_URL?.includes('localhost')
      ? undefined        
      : '.' + getBaseDomain(); 
  }
  
