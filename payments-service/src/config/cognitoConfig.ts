
interface ICognitoConfigMinimal {
    region: string;
    userPoolId: string;
    clientId: string;
  }
  
  export function getCognitoConfig(): ICognitoConfigMinimal {
    return {
      region:      process.env.AWS_REGION        || '',
      userPoolId:  process.env.AWS_USER_POOL_ID  || '',
      clientId:    process.env.AWS_CLIENT_ID     || '',
    };
  }
  