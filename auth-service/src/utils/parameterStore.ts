import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm';

const ssm = new SSMClient({ region: process.env.AWS_REGION || 'eu-west-1' });


const valueCache   = new Map<string, string>();          
const promiseCache = new Map<string, Promise<string>>(); 
const TTL_MS = 10 * 60 * 1000;                           

async function getParam(name: string): Promise<string> {
  
  if (valueCache.has(name)) return valueCache.get(name)!;

  
  if (promiseCache.has(name)) return promiseCache.get(name)!;

  
  const prom = (async () => {
    const devLogs = true;
    if (devLogs) console.time(`SSM ${name}`);

    try {
      const { Parameter } = await ssm.send(
        new GetParameterCommand({ Name: name, WithDecryption: true })
      );

      const val = Parameter?.Value ?? '';
      valueCache.set(name, val);                   
      setTimeout(() => valueCache.delete(name), TTL_MS).unref();
      return val;
    } finally {
      if (devLogs) console.timeEnd(`SSM ${name}`);
      promiseCache.delete(name);                   
    }
  })();

  promiseCache.set(name, prom);
  return prom;
}


export async function loadAppConfig() {
  console.time('loadAppConfig total');

  const [
    region,
    userPoolId,
    clientId,
    clientSecret,
    redisUrl,
    frontendUrl,
    cognitoDomain,
    redirectUri,
    googleClientId,
    googleClientSecret,
    appleTeamId,
    appleKeyId,
    appleClientId,
    applePrivateKeyPem,
  ] = await Promise.all([
    getParam('/lince/AWS_REGION'),
    getParam('/lince/AWS_USER_POOL_ID'),
    getParam('/lince/AWS_CLIENT_ID'),
    getParam('/lince/AWS_CLIENT_SECRET',),
    getParam('/lince/REDIS_URL'),
    getParam('/lince/FRONTEND_URL'),
    getParam('/lince/COGNITO_DOMAIN'),
    getParam('/lince/REDIRECT_URI'),
    getParam('/lince/GOOGLE_CLIENT_ID'),
    getParam('/lince/GOOGLE_CLIENT_SECRET'),
    getParam('/lince/APPLE_TEAM_ID',),
    getParam('/lince/APPLE_KEY_ID'),
    getParam('/lince/APPLE_CLIENT_ID'),
    getParam('/lince/APPLE_PRIVATE_KEY_PEM'),

  ]);

  console.timeEnd('loadAppConfig total');

  return { region, userPoolId, clientId, clientSecret, redisUrl, frontendUrl, cognitoDomain, redirectUri, googleClientId, googleClientSecret, appleTeamId, appleKeyId, appleClientId, applePrivateKeyPem };
}
