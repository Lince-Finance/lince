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
    createCognitoClient,
    userExists,
} from '../services/cognitoService';
import {
    createEphemeralToken,
    validateEphemeralToken,
    consumeEphemeralToken,
} from '../utils/ephemeralStore';
import { refreshAccessToken } from '../services/cognitoService';
import { createMfaEphemeralSession, getMfaEphemeralSession, consumeMfaEphemeralSession } from '../utils/mfaEphemeralStore';
import { getInvitationByCode, markInvitationUsed, transactionAcceptInvite } from '../services/invitationDbService';
import { putUserIfMissing, attachInviteCode, getUser, isOnboardingDone } from '../services/userDbService';
import { GlobalSignOutCommand } from '@aws-sdk/client-cognito-identity-provider';
import { cookieDomain } from '../utils/cookieDomain';
import { getCognitoUsername } from '../utils/getCognitoUsername';
import { jwtDecode } from 'jwt-decode';



interface SignInBody {
    email: string;
    password: string;
}

interface IdPayload {
  sub: string;
  'cognito:username'?: string;
  email?: string;
}

function clearGhostAccessCookie(res: Response) {
  res.clearCookie('accessToken', {
    path: '/',
  });

  res.clearCookie('accessToken', {
    domain: cookieDomain(),
    path  : '/',
  });
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
    sameSite : 'none',
    path     : '/',
    domain   : cookieDomain(),
    maxAge   : maxAgeSecs * 1000,
  });
}
  

export class AuthController {
  static async signUp(req: Request, res: Response) {
    try {
      const { email, password, displayName } = req.body as
        SignInBody & { displayName: string };  

      if (!email || !password)
        return res.status(400).json({ error: 'Missing email or password' });

      
      await signUpUser(email, password, displayName);

      
      const token = await createEphemeralToken(
        JSON.stringify({ email }),   
        10 * 60 * 1000,
      );

      
      res.cookie('signupToken', token, {
        httpOnly : true,
        secure   : true,
        sameSite : 'none',
        path     : '/',
        maxAge   : 10 * 60 * 1000,
        domain   : cookieDomain(),
      });
      
      return res.status(201).json({
        message: 'User signed up successfully. Check your email for a code.',
        signupToken: token,
      });

    } catch (err: any) {
      if (err.name === 'UsernameExistsException')
        return res.status(409).json({
          error: 'Email already in use.',
        });
  
      if (/already confirmed/i.test(err.message))
        return res.status(409).json({
          error: 'Account already confirmed. Sign in.',
        });
  
      if (/password/i.test(err.message))
        return res.status(400).json({ error: err.message });
  
      console.error('[signUp]', err);
      return res.status(500).json({ error: 'Internal error' });
    }
  }

  static async signIn(req: Request, res: Response) {
    const { email, password } = req.body;
  
    try {
      const cognitoResp = await signInUser(email, password);
  
      if (cognitoResp.ChallengeName === 'SOFTWARE_TOKEN_MFA') {
        const { Session } = cognitoResp;
        if (!Session) throw new Error('Missing Cognito session for MFA');
  
        const token = await createMfaEphemeralSession(
          email,
          Session,
          5 * 60 * 1000,
        );
  
        res.cookie('mfaToken', token, {
          httpOnly : true,
          secure   : true,
          sameSite : 'none',
          path     : '/',
          domain   : cookieDomain(),
          maxAge   : 5 * 60 * 1000,
        });

        clearGhostAccessCookie(res);
        res.clearCookie('idToken',     { path:'/', sameSite:'none', domain:cookieDomain() });
        res.clearCookie('refreshToken',{ path:'/', sameSite:'none', domain:cookieDomain() });
        res.clearCookie('username',    { path:'/', sameSite:'none', domain:cookieDomain() });
  
        return res.json({ challenge: 'SOFTWARE_TOKEN_MFA' });
      }
  

      if (cognitoResp.AuthenticationResult?.AccessToken) {
        const {
          AccessToken,
          IdToken,
          RefreshToken,
          ExpiresIn = 3600,
        } = cognitoResp.AuthenticationResult;

        let pendingOnboarding = true;
        try {
          const { sub: userId } = jwtDecode<IdPayload>(IdToken);
          pendingOnboarding = !(await isOnboardingDone(userId));
        } catch {}
  
        res.cookie('accessToken', AccessToken, {
          httpOnly:true, secure:true, sameSite:'none',
          path:'/', domain:cookieDomain(), maxAge:ExpiresIn * 1000,
        });
  
        res.cookie('idToken', IdToken, {
          httpOnly:true, secure:true, sameSite:'none',
          path:'/', domain:cookieDomain(), maxAge:ExpiresIn * 1000,
        });
  
        if (RefreshToken) {
          res.cookie('refreshToken', RefreshToken, {
            httpOnly:true, secure:true, sameSite:'none',
            path:'/', domain:cookieDomain(), maxAge:30 * 24 * 3600_000,
          });
        }
  
        res.cookie('username', email, {
          httpOnly:true, secure:true, sameSite:'none',
          path:'/', domain:cookieDomain(), maxAge:30 * 24 * 3600_000,
        });
  
        return res.json({
          message     : 'Sign in successful',
          tokenType   : 'Bearer',
          username    : email,
          accessToken : AccessToken,
          idToken     : IdToken,
          refreshToken: RefreshToken,
          pendingOnboarding,
        });
      }
  
      return res.status(401).json({ error: 'Incorrect username or password' });
  
    } catch (err: any) {

      if (err.name === 'NotAuthorizedException') {
        console.warn('[signIn] Cognito NotAuthorizedException', {
          email,
          ip: req.ip,
          reason: err.message,
        });
        return res.status(401).json({ error: 'Incorrect username or password' });
      }
  
      console.error('[signIn] Internal error', err);
      return res.status(500).json({ error: 'Internal error' });
    }
  }


    static async confirm(req: Request, res: Response) {
      const { token, code } = req.body;
      if (!token || !code)
        return res.status(400).json({ error: 'Missing token or code' });
  
      try {
        const payloadStr = await validateEphemeralToken(token);
        if (!payloadStr) throw new Error('Invalid/expired token');
  
        const { email } = JSON.parse(payloadStr);
        if (!email) throw new Error('Malformed token payload');
  
        
        await confirmSignUpUser(email, code);
  
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
          sameSite : 'none',
          path     : '/',
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
              clearGhostAccessCookie(res);

              const auth = resp.AuthenticationResult!;        
              const accessToken  = auth.AccessToken!;         
              const idToken      = auth.IdToken!;            
              const refreshToken = auth.RefreshToken;        
              const expiresIn    = auth.ExpiresIn ?? 3600;    
            
              res.cookie('idToken', idToken, {
                httpOnly : true,
                secure   : true,
                sameSite : 'none',
                path     : '/',
                domain   : cookieDomain(),
                maxAge: (expiresIn ?? 3600) * 1000,
              });
            
              setAuthCookie(res, accessToken, expiresIn);
            
              if (refreshToken) {
                res.cookie('refreshToken', refreshToken, {
                  httpOnly : true,
                  secure   : true,
                  sameSite : 'none',
                  path     : '/',
                  domain   : cookieDomain(),
                  maxAge   : 30 * 24 * 3600_000,
                });
              }
            
              return res.status(200).json({ message: 'MFA verified' });
            } else {
                return res.status(400).json({ error: 'MFA verification failed' });
            }

        } catch (error: any) {
            console.error('[signInMfa]', error);
            return res.status(400).json({ error: 'MFA verification failed' });
        }
    }

    static async logout(req: Request, res: Response) {
      console.log('[logout] accessToken:', req.cookies.accessToken);
      try {
        const accessToken = req.cookies.accessToken;   
        if (accessToken) {
          const client = createCognitoClient();
          await client.send(
            new GlobalSignOutCommand({ AccessToken: accessToken })
          );
        } else {
          console.warn('[logout] No accessToken found in cookies');
        }
      } catch (err) {
        console.error('[logout] Error in GlobalSignOut:', err);
      }
      clearGhostAccessCookie(res);
      res.clearCookie('idToken',     { path:'/', sameSite:'none', domain:cookieDomain() });
      res.clearCookie('refreshToken',{ path:'/', sameSite:'none', domain:cookieDomain() });
      return res.json({ message: 'Logged out' });
    }

      
    static async refresh(req: Request, res: Response) {
      const refresh = req.cookies.refreshToken;
      if (!refresh) {
        return res.status(400).json({ error: 'Missing refresh token' });
      }
  
      let username = '';
      const rawId = req.cookies.idToken;
      if (rawId) {
        try {
          const payload: any = jwtDecode(rawId);
          username = payload['cognito:username'] || payload.username || payload.sub || '';
        } catch {
          console.log('[refresh] Failed to decode idToken');
        }
      }
      if (!username) {
        username = req.cookies.username || '';
      }
      if (!username) {
        return res.status(400).json({ error: 'Cannot determine username for refresh' });
      }
  
      console.log('[refresh] username for refresh:', username);
      const tokens = await refreshAccessToken(refresh, username);
      console.log('[refresh] tokens received:', tokens);
  
      if (tokens.accessToken) {
        res.cookie('accessToken', tokens.accessToken, {
          httpOnly: true,
          secure: true,
          sameSite: 'none',
          path: '/',
          domain: cookieDomain(),
          maxAge: 3600_000,
        });
        res.cookie('idToken', tokens.idToken, {
          httpOnly: true,
          secure: true,
          sameSite: 'none',
          path: '/',
          domain: cookieDomain(),
          maxAge: 3600_000,
        });
        return res.status(200).json({ message: 'Token refreshed' });
      }
      return res.status(401).json({ error: 'Refresh failed' });
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
                httpOnly:true, secure:true, sameSite:'none',
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
                httpOnly:true, secure:true, sameSite:'none',
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

    static async emailExists(req: Request, res: Response) {
      const email = (req.query.email as string || '').toLowerCase().trim();
      if (!email) return res.status(400).json({ error: 'Missing email' });
    
      try {
        const { exists, name } = await userExists(email);   
    
        if (!exists) return res.status(404).json({ error: 'Not found' }); 
    
        return res.json({ exists: true, name });            
      } catch (e: any) {
        console.error('[emailExists]', e);
        return res.status(500).json({ error: 'Internal error' });
      }
    }
    

}
