import crypto from 'crypto';
import { getOnramperConfig } from '../config/onramperConfig';

export function createOnramperUrl(params: {
  sourceCurrency?: string;
  amount?: number;
  country?: string;
  wallets?: Array<{ currency: string; address: string }>;
  
}): string {
  const { apiKey, secretKey, widgetUrl } = getOnramperConfig();

  
  const qs: string[] = [`apiKey=${apiKey}`];

  if (params.country)        qs.push(`country=${params.country}`);
  if (params.sourceCurrency) qs.push(`defaultFiat=${params.sourceCurrency}`);
  if (params.amount)         qs.push(`defaultAmount=${params.amount}`);

  qs.push('themeName=dark');
  
  if (params.wallets?.length) {
    const walletsString = params.wallets
      .map(w => `${w.currency}:${w.address}`)
      .join(',');

      if (walletsString.length > 1024)
        throw new Error('wallets too large for Onramper');
      
      qs.push(`wallets=${encodeURIComponent(walletsString)}`);

    
    if (secretKey) {
      const signContent = `wallets=${walletsString}`;      
      const signature   = generateOnramperSignature(secretKey, signContent);
      qs.push(`signature=${signature}`);
    }
  }

  return `${widgetUrl}?${qs.join('&')}`;
}

function generateOnramperSignature(secret: string, data: string): string {
  return crypto.createHmac('sha256', secret).update(data).digest('hex');
}
