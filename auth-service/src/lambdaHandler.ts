import type { Handler, Callback } from 'aws-lambda';
import serverlessExpress          from '@vendia/serverless-express';
import { loadAppConfig }          from './utils/parameterStore';

let serverlessExpressInstance: ReturnType<typeof serverlessExpress> | undefined;


async function bootstrap() {
  
  if (serverlessExpressInstance) return serverlessExpressInstance;

  try {
    
    console.time('loadAppConfig');
    const cfg = await loadAppConfig();
    console.timeEnd('loadAppConfig');
    if (!cfg.clientSecret) {
      throw new Error('FATAL: AWS_CLIENT_SECRET not set');
    }

    process.env.AWS_REGION        = cfg.region;
    process.env.AWS_USER_POOL_ID  = cfg.userPoolId;
    process.env.AWS_CLIENT_ID     = cfg.clientId;
    process.env.AWS_CLIENT_SECRET = cfg.clientSecret;
    process.env.REDIS_URL         = cfg.redisUrl;
    process.env.FRONTEND_URL      = cfg.frontendUrl;
    process.env.COGNITO_DOMAIN    = cfg.cognitoDomain;
    process.env.REDIRECT_URI      = cfg.redirectUri;
    process.env.APPLE_TEAM_ID          = cfg.appleTeamId;
    process.env.APPLE_KEY_ID           = cfg.appleKeyId;
    process.env.APPLE_CLIENT_ID        = cfg.appleClientId;
    process.env.APPLE_PRIVATE_KEY_PEM  = cfg.applePrivateKeyPem;
    process.env.GOOGLE_CLIENT_ID       = cfg.googleClientId;
    process.env.GOOGLE_CLIENT_SECRET   = cfg.googleClientSecret;



    
    const { default: app } = await import('./app');

    
    serverlessExpressInstance = serverlessExpress({ app });
    return serverlessExpressInstance;

  } catch (err) {
    
    console.error('BOOTSTRAP ERROR', err);
    throw err;
  }
}


export const handler: Handler = async (event, context, callback: Callback) => {
  const expressServer = await bootstrap();   
  return expressServer(event, context, callback);
};
