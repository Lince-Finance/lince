import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { checkAuth } from '../middleware/checkAuth';
import { userRateLimiter } from '../middleware/rateLimiter';
import { validateRequest } from '../middleware/validateInput';
import {
  updateProfileSchema,
  changePasswordSchema,
  mfaAssociateSchema,
  mfaVerifySchema,
} from '../middleware/userSchemas';
import { requireActivated } from '../middleware/requireActivated';
import { csrfProtection } from '../middleware/csrf';
import { requireMfaDisabled, requireMfaPending } from '../middleware/mfaGuards';

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

router.post('/mfa-associate',
  requireMfaDisabled,
  csrfProtection,
  validateRequest(mfaAssociateSchema),
  UserController.mfaAssociate,
);

router.post('/mfa-verify',
  requireMfaPending,
  csrfProtection,
  validateRequest(mfaVerifySchema),
  UserController.mfaVerify,
);

router.post('/mfa-reset',
  csrfProtection,
  UserController.resetMfaState,
);

router.post(
  '/invitations',
  csrfProtection,
  UserController.createOrListInvites,
);

export default router;
