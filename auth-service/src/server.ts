
import { loadAppConfig } from './utils/parameterStore';
import app from './app';
import { logger } from './utils/logger';

async function startServer() {
    
    const config = await loadAppConfig();

    console.log("DEBUG => SSM config loaded:", config);

    process.env.AWS_REGION = config.region;
    process.env.AWS_USER_POOL_ID = config.userPoolId;
    process.env.AWS_CLIENT_ID = config.clientId;
    process.env.AWS_CLIENT_SECRET = config.clientSecret;

    process.env.REDIS_URL = config.redisUrl;

    process.env.FRONTEND_URL = config.frontendUrl;
    

    //const port = 4000;
    //app.listen(port, () => {
    //    logger.info(`Server running on port ${port}`);
    //});
}

startServer().catch(err => {
    console.error('Failed to start server', err);
    process.exit(1);
});
