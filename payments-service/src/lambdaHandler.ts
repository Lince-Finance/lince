import type {
  APIGatewayProxyEvent,
  Context,
  Callback,
  APIGatewayProxyResult
} from 'aws-lambda';
import serverlessExpress from '@vendia/serverless-express';
import { loadPaymentsConfig } from './utils/parameterStore';

let serverlessExpressInstance: any;

async function init() {
  const config = await loadPaymentsConfig();

  process.env.PAYMENTS_ONRAMPER_API_KEY = config.onramperApiKey;
  process.env.PAYMENTS_ONRAMPER_SECRET_KEY = config.onramperSecretKey;
  process.env.PAYMENTS_ONRAMPER_WIDGET_URL = config.widgetUrl;
  process.env.FRONTEND_URL = config.frontendUrl;
  process.env.AWS_REGION       = config.region;
  process.env.AWS_USER_POOL_ID = config.userPoolId;
  process.env.AWS_CLIENT_ID    = config.clientId;
  process.env.REDIS_URL    = config.redisUrl;

  
  
  

  const { default: importedApp } = await import('./app');
  serverlessExpressInstance = serverlessExpress({ app: importedApp });
}

const initPromise = init();

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context,
  callback: Callback<APIGatewayProxyResult>
) => {

  await initPromise;
  return serverlessExpressInstance(event, context, callback);
};
