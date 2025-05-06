export const getAllowedOrigins = (): string[] => {
    const base = process.env.FRONTEND_URL;
    if (!base) throw new Error('ENV var FRONTEND_URL is not set');

    
    const withScheme = base.startsWith('http') ? base : `https://${base}`;
    return [withScheme.replace(/\/$/, '')];
  };
  