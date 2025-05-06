import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { v4 as uuidv4 } from 'uuid';
import {
    countInvitationsForUser,
    getAllInvitationsForUser,
    createInvitation,
    batchCreateInvites,
  } from '../services/invitationDbService';
import { updateUser } from '../services/userDbService';
  


export class UserController {

    static async getProfile(req: Request, res: Response) {
        try {
            const userClaims = (req as any).user;
            if (!userClaims) {
                return res.status(401).json({ error: 'No user claims found' });
            }

            const userId = userClaims.sub; 

            
            


            const userProfile = await UserService.getUserProfile(userId);

            return res.json({ profile: userProfile });
        } catch (error: any) {
            console.error('[getProfile]', error);
            return res.status(500).json({ error: 'Unable to fetch profile' });
        }
    }

    static async updateProfile(req: Request, res: Response) {
        try {
            const userClaims = (req as any).user;
            if (!userClaims) {
                return res.status(401).json({ error: 'No user claims found' });
            }
            const userId = userClaims.sub;

            const { displayName } = req.body;
            const updatedProfile = await UserService.updateUserProfile(userId, { displayName });

            return res.json({ profile: updatedProfile });
        } catch (error: any) {
            console.error('[updateProfile]', error);
            return res.status(500).json({ error: 'Unable to update profile' });
        }
    }

    static async changePassword(req: Request, res: Response) {
        try {
            const accessToken = (req as any).token;
            const { oldPassword, newPassword } = req.body;

            if (!accessToken || !oldPassword || !newPassword) {
                return res.status(400).json({ error: 'Missing token, oldPassword, or newPassword' });
            }

            await UserService.changePassword(accessToken, oldPassword, newPassword);
            return res.json({ message: 'Password changed successfully!' });
        } catch (error: any) {
            console.error('[changePassword]', error);
            return res.status(400).json({ error: 'Unable to change password' });
        }
    }

    static async mfaAssociate(req: Request, res: Response) {
        try {
            const accessToken = (req as any).token;
            if (!accessToken) {
                return res.status(401).json({ error: 'No token found in request' });
            }

            const isMfaEnabled = await UserService.getUserMfaStatus(accessToken);
            if (isMfaEnabled) {
                return res.status(400).json({ error: 'MFA is already enabled.' });
            }

            const assocResp = await UserService.associateMfa(accessToken);

            const secretCode = assocResp.SecretCode;
            
            const label = (req as any).user.email || (req as any).user.sub;
            const otpauthUri = `otpauth://totp/Lince:${encodeURIComponent(label)}?secret=${secretCode}&issuer=Lince`;


            return res.json({
                message: 'TOTP associated',
                secretCode,
                otpauthUri,
            });
        } catch (error: any) {
            console.error('[mfaAssociate]', error);
            return res.status(400).json({ error: 'MFA association failed' });
        }
    }

        
    static async mfaVerify(req: Request, res: Response) {
        const accessToken = (req as any).token;
        const { userCode } = req.body;
    
        if (!accessToken || !userCode)
        return res.status(400).json({ error: 'Missing token or userCode' });
    
        const userId = (req as any).user.sub;
    
        
        try {
        await updateUser(userId, { mfaEnabled: 'PENDING' });   
        } catch (e:any) {
        if (e.name === 'ConditionalCheckFailedException')
            return res.status(409).json({ error: 'MFA already enabled' });
        throw e;                     
        }
    
        try {
        
        const ok = await UserService.verifyMfa(accessToken, userCode);
        if (ok.Status !== 'SUCCESS') throw new Error('Invalid TOTP');
    
        
        await UserService.setMfaPreference(accessToken);
        await updateUser(userId, { mfaEnabled: true });
    
        return res.json({ message: 'MFA enabled' });
    
        } catch (err) {
        
        await updateUser(userId, { mfaEnabled: false }).catch(() => {});
        console.error('[mfaVerify]', err);
        return res.status(400).json({ error: 'MFA verification failed' });
        }
    }
  

    static async getMfaStatus(req: Request, res: Response) {
        try {
            const accessToken = (req as any).token;
            if (!accessToken) {
                return res.status(401).json({ error: 'No token found' });
            }

            const isMfaEnabled = await UserService.getUserMfaStatus(accessToken);
            return res.json({ isMfaEnabled });
        } catch (error: any) {
            console.error('[getMfaStatus]', error);
            return res.status(400).json({ error: 'Unable to get MFA status' });
        }
    }

    static async createInvitation(req: Request, res: Response) {
        try {
            const userClaims = (req as any).user;
            const userId = userClaims.sub;

            const currentCount = await countInvitationsForUser(userId);
            if (currentCount >= 3) {
                return res.status(400).json({ error: 'Max 3 invites per user reached' });
            }

            const inviteCode = uuidv4().split('-')[0].toUpperCase();

            await createInvitation({
                creatorUserId: userId,
                inviteCode,
                used: false,
                createdAt: new Date().toISOString()
            });

            return res.json({ inviteCode });
        } catch (err: any) {
            console.error('[createInvitation]', err);
            return res.status(500).json({ error: 'Unable to create invitation' });
        }
    }

    static async createOrListInvites(req: Request, res: Response) {
        try {
          const userId   = (req as any).user.sub;
          const current  = await countInvitationsForUser(userId);
      
          if (current < 3) {
            const needed = 3 - current;
            const codes  = Array.from({ length: needed })
                                 .map(() => uuidv4().split('-')[0].toUpperCase());
            try {
              await batchCreateInvites(userId, codes);      
            } catch (e: any) {
              if (e.name === 'TransactionCanceledException')
                return res.status(400).json({ error: 'Invite quota exceeded' });
              throw e;
            }
          }
      
          const invites = await getAllInvitationsForUser(userId);
          return res.json({ invites });
      
        } catch (err: any) {
          console.error('[createOrListInvites]', err);
          return res.status(500).json({ error: 'Unable to list/create invitations' });
        }
      }
      


}
