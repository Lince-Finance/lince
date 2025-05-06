import pino from 'pino';

export const logger = pino({
    name: 'ultra-secure-backend',
    level: 'info',
    transport:
        true
            ? { target: 'pino-pretty', options: { colorize: true } }
            : undefined,
});
