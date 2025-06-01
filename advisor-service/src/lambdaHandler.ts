import { APIGatewayProxyEvent, Context, Callback, APIGatewayProxyResult } from 'aws-lambda';
import serverlessExpress from '@vendia/serverless-express';
import { loadAdvisorConfig } from './utils/parameterStore';

let serverlessExpressInstance: any;
const initPromise = (async () => {
  const cfg = await loadAdvisorConfig();

  process.env.ADVISOR_OPENAI_API_KEY = cfg.openaiKey;
  process.env.ADVISOR_SYSTEM_PROMPT  = cfg.systemPrompt;
  process.env.FRONTEND_URL           = cfg.frontendUrl;
  process.env.AWS_REGION             = cfg.region;
  process.env.AWS_USER_POOL_ID       = cfg.userPoolId;
  process.env.AWS_CLIENT_ID          = cfg.clientId;
  process.env.REDIS_URL              = cfg.redisUrl;

  const { default: app } = await import('./app');
  serverlessExpressInstance = serverlessExpress({ app });
})();

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context,
  callback: Callback<APIGatewayProxyResult>,
) => {
  await initPromise;
  return serverlessExpressInstance(event, context, callback);
};
