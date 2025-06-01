import { getBaseDomain } from './baseDomain';


export function cookieDomain(): string {
  return '.' + getBaseDomain();
}

  
