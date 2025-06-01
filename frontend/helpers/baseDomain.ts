export const baseDomain = (): string => {
    const env = process.env.NEXT_PUBLIC_ENV;
    switch (env) {
      case 'live':
        return 'https://lince.finance';
      case 'dev':
      default:
        return 'https://lince.zone';
    }
  };
  
  export const apiUrl = (service: 'advisor' | 'payments' | 'core', path = ''): string =>
    `https://${service}.${baseDomain().replace(/^https?:\/\//, '')}${path}`;
  