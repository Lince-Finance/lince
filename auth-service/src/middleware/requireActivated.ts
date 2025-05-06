
import { Request, Response, NextFunction } from 'express';
import { getUser } from '../services/userDbService';



export async function requireActivated(req: Request, res: Response, next: NextFunction) {
    
    if (process.env.REQUIRE_INVITE !== 'true') return next();
  
    const sub = (req as any).user?.sub;
    if (!sub) return res.status(401).json({ error: 'Missing sub in token' });
  
    try {
      const row = await getUser(sub);
      if (row?.inviteCode?.S) return next();        
    } catch (err) {
      console.error('[requireActivated]', err);     
    }
    return res.status(403).json({ error: 'Invite pending' });
  }
  
