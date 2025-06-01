import { Request, Response, NextFunction } from 'express';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { getCognitoConfig } from '../config/cognitoConfig';

let cachedVerifier: ReturnType<typeof CognitoJwtVerifier.create> | null = null;
const MIN_SECS_LEFT   = Number(process.env.TOKEN_MIN_TTL ?? 300);
const ENFORCE_MIN_TTL = process.env.ADVISOR_ENFORCE_MIN_TTL !== 'false';

function getVerifier() {
  if (!cachedVerifier) {
    const { userPoolId, clientId } = getCognitoConfig();
    cachedVerifier = CognitoJwtVerifier.create({
      userPoolId,
      clientId,
      tokenUse: 'access',
      jwksTtl: 3600,
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
  console.log('[checkAuth] ⇢', req.method, req.originalUrl);

  const gwClaims =
    (req as any).apiGateway?.event?.requestContext?.authorizer?.jwt?.claims;

  if (gwClaims) {
    console.log('[checkAuth] API-GW claims');
    (req as any).user = gwClaims;
    (req as any).token =
      req.headers.authorization?.replace(/^Bearer\s+/, '') ||
      req.cookies.accessToken ||
      '';
    return next();
  }

  try {
    const accessToken =
      req.headers.authorization?.replace(/^Bearer\s+/, '') ||
      req.cookies.accessToken;

    if (!accessToken) {
      console.log('[checkAuth] ✖ no token');
      return res.status(401).json({ error: 'No token provided' });
    }

    const payload  = await getVerifier().verify(accessToken);
    const now      = Math.floor(Date.now() / 1000);
    const secsLeft = payload.exp - now;
    console.log('[checkAuth] ✔ verified; secsLeft=', secsLeft);

    if (secsLeft <= 0) {
      console.log('[checkAuth] ✖ expired');
      return res.status(401).json({ error: 'Token expired' });
    }

    if (ENFORCE_MIN_TTL && secsLeft < MIN_SECS_LEFT) {
      console.log('[checkAuth] ✖ below min TTL', {
        secsLeft, MIN_SECS_LEFT, ENFORCE_MIN_TTL,
      });
      res.setHeader('X-Refresh-Required', 'true');
      return res.status(403).json({ error: 'Refresh required' });
    }

    (req as any).user  = payload;
    (req as any).token = accessToken;
    console.log('[checkAuth] → ok');
    next();
  } catch (e) {
    console.log('[checkAuth] ✖ verify error', e);
    return res.status(401).json({ error: 'Invalid token' });
  }
}
