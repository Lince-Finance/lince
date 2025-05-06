interface ICognitoConfig {
    region: string;
    userPoolId: string;
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    domain: string;
}

export function getCognitoConfig(): ICognitoConfig {
    return {
        region: process.env.AWS_REGION || '',
        userPoolId: process.env.AWS_USER_POOL_ID || '',
        clientId: process.env.AWS_CLIENT_ID || '',
        clientSecret: process.env.AWS_CLIENT_SECRET || '',
        redirectUri: process.env.REDIRECT_URI || '',
        domain: process.env.COGNITO_DOMAIN || '',
    };
}
