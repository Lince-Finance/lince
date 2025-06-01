export const getAllowedOrigins = (): string[] => {
    const base = process.env.FRONTEND_URL;
    if (!base) throw new Error('FRONTEND_URL no está definido');
    return [base.replace(/\/$/, '')];
  }
  