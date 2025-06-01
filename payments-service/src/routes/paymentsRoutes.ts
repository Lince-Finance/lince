import { Router } from 'express';
import bodyParser  from 'body-parser';
import express     from 'express';

import { OnramperController } from '../controllers/paymentsController';
import { validateRequest }    from '../middleware/validateInput';
import { createUrlSchema }    from '../middleware/paymentsSchemas';
import { checkAuth }          from '../middleware/checkAuth';
import { userRateLimiter,
         authRateLimiter }    from '../middleware/rateLimiter';

import {
  excludePublicWebhook,
  sendCsrfToken,
} from '../middleware/csrf';

const router = Router();

router.post(
  '/webhook',
  authRateLimiter,
  bodyParser.raw({ type: 'application/json', limit: '1mb' }),
  OnramperController.onramperWebhook,
);

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

router.use(excludePublicWebhook);

router.post(
  '/createUrl',
  checkAuth,
  userRateLimiter,
  validateRequest(createUrlSchema),
  OnramperController.createOnramperUrl,
);

router.get('/csrf-token', sendCsrfToken);

export default router;
