interface IOnramperConfig {
    apiKey: string;
    secretKey: string;
    widgetUrl: string;
  }
  
  export function getOnramperConfig(): IOnramperConfig {
    return {
      apiKey: process.env.PAYMENTS_ONRAMPER_API_KEY || '',
      secretKey: process.env.PAYMENTS_ONRAMPER_SECRET_KEY || '',
      widgetUrl: process.env.PAYMENTS_ONRAMPER_WIDGET_URL || '',
    };
  }
  