import { Request, Response, NextFunction } from 'express';
import { validateEphemeralToken } from '../utils/ephemeralStore';
import { AdminGetUserCommand }   from '@aws-sdk/client-cognito-identity-provider';
import { createCognitoClient }   from '../services/cognitoService';
import { getCognitoConfig }      from '../config/cognitoConfig';

export async function checkSignupToken(
  req: Request, res: Response, next: NextFunction,
) {
  if ((req as any).user) return next();

  const tok = req.cookies.signupToken;
  if (!tok) return res.status(401).json({ error: 'No token provided' });

  const payload = await validateEphemeralToken(tok);
  if (!payload) return res.status(401).json({ error: 'Invalid/expired token' });

  const { email } = JSON.parse(payload);
  if (!email)     return res.status(400).json({ error: 'Malformed token' });

  const { userPoolId } = getCognitoConfig();
  const client = createCognitoClient();
  const { UserAttributes = [] } = await client.send(
    new AdminGetUserCommand({ UserPoolId: userPoolId, Username: email }),
  );
  const sub = UserAttributes.find(a => a.Name === 'sub')?.Value;
  const name = UserAttributes.find(a => a.Name === 'name')?.Value ?? '';

  if (!sub) return res.status(400).json({ error: 'User not found' });

  (req as any).user = { sub, email, name };
  next();
}
