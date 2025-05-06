import {
    CognitoIdentityProviderClient,
    SignUpCommand,
    InitiateAuthCommand,
    ResendConfirmationCodeCommand,
    AuthFlowType,
    ConfirmSignUpCommand,
    AdminGetUserCommand,
    AdminDeleteUserCommand,
    ForgotPasswordCommand,
    ConfirmForgotPasswordCommand,
    RespondToAuthChallengeCommand,
    AdminInitiateAuthCommand,
    DescribeUserPoolCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { getCognitoConfig } from '../config/cognitoConfig';
import crypto from 'crypto';
import pkceChallenge from 'pkce-challenge';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { computeSecretHash } from '../utils/secretHash';

export interface IdTokenInfo {
    sub          : string;   
    email        : string;   
    name?        : string;   
    emailVerified: boolean;
  }

let _cognito: CognitoIdentityProviderClient | null = null;
export function createCognitoClient() {
  if (_cognito) return _cognito;
  const { region } = getCognitoConfig();
  _cognito = new CognitoIdentityProviderClient({ region });
  return _cognito;
}
  


export async function signUpUser(
  email: string,
  password: string,
  displayName: string,
  inviteCode = ''
) {
    const config = getCognitoConfig();

    const client = createCognitoClient();
    const username = email;

    const userAttributes = [
        { Name: 'email', Value: email },
        { Name: 'name',  Value: displayName },
      ];

    const secretHash = computeSecretHash(
        username,
        config.clientId,
        config.clientSecret
    );

    const signUpCmd = new SignUpCommand({
        ClientId: config.clientId,
        Username: username,
        Password: password,
        UserAttributes: userAttributes,
        SecretHash: secretHash,
        ClientMetadata: inviteCode ? { inviteCode } : undefined,
    });

    try {
        const response = await client.send(signUpCmd);
        return response;

    } catch (error: any) {
        if (error.name === 'UsernameExistsException') {
            try {
                const getUserResp = await client.send(new AdminGetUserCommand({
                    UserPoolId: config.userPoolId,
                    Username: username
                }));

                if (getUserResp.UserStatus === 'UNCONFIRMED') {
                    await client.send(new AdminDeleteUserCommand({
                        UserPoolId: config.userPoolId,
                        Username: username
                    }));

                    const secondTryCmd = new SignUpCommand({
                        ClientId: config.clientId,
                        Username: username,
                        Password: password,
                        UserAttributes: userAttributes,
                        SecretHash: secretHash
                    });
                    const secondTryResp = await client.send(secondTryCmd);
                    return secondTryResp;

                } else {
                    throw new Error('User is already confirmed. Please sign in instead.');
                }
            } catch (err: any) {
                throw new Error(err.message);
            }
        }
        throw new Error(error.message);
    }
}

export async function signInUser(username: string, password: string) {
    const config = getCognitoConfig();

    const client = createCognitoClient();

    const authParams: Record<string,string> = {
        USERNAME: username,
        PASSWORD: password,
    };
    if (config.clientSecret) {                  
        authParams.SECRET_HASH = computeSecretHash(
        username, config.clientId, config.clientSecret);
    }

    const command = new InitiateAuthCommand({
        AuthFlow : AuthFlowType.USER_PASSWORD_AUTH,
        ClientId : config.clientId,
        AuthParameters: authParams,
    });

    try {
        return await client.send(command);
      } catch (e:any) {
        if (e.name === 'UserNotConfirmedException') {
          return { ChallengeName: 'UNCONFIRMED' } as any;
        }
        throw e;
      }
      
}

export async function confirmSignUpUser(email: string, code: string, inviteCode?: string) {
    const config = getCognitoConfig();
    const client = createCognitoClient();

    const secretHash = computeSecretHash(
        email,
        config.clientId,
        config.clientSecret
    );

    const cmd = new ConfirmSignUpCommand({
        ClientId: config.clientId,
        Username: email,
        ConfirmationCode: code,
        SecretHash: secretHash,
        ClientMetadata:   inviteCode ? { inviteCode } : undefined,
    });
    return client.send(cmd);
}

export async function resendConfirmationCodeUser(email: string) {
    const config = getCognitoConfig();
    const client = createCognitoClient();

    const secretHash = computeSecretHash(
        email,
        config.clientId,
        config.clientSecret
    );

    const cmd = new ResendConfirmationCodeCommand({
        ClientId: config.clientId,
        Username: email,
        SecretHash: secretHash
    });
    return client.send(cmd);
}


export async function forgotPasswordCognito(email: string) {
    const config = getCognitoConfig();
    const client = createCognitoClient();

    const secretHash = computeSecretHash(
        email,
        config.clientId,
        config.clientSecret
    );

    const cmd = new ForgotPasswordCommand({
        ClientId: config.clientId,
        Username: email,
        SecretHash: secretHash
    });

    return client.send(cmd);
}

export async function resetPasswordCognito(email: string, code: string, newPassword: string) {
    const config = getCognitoConfig();
    const client = createCognitoClient();

    const secretHash = computeSecretHash(
        email,
        config.clientId,
        config.clientSecret
    );

    const cmd = new ConfirmForgotPasswordCommand({
        ClientId: config.clientId,
        Username: email,
        ConfirmationCode: code,
        Password: newPassword,
        SecretHash: secretHash
    });

    return client.send(cmd);
}

export async function respondToMfaChallenge(session: string, username: string, totpCode: string) {
    const config = getCognitoConfig();
    const client = createCognitoClient();

    const secretHash = computeSecretHash(username, config.clientId, config.clientSecret);

    const cmd = new RespondToAuthChallengeCommand({
        ClientId: config.clientId,
        ChallengeName: 'SOFTWARE_TOKEN_MFA',
        Session: session,
        ChallengeResponses: {
            USERNAME: username,
            SOFTWARE_TOKEN_MFA_CODE: totpCode,
            SECRET_HASH: secretHash
        }
    });

    const resp = await client.send(cmd);
    return resp;
}

export function generatePkcePair() {
    const { code_verifier, code_challenge } = pkceChallenge();   
    return { verifier: code_verifier, challenge: code_challenge };
  }
  

export function buildGoogleAuthorizeUrl(state: string, challenge: string) {
    const cfg = getCognitoConfig();
    const p   = new URLSearchParams({
      response_type: 'code',
      client_id:     cfg.clientId,
      redirect_uri:  cfg.redirectUri,
      scope:         'openid email profile',
      state,
      code_challenge_method: 'S256',
      code_challenge: challenge,
      identity_provider: 'Google',
    });
    return `https://${cfg.domain}/oauth2/authorize?${p.toString()}`;
  }
  
  export function buildAppleAuthorizeUrl(state: string, challenge: string) {
    const cfg = getCognitoConfig();
    const p   = new URLSearchParams({
      response_type: 'code',
      client_id:     cfg.clientId,
      redirect_uri:  cfg.redirectUri,
      scope:         'openid email name',
      state,
      code_challenge_method: 'S256',
      code_challenge: challenge,
      identity_provider: 'SignInWithApple',
    });
    return `https://${cfg.domain}/oauth2/authorize?${p.toString()}`;
  }
  


export async function exchangeAuthCode(code: string, verifier: string) {
    const cfg = getCognitoConfig();
    const body = new URLSearchParams({
        grant_type:    'authorization_code',
        client_id:     cfg.clientId,
        code,
        redirect_uri:  cfg.redirectUri,
        code_verifier: verifier,
    });

    const resp = await fetch(`https://${cfg.domain}/oauth2/token`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
    });
    if (!resp.ok) throw new Error(`Token endpoint: ${resp.status}`);
    return resp.json() as Promise<{
        access_token: string; id_token: string; refresh_token?: string;
        expires_in: number; token_type: string;
    }>;
    }

export async function verifyIdToken(idToken: string): Promise<IdTokenInfo> {
    const cfg = getCognitoConfig();
    
    const jwksUri = `https://cognito-idp.${cfg.region}.amazonaws.com/${cfg.userPoolId}/.well-known/jwks.json`;
    const JWKS    = createRemoteJWKSet(new URL(jwksUri));
    const issuer  = `https://cognito-idp.${cfg.region}.amazonaws.com/${cfg.userPoolId}`;
    
    const { payload } = await jwtVerify(idToken, JWKS, {
        issuer,
        audience: cfg.clientId,
        
        clockTolerance: 60,
    });

    if (Array.isArray(payload.aud)) {
        if (!payload.aud.includes(cfg.clientId))
          throw new Error('aud mismatch');
      } else if (payload.aud !== cfg.clientId) {
        throw new Error('aud mismatch');
      }
    
    if (!payload.email_verified)            throw new Error('email not verified');
    if (payload.token_use !== 'id')         throw new Error('token_use !== id');
    if (payload.exp! * 1000 < Date.now())   throw new Error('ID-token expired');
    if (typeof payload.sub   !== 'string')  throw new Error('sub missing');
    if (typeof payload.email !== 'string')  throw new Error('email missing');
  
    return {
      sub          : payload.sub,
      email        : payload.email,
      name         : typeof payload.name === 'string' ? payload.name : undefined,
      emailVerified: Boolean(payload.email_verified),
    };
  }
      

export async function refreshAccessToken(
    refreshToken: string,
  ): Promise<{
    accessToken:  string;
    expiresIn:    number;
    idToken?:     string;
    refreshToken?:string;           
  }> {
    const cfg    = getCognitoConfig();
    const client = createCognitoClient();
  
    
    const params: Record<string, string> = { REFRESH_TOKEN: refreshToken };
  
    
    if (process.env.AWS_CLIENT_SECRET) {
      params.SECRET_HASH = computeSecretHash(
        'ignored-username',        
        cfg.clientId,
        cfg.clientSecret,
      );
    }
  
    
    const cmd = new AdminInitiateAuthCommand({
      UserPoolId:  cfg.userPoolId,
      ClientId:    cfg.clientId,
      AuthFlow:    AuthFlowType.REFRESH_TOKEN_AUTH,
      AuthParameters: params,
    });
  
    const { AuthenticationResult } = await client.send(cmd);
    if (!AuthenticationResult?.AccessToken)
      throw new Error('Cognito did not return AccessToken');
  
    return {
      accessToken : AuthenticationResult.AccessToken,
      expiresIn   : AuthenticationResult.ExpiresIn ?? 3600,
      idToken     : AuthenticationResult.IdToken,
      refreshToken: AuthenticationResult.RefreshToken,
    };
  }

  export async function getPasswordPolicy(){
    const cfg = getCognitoConfig();
    const client = createCognitoClient();
    const { UserPool } = await client.send(
      new DescribeUserPoolCommand({ UserPoolId: cfg.userPoolId })
    );
    return UserPool?.Policies?.PasswordPolicy; 
  }