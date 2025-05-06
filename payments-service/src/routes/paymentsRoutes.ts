
import { Router } from 'express';
import { OnramperController } from '../controllers/paymentsController';
import { validateRequest } from '../middleware/validateInput';
import { createUrlSchema } from '../middleware/paymentsSchemas';
import { checkAuth } from '../middleware/checkAuth';
import { userRateLimiter } from '../middleware/rateLimiter';   

const router = Router();


router.post(
  '/createUrl',
  checkAuth,          
  userRateLimiter,    
  validateRequest(createUrlSchema),
  OnramperController.createOnramperUrl,
);


router.post('/webhook', OnramperController.onramperWebhook);

export default router;
