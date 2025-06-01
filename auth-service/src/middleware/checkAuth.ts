import { Request, Response, NextFunction } from 'express';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { getCognitoConfig }   from '../config/cognitoConfig';

let cachedVerifier: ReturnType<typeof CognitoJwtVerifier.create> | null = null;
const MIN_SECS_LEFT = Number(process.env.TOKEN_MIN_TTL ?? 300);

function getVerifier() {
  if (!cachedVerifier) {
    const { userPoolId, clientId } = getCognitoConfig();
    cachedVerifier = CognitoJwtVerifier.create({
      userPoolId,
      clientId,
      tokenUse : 'access',
      jwksTtl  : 3_600,
      cacheJwksInMemory: true,
    });
  }
  return cachedVerifier;
}

export async function checkAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const gwClaims =
    (req as any).apiGateway?.event?.requestContext?.authorizer?.jwt?.claims;

  if (gwClaims) {
    (req as any).user  = gwClaims;
    (req as any).token =
      req.headers.authorization?.replace(/^Bearer\s+/,'') ||
      req.cookies.accessToken ||
      '';
    return next();
  }

  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const payload = await getVerifier().verify(accessToken);

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) {
      return res.status(401).json({ error: 'Token expired' });
    }
    if (payload.exp - now < MIN_SECS_LEFT) {
      res.setHeader('X-Refresh-Required', 'true');
      return res.status(403).json({ error: 'Refresh required' });
    }

    (req as any).user  = payload;
    (req as any).token = accessToken;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
