import type {
  APIGatewayProxyEvent,
  Context,
  Callback,
  APIGatewayProxyResult,
} from 'aws-lambda';
import serverlessExpress from '@vendia/serverless-express';
import { loadPaymentsConfig } from './utils/parameterStore';

let serverlessExpressInstance: any;
let initDone = false;

async function init() {
  if (initDone) return;
  console.log('[lambda] init start');

  const cfg = await loadPaymentsConfig();
  process.env.PAYMENTS_ONRAMPER_API_KEY   = cfg.onramperApiKey;
  process.env.PAYMENTS_ONRAMPER_SECRET_KEY = cfg.onramperSecretKey;
  process.env.PAYMENTS_ONRAMPER_WIDGET_URL = cfg.widgetUrl;
  process.env.FRONTEND_URL = cfg.frontendUrl;
  process.env.AWS_REGION       = cfg.region;
  process.env.AWS_USER_POOL_ID = cfg.userPoolId;
  process.env.AWS_CLIENT_ID    = cfg.clientId;
  process.env.REDIS_URL        = cfg.redisUrl;

  const { default: importedApp } = await import('./app');
  serverlessExpressInstance = serverlessExpress({ app: importedApp });

  initDone = true;
  console.log('[lambda] init done');
}

const initPromise = init();

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context,
  callback: Callback<APIGatewayProxyResult>,
) => {
  console.log('[lambda] handler start', {
    requestId: context.awsRequestId,
    stage    : (event as any).requestContext?.stage,
    routeKey : (event as any).routeKey,
    path     : (event as any).rawPath,
  });

  await initPromise;

  console.log('[lambda] proxy to express');
  return serverlessExpressInstance(event, context, callback);
};
