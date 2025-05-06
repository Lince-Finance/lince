
import { Router } from 'express';
import csrf from 'csurf';
import { UserController } from '../controllers/userController';
import { checkAuth }       from '../middleware/checkAuth';
import { userRateLimiter } from '../middleware/rateLimiter';
import { validateRequest } from '../middleware/validateInput';

import {
  updateProfileSchema,
  changePasswordSchema,
  mfaAssociateSchema,
  mfaVerifySchema,
} from '../middleware/userSchemas';
import { requireActivated } from '../middleware/requireActivated';   

const csrfProtection = csrf({
  cookie: {
    key:     '_csrf',          
    httpOnly:true,
    secure:  true,
    sameSite:'none',
    path:    '/',              
    maxAge:  24 * 60 * 60,
  },
});

const router = Router();

router.use(checkAuth);        
router.use(requireActivated); 
router.use(userRateLimiter);  


router.get('/profile', UserController.getProfile);
router.post('/mfa-status', UserController.getMfaStatus);

router.patch(
  '/profile',
  csrfProtection,
  validateRequest(updateProfileSchema),
  UserController.updateProfile,
);

router.post(
  '/changePassword',
  csrfProtection,
  validateRequest(changePasswordSchema),
  UserController.changePassword,
);

router.post(
  '/mfa-associate',
  csrfProtection,
  validateRequest(mfaAssociateSchema),
  UserController.mfaAssociate,
);

router.post(
  '/mfa-verify',
  csrfProtection,
  validateRequest(mfaVerifySchema),
  UserController.mfaVerify,
);

router.post(
  '/invitations',
  csrfProtection,
  UserController.createOrListInvites,
);

export default router;
