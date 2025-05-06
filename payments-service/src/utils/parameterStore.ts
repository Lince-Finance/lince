import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm';

const ssm = new SSMClient({ region: process.env.AWS_REGION || 'eu-west-1' });


const valueCache   = new Map<string, string>();
const promiseCache = new Map<string, Promise<string>>();
const TTL_MS = 10 * 60 * 1000;

async function getParam(name: string): Promise<string> {
  if (valueCache.has(name))  return valueCache.get(name)!;
  if (promiseCache.has(name)) return promiseCache.get(name)!;

  const prom = (async () => {
    try {
      const { Parameter } = await ssm.send(
        new GetParameterCommand({ Name: name, WithDecryption: true })
      );
      const val = Parameter?.Value ?? '';
      valueCache.set(name, val);
      setTimeout(() => valueCache.delete(name), TTL_MS).unref();
      return val;
    } finally {
      promiseCache.delete(name);
    }
  })();

  promiseCache.set(name, prom);
  return prom;
}


export async function loadPaymentsConfig() {
  const [
    onramperApiKey,
    onramperSecretKey,
    widgetUrl,
    frontendUrl,
    region,
    userPoolId,
    clientId,
    redisUrl,
  ] = await Promise.all([
    getParam('/lince/PAYMENTS_ONRAMPER_API_KEY'),
    getParam('/lince/PAYMENTS_ONRAMPER_SECRET_KEY'),
    getParam('/lince/PAYMENTS_ONRAMPER_WIDGET_URL'),
    getParam('/lince/FRONTEND_URL'),
    getParam('/lince/AWS_REGION'),
    getParam('/lince/AWS_USER_POOL_ID'),
    getParam('/lince/AWS_CLIENT_ID'),
    getParam('/lince/REDIS_URL'),
  ]);

  return {
    onramperApiKey,
    onramperSecretKey,
    widgetUrl,
    frontendUrl,
    region,
    userPoolId,
    clientId,
    redisUrl,
  };
}
