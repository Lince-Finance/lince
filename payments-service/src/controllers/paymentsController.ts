import { Request, Response } from 'express';
import { createOnramperUrl } from '../services/paymentsService';
import crypto from 'crypto';
import { getRedis } from '../utils/redisClient';


export class OnramperController {

    static async createOnramperUrl(req: Request, res: Response) {
        try {
            const { sourceCurrency, amount, country, wallets } = req.body;
            console.log('[DEBUG onramperController] Handler called with:', req.body);

            const userId = (req as any).user?.sub ?? 'NO_USER';
            console.log('[createUrl] user', userId,
                        'body', JSON.stringify(req.body),
                        'cookies', req.headers.cookie?.length);


            const url = createOnramperUrl({
                sourceCurrency,
                amount,
                country,
                wallets
            });

            console.log('[DEBUG onramperController] url =>', url);
            console.log('[createUrl] -> url.length', url.length);

            return res.json({ url });
        } catch (err: any) {
            console.error('Error in createOnramperUrl =>', err);
            return res.status(500).json({ error: err.message });
        }
    }

    
    static async onramperWebhook(req: Request, res: Response) {
      try {
        const sig     = req.get('x-onramper-webhook-signature') || '';
        const secret  = process.env.PAYMENTS_ONRAMPER_SECRET_KEY!;

        
        const rawBody = req.body as Buffer;
        const expected = crypto
        .createHmac('sha256', secret)
        .update(rawBody)                
        .digest('hex');
        if (sig !== expected) return res.status(401).json({ error:'Invalid signature' });
    
        const payload = JSON.parse(rawBody.toString('utf8'));
        const txId    = payload.transactionId || payload.id;
        if (!txId) return res.status(400).json({ error:'Missing tx id' });
    
        
        const redis  = getRedis();
        const key    = `onramper:${txId}`;
        const first = await redis.set(
          key,
          '1',
          'PX',            
          48 * 3600_000,   
          'NX',            
        ); 
        if (!first) return res.json({ ok:true, duplicate:true });
    
        
        console.log('[Webhook NEW]', txId, req.body.status);
        return res.json({ ok:true });
    
      } catch (err:any) {
        console.error('[onramperWebhook]', err);
        return res.status(500).json({ error: err.message });
      }
    }
      
      
}
