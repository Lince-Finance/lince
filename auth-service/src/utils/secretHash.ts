import crypto from 'crypto';
export function computeSecretHash(username:string, clientId:string, secret?:string){
  if (!secret) throw new Error('[computeSecretHash] CLIENT_SECRET missing');
  return crypto.createHmac('sha256', secret)
               .update(username + clientId).digest('base64');
}