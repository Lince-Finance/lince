import app from './app';
import serverless from 'serverless-http';
import { loadPaymentsConfig } from './utils/parameterStore';
import { getOnramperConfig } from './config/onramperConfig';
import { appConfig } from './config/index';

export const handler = serverless(app);

async function startServer() {

  const config = await loadPaymentsConfig();
  process.env.PAYMENTS_ONRAMPER_API_KEY = config.onramperApiKey;
  process.env.PAYMENTS_ONRAMPER_SECRET_KEY = config.onramperSecretKey;
  process.env.PAYMENTS_ONRAMPER_WIDGET_URL = config.widgetUrl;
  process.env.FRONTEND_URL = config.frontendUrl;


  const port = appConfig.port;

  //app.listen(port, () => {
  //  console.log(`Payments service on port ${port}`);
  //});
}

startServer().catch(err => {
  console.error(err);
  process.exit(1);
});
