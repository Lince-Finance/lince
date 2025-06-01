import type {
  APIGatewayProxyHandlerV2,
  Handler as LambdaHandler,
  Callback,
  Context,
  APIGatewayProxyEventV2,
} from 'aws-lambda';

import serverlessExpress from '@vendia/serverless-express';
import { loadAppConfig } from './utils/parameterStore';

// ────────────────────────────────────────────────────────────
//  1)  package.json via require  → sin resolveJsonModule
// ────────────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-var-requires
const vendiaPkg = require('@vendia/serverless-express/package.json') as {
  version: string;
};

let serverlessExpressInstance: APIGatewayProxyHandlerV2 | undefined;

async function bootstrap(): Promise<APIGatewayProxyHandlerV2> {
  if (serverlessExpressInstance) return serverlessExpressInstance;

  /* ─── carga parámetros (SSM) ───────────────────────────── */
  console.time('loadAppConfig');
  const cfg = await loadAppConfig();
  console.timeEnd('loadAppConfig');

  if (!cfg.clientSecret) throw new Error('FATAL: AWS_CLIENT_SECRET not set');

  process.env.AWS_REGION           = cfg.region;
  process.env.AWS_USER_POOL_ID     = cfg.userPoolId;
  process.env.AWS_CLIENT_ID        = cfg.clientId;
  process.env.AWS_CLIENT_SECRET    = cfg.clientSecret;
  process.env.REDIS_URL            = cfg.redisUrl;
  process.env.FRONTEND_URL         = cfg.frontendUrl;
  process.env.COGNITO_DOMAIN       = cfg.cognitoDomain;
  process.env.REDIRECT_URI         = cfg.redirectUri;
  process.env.GOOGLE_CLIENT_ID     = cfg.googleClientId;
  process.env.GOOGLE_CLIENT_SECRET = cfg.googleClientSecret;
  process.env.REQUIRE_INVITE       = cfg.requireInvite ?? 'true';

  const { default: app } = await import('./app');

  app.use((req, res, next) => {
    /* res.on('finish') se dispara SIEMPRE que Express entrega la respuesta
       y es menos intrusivo que parchear res.end directamente             */
    res.on('finish', () => {
      // cookies que Express haya puesto  ───────────────────────────────
      const hdr = res.getHeader('set-cookie');
      // @ts-expect-error – propiedad que añade express-cookie
      const signed = res.cookies;
  
      console.log(
        '[diag] FINISH',
        req.method,
        req.url,
        res.statusCode,
        '\n  set-cookie header →', hdr,
        '\n  res.cookies      →', signed,
      );
    });
    next();
  });

  app.use((req,res,next)=>{
    res.on('finish',()=>{
      console.log('[diag] FINISH', req.method, req.url,
        '\n  request Cookie →', req.headers.cookie,
        '\n  response Set-Cookie →', res.getHeader('set-cookie'));
    });
    next();
  });

  serverlessExpressInstance = serverlessExpress({ app });
  console.log('[diag] @vendia/serverless-express', vendiaPkg.version);
  return serverlessExpressInstance;
}

/* ─── handler principal ─────────────────────────────────── */
export const handler: LambdaHandler<
  APIGatewayProxyEventV2,
  any
> = async (event, context: Context, callback: Callback) => {
  const expressHandler = await bootstrap();
  return expressHandler(event, context, callback);
};
