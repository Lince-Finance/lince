import { parse } from 'tldts';


export const getBaseDomain = (): string => {
  const raw  = (process.env.FRONTEND_URL || '').replace(/\/+$/, '');
  if (!raw) throw new Error('FRONTEND_URL no está definido');

  
  if (raw.includes('localhost')) return 'localhost';

  const host = raw.replace(/^https?:\/\//, '').split('/')[0];
  const { domain, publicSuffix } = parse(host);   

  if (!domain || !publicSuffix) {
    throw new Error(`FRONTEND_URL mal formado (${host})`);
  }

  return `${domain}.${publicSuffix}`;             
};
