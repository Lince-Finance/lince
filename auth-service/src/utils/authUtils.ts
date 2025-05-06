import { Request } from 'express';

export function getSubFromRequest(req: Request): string {
  const userClaims = (req as any).user;
  if (!userClaims || !userClaims.sub) {
    throw new Error('No sub found in user claims. Are you sure the user is authenticated?');
  }
  return userClaims.sub;
}

//SE USA ASÍ
/*static async getProfile(req: Request, res: Response) {
    try {
      const sub = getSubFromRequest(req);
      // ...
    } catch (err) {
      return res.status(401).json({ error: 'No user sub found' });
    }
  }*/