import { Request, Response, NextFunction } from 'express';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { getCognitoConfig } from '../config/cognitoConfig';

let cachedVerifier: ReturnType<typeof CognitoJwtVerifier.create> | null = null;

const MIN_SECS_LEFT = Number(process.env.TOKEN_MIN_TTL ?? 300); 

function getCognitoVerifier() {
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
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const verifier = getCognitoVerifier();
    const payload = await verifier.verify(token);   

    const now = Math.floor(Date.now() / 1000);

    
    if (payload.exp < now) {
      return res.status(401).json({ error: 'Token expired' });
    }

    
    if (payload.exp - now < MIN_SECS_LEFT) {
      
      res.setHeader('X-Refresh-Required', 'true');
      return res.status(403).json({ error: 'Refresh required' });
    }


    
    (req as any).user = payload;
    (req as any).token = token;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
