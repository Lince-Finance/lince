import { Request, Response, NextFunction } from 'express';
import { getUser, updateUser } from '../services/userDbService';
import { UserService } from '../services/userService';

type MfaState = true | false | 'PENDING' | 'EXPIRED';

function toMfaState(a: any): MfaState {
  if (!a) return false;
  if ('BOOL' in a) return a.BOOL;
  if ('S' in a) return a.S === 'PENDING' ? 'PENDING' : a.S === 'true';
  return false;
}

async function state(userId: string): Promise<MfaState> {
  const item = await getUser(userId);
  const s = toMfaState(item?.mfaEnabled);
  if (s === 'PENDING') {
    const until = item?.mfaPendingUntil as number | undefined;
    if (!until || Date.now() > until) return 'EXPIRED';
  }
  return s;
}

export async function requireMfaDisabled(req: Request, res: Response, next: NextFunction) {
  const userId = (req as any).user.sub;
  const s      = await state(userId);

  if (s === 'EXPIRED') {
    await updateUser(userId, { mfaEnabled: false, mfaPendingUntil: null });
    return next();
  }
  if (s !== false)
    return res.status(409).json({ error: 'MFA already in progress or enabled' });

  next();

}

export async function requireMfaPending(req: Request, res: Response, next: NextFunction) {
  const userId = (req as any).user.sub;
  const s = await state(userId);
  
  if (s === 'PENDING') {
    return next();
  }
  
  if (s === false) {
    return next();
  }
  
  if (s === 'EXPIRED') {
    await updateUser(userId, { mfaEnabled: false, mfaPendingUntil: null });
    return next();
  }
  
  return res.status(400).json({ error: 'MFA is already enabled' });
}
