import { Request, Response } from 'express';
import {
    signUpUser,
    signInUser,
    confirmSignUpUser,
    resendConfirmationCodeUser,
    forgotPasswordCognito,
    resetPasswordCognito,
    respondToMfaChallenge,
    buildGoogleAuthorizeUrl, 
    buildAppleAuthorizeUrl,
    generatePkcePair, 
    exchangeAuthCode, 
    verifyIdToken,
    IdTokenInfo,
    createCognitoClient
} from '../services/cognitoService';
import {
    createEphemeralToken,
    validateEphemeralToken,
    consumeEphemeralToken,
} from '../utils/ephemeralStore';
import { refreshAccessToken } from '../services/cognitoService';
import { createMfaEphemeralSession, getMfaEphemeralSession, consumeMfaEphemeralSession } from '../utils/mfaEphemeralStore';
import { getInvitationByCode, markInvitationUsed, transactionAcceptInvite } from '../services/invitationDbService';
import { putUserIfMissing, attachInviteCode, getUser } from '../services/userDbService';
import { GlobalSignOutCommand } from '@aws-sdk/client-cognito-identity-provider';
import { cookieDomain } from '../utils/cookieDomain';


interface SignInBody {
    email: string;
    password: string;
}

async function timed<T>(label: string, fn: () => Promise<T>): Promise<T> {
    console.time(label);
    try   { return await fn(); }
    finally { console.timeEnd(label); }
  }

function setAuthCookie(res: Response, token: string, maxAgeSecs: number) {
  res.cookie('accessToken', token, {
    httpOnly : true,
    secure   : true,
    sameSite : 'lax',
    path     : '/',
    domain   : cookieDomain(),
    maxAge   : maxAgeSecs * 1000,
  });
}
  

export class AuthController {
  static async signUp(req: Request, res: Response) {
    try {
      const { email, password, displayName } = req.body as
        SignInBody & { displayName: string; inviteCode?: string };

      if (!email || !password)
        return res.status(400).json({ error: 'Missing email or password' });

      const inviteCode = (req.body.inviteCode ||
                          req.cookies.inviteCode ||
                          '')
                          .toString().toUpperCase().trim();

      
      if (process.env.REQUIRE_INVITE === 'true' && !inviteCode)
        return res.status(400).json({ error: 'inviteCode required' });

      
      await signUpUser(email, password, displayName, inviteCode);

      
      const token = await createEphemeralToken(
        JSON.stringify({ email, inviteCode }),   
        10 * 60 * 1000,
      );

      
      res.cookie('signupToken', token, {
        httpOnly : true,
        secure   : true,
        sameSite : 'lax',
        path     : '/auth',
        maxAge   : 10 * 60 * 1000,
        domain   : cookieDomain(),
      });

      res.clearCookie('inviteCode', {
        httpOnly : true,
        secure   : true,
        sameSite : 'lax',
        path     : '/auth',
      });
      
      return res.status(201).json({
        message: 'User signed up successfully. Check your email for a code.',
      });

    } catch (err: any) {
      console.error('[signUp]', err);
      return res.status(400).json({ error: 'Unable to sign-up' });
    }
  }


    static async signIn(req: Request, res: Response) {
        try {
            console.log("==== signIn route START ====");
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ error: 'Missing email or password' });
            }

            const cognitoResp = await signInUser(email, password);

            if (cognitoResp.ChallengeName === 'SOFTWARE_TOKEN_MFA') {
                const mfaToken = await createMfaEphemeralSession(
                    email,
                    cognitoResp.Session!,
                    5 * 60 * 1000
                );
                
                res.cookie('mfaToken', mfaToken, {
                    httpOnly : true,
                    secure   : true,
                    sameSite : 'lax',
                    path     : '/auth',
                    maxAge   : 5 * 60 * 1000,
                });

                return res.json({
                    challenge: 'SOFTWARE_TOKEN_MFA',
                    message  : 'MFA required',
                });
            }
            else if (cognitoResp.ChallengeName === 'UNCONFIRMED') {
                
                return res.status(400).json({ error:'Invalid email or password' });
            }
              
              else if (cognitoResp.AuthenticationResult?.AccessToken) {
                const {
                  AccessToken: accessToken,      
                  RefreshToken,
                  ExpiresIn,
                  TokenType,
                } = cognitoResp.AuthenticationResult!;
              
                const { getCognitoConfig } = await import('../config/cognitoConfig');
                const { CognitoJwtVerifier } = await import('aws-jwt-verify');

                const { userPoolId, clientId } = getCognitoConfig();
                const verifier = CognitoJwtVerifier.create({ userPoolId, clientId, tokenUse:'access' });
                const payload  = await verifier.verify(accessToken);
                const userId   = payload.sub as string;
              
                
                let pendingInvite = false;
                try {
                  const row = await getUser(userId);
                  pendingInvite = !row?.inviteCode?.S;     
                } catch { }
              
                
                if (process.env.REQUIRE_INVITE === 'true' && pendingInvite) {
                  return res.status(403).json({ error: 'Invite pending' });
                }

                setAuthCookie(res, accessToken, ExpiresIn ?? 3600);

                
                if (RefreshToken) {
                    res.cookie('refreshToken', RefreshToken, {
                        httpOnly: true,
                        secure: true,
                        sameSite: 'lax',
                        path: '/',
                        domain: cookieDomain(),
                        maxAge: 30 * 24 * 3600_000,        
                });
                }

                return res.json({
                    message: 'User signed in',
                    tokenType: TokenType,
                    expiresIn: ExpiresIn,
                    pendingInvite,
                });
            } else {
                return res.status(400).json({ error: 'Unexpected challenge' });
            }

        } catch (error: any) {
            console.error('[signIn]', error);
            return res.status(400).json({ error: 'Invalid email or password' });
        }
    }

    static async confirm(req: Request, res: Response) {
      const { token, code } = req.body;
      if (!token || !code)
        return res.status(400).json({ error: 'Missing token or code' });
  
      try {
        const payloadStr = await validateEphemeralToken(token);
        if (!payloadStr) throw new Error('Invalid/expired token');
  
        const { email, inviteCode = '' } = JSON.parse(payloadStr);
        if (!email) throw new Error('Malformed token payload');
  
        
        await confirmSignUpUser(email, code, inviteCode || undefined);
  
        await consumeEphemeralToken(token);
        res.clearCookie('signupToken', {          
          httpOnly : true,
          secure   : true,
          sameSite : 'lax',
          path     : '/auth',
          domain   : cookieDomain(),
        });
        return res.json({ message: 'Email confirmed. Sign-in to continue.' });
  
      } catch (err: any) {
        if (err.name === 'TooManyRequestsException')
          return res.status(429).json({ error: 'Too many attempts, slow down' });
  
        console.error('[confirm]', err);
        return res.status(400).json({ error: err.message || 'Confirmation failed' });
      }
    }

    static async submitInvite(req: Request, res: Response) {
      try {
        
        const inviteCode = req.body.inviteCode?.toUpperCase().trim();
        if (!inviteCode)
          return res.status(400).json({ error: 'Missing inviteCode' });
    
        
        const invite = await getInvitationByCode(inviteCode);
        if (!invite || invite.used)
          return res.status(400).json({ error: 'Invalid or already-used invite' });
    
        
        const claims = (req as any).user;      
        const userId = claims.sub;
        const email  = claims.email || '';
        const name   = claims.name  || '';
    
        
        await transactionAcceptInvite(userId, email, name, invite);

        res.clearCookie('inviteCode', {
          httpOnly : true,
          secure   : true,
          sameSite : 'lax',
          path     : '/auth',
        });
    
        
        return res.json({ message: 'Invite accepted. Account fully activated.' });
    
      } catch (err: any) {
        console.error('[submitInvite]', err);
        
        if (err.name === 'TransactionCanceledException')
          return res.status(409).json({ error: 'Invite already consumed' });
        return res.status(500).json({ error: err.message || 'Unable to submit invite' });
      }
    }
    


    static async resend(req: Request, res: Response) {
        try {
            const { token } = req.body;
            if (!token) {
                return res.status(400).json({ error: 'Missing token' });
            }

            const payloadStr = await validateEphemeralToken(token);
            if (!payloadStr) {
                return res.status(400).json({ error: 'Invalid or expired token' });
            }

            let email: string;
            try {
                const parsed = JSON.parse(payloadStr);
                email = parsed.email;
            } catch (e) {
                    return res.status(400).json({ error: 'Invalid token format' });
            }

            await resendConfirmationCodeUser(email);

            return res.json({ message: 'New code resent. Check your email!' });
        } catch (error: any) {
            console.error('[resend]', error);
            return res.status(400).json({ error: 'Unable to resend code' });
        }
    }


    static async forgotPassword(req: Request, res: Response) {
        try {
            const { email } = req.body;
            if (!email) {
                return res.status(400).json({ error: 'Missing email' });
            }

            await forgotPasswordCognito(email);
            return res.json({ message: 'If the email exists, a code was sent' });
        } catch (error: any) {
            console.error('[forgotPassword]', error);
            return res.status(400).json({ error: 'Unable to process request' });
        }
    }

    static async resetPassword(req: Request, res: Response) {
        try {
            const { email, code, newPassword } = req.body;
            if (!email || !code || !newPassword) {
                return res.status(400).json({ error: 'Missing email, code, or newPassword' });
            }

            await resetPasswordCognito(email, code, newPassword);
            return res.json({ message: 'Password reset successfully' });
        } catch (error: any) {
            console.error('[resetPassword]', error);
            return res.status(400).json({ error: 'Unable to reset password' });
        }
    }

    static async signInMfa(req: Request, res: Response) {
        try {
          const { totpCode } = req.body;
          const mfaToken = req.cookies.mfaToken;

            console.log('[signInMfa] request received');

            if (!mfaToken || !totpCode) {
                return res.status(400).json({ error: 'Missing mfaToken or totpCode' });
            }

            const data = await getMfaEphemeralSession(mfaToken);

            if (!data) {
                return res.status(400).json({ error: 'Invalid or expired MFA token' });
            }

            const { session, email } = data;

            const resp = await respondToMfaChallenge(session, email, totpCode);  

            if (resp.AuthenticationResult?.AccessToken) {
                await consumeMfaEphemeralSession(mfaToken);

                const {
                  AccessToken: accessToken,     
                  RefreshToken,
                  ExpiresIn,
                } = resp.AuthenticationResult;  

                
                setAuthCookie(res, accessToken, ExpiresIn ?? 3600);

                if (RefreshToken) {
                    res.cookie('refreshToken', RefreshToken, {
                        httpOnly: true,
                        secure: true,
                        sameSite: 'lax',
                        path: '/',
                        domain: cookieDomain(),
                        maxAge: 30 * 24 * 3600_000,
                    });
                }

                return res.status(200).json({
                    message: 'MFA verified'
                });
            } else {
                return res.status(400).json({ error: 'MFA verification failed' });
            }

        } catch (error: any) {
            console.error('[signInMfa]', error);
            return res.status(400).json({ error: 'MFA verification failed' });
        }
    }

    static async logout(req: Request, res: Response) {
      try {
        const accessToken = req.cookies.accessToken;   
        if (accessToken) {
            const client = createCognitoClient();
            await client.send(
            new GlobalSignOutCommand({ AccessToken: accessToken })
            );
        }
        } catch {}
        res.clearCookie('accessToken',  {
          path:'/', sameSite:'lax', domain:cookieDomain(),
        });
        res.clearCookie('refreshToken', {
          path:'/', sameSite:'lax', domain:cookieDomain(),
        });

        return res.json({ message: 'Logged out' });
      }

      
      static async refresh(req: Request, res: Response) {
        try {
        const refresh = req.cookies.refreshToken;
        if (!refresh)
          return res.status(401).json({ error: 'No refresh token' });

        const tokens = await refreshAccessToken(refresh);

        
        setAuthCookie(res, tokens.accessToken, tokens.expiresIn);

        
        if (tokens.refreshToken) {
          res.cookie('refreshToken', tokens.refreshToken, {
            httpOnly : true,
            secure   : true,
            sameSite : 'lax',
            path     : '/',
            domain   : cookieDomain(),
            maxAge   : 30 * 24 * 3600_000,   
          });
        }

        return res.json({ ok: true });
      } catch (err:any) {
        console.error('[refresh]', err);
        
        res.clearCookie('accessToken',  { path:'/',  });
        res.clearCookie('refreshToken', { path:'/', });
        return res.status(401).json({ error: 'Refresh failed' });
        }
    }
      
      
    static async googleLogin(_req: Request, res: Response) {
        const { verifier, challenge } = generatePkcePair();
        const state  = await createEphemeralToken(JSON.stringify({ verifier }), 10*60*1000);
        const url    = buildGoogleAuthorizeUrl(state, challenge);
        return res.redirect(url);
    }
  
    static async googleCallback(req: Request, res: Response) {
        try {
        const { code, state } = req.query as any;
        if (!code || !state) throw new Error('Missing code/state');
    
        const json = await consumeEphemeralToken(state);
        if (!json) throw new Error('Invalid or expired state');
        const { verifier } = JSON.parse(json);
    
        const tokens = await exchangeAuthCode(code, verifier);
        
        const idPayload = await verifyIdToken(tokens.id_token);

        
        await putUserIfMissing({
          userId     : idPayload.sub,
          email      : idPayload.email,
          displayName: idPayload.name ?? '',
          inviteCode : '',      
        });

        
        setAuthCookie(res, tokens.access_token, tokens.expires_in);
        if (tokens.refresh_token) {
            res.cookie('refreshToken', tokens.refresh_token, {
                httpOnly:true, secure:true, sameSite:'lax',
                path:'/', maxAge:30*24*3600_000,
                domain: cookieDomain(),
            });
        }
        return res.redirect(process.env.FRONTEND_URL || '/');
        } catch (err:any) {
        console.error('[googleCallback]', err);
        return res.status(400).json({ error: err.message });
        }
    }
    
    
    static async appleLogin(_req: Request, res: Response) {
        const { verifier, challenge } = generatePkcePair();
        const state  = await createEphemeralToken(JSON.stringify({ verifier }), 10*60*1000);
        const url    = buildAppleAuthorizeUrl(state, challenge);
        return res.redirect(url);
    }
    
    static async appleCallback(req: Request, res: Response) {
        try {
        const { code, state } = req.query as any;
        if (!code || !state) throw new Error('Missing code/state');
    
        const json = await consumeEphemeralToken(state);
        if (!json) throw new Error('Invalid or expired state');
        const { verifier } = JSON.parse(json);
    
        const tokens = await exchangeAuthCode(code, verifier);
        await verifyIdToken(tokens.id_token);
    
        setAuthCookie(res, tokens.access_token, tokens.expires_in);
        if (tokens.refresh_token) {
            res.cookie('refreshToken', tokens.refresh_token, {
                httpOnly:true, secure:true, sameSite:'lax',
                path:'/', maxAge:30*24*3600_000,
                domain: cookieDomain(),
            });
        }
        return res.redirect(process.env.FRONTEND_URL || '/');
        } catch (err:any) {
        console.error('[appleCallback]', err);
        return res.status(400).json({ error: err.message });
        }
    }

}
