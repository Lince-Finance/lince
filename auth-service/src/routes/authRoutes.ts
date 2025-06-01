import { Router } from 'express';
import csrf from 'csurf';
import Joi from 'joi';
import { AuthController } from '../controllers/authController';
import { authRateLimiter } from '../middleware/rateLimiter';
import { validateRequest } from '../middleware/validateInput';
import {
  signUpSchema,
  signInSchema,
  signInMfaSchema,
  confirmSchema,
  resendSchema,
  forgotSchema,
  resetSchema,
  inviteSchema,
} from '../middleware/authSchemas';
import { requireAuth } from '../middleware/requireAuth';
import { getPasswordPolicy } from '../services/cognitoService';
import { checkAuth } from '../middleware/checkAuth';
import { csrfProtection } from '../middleware/csrf';
import { createEphemeralToken } from '../utils/ephemeralStore';
import { checkSignupToken } from '../middleware/checkSignupToken';

const router = Router();


router.get('/i/:code', (req, res) => {
  const code = (req.params.code || '').toUpperCase().trim();
  if (!code) return res.redirect('/auth/signUp');
  res.cookie('inviteCode', code, {
    httpOnly : true,
    secure   : true,
    sameSite : 'none',
    path     : '/',
    maxAge   : 24 * 60 * 60 * 1000,
  });
  return res.redirect('/auth/signUp');
});

router.get('/password-policy', async (_req,res)=>{
  try{
    const policy = await getPasswordPolicy();
    return res.json(policy);
  }catch(e){
    return res.status(500).json({ error:'Cannot fetch policy' });
  }
});


router.use((req, _res, next) => {
  console.log(`=== [authRoutes] ${req.method} ${req.url}`);
  next();
});


router.post(
  '/signup',
  csrfProtection,
  authRateLimiter,
  validateRequest(signUpSchema),
  AuthController.signUp,
);

router.post('/signin',   csrfProtection, authRateLimiter, validateRequest(signInSchema),   AuthController.signIn);
router.post('/signinmfa',csrfProtection, authRateLimiter, validateRequest(signInMfaSchema),AuthController.signInMfa);
router.post(                              
  '/invite',
  csrfProtection,
  checkAuth,
  checkSignupToken,                              
  validateRequest(inviteSchema),
  AuthController.submitInvite,
);
router.post('/confirm', csrfProtection,  authRateLimiter, validateRequest(confirmSchema),  AuthController.confirm);
router.post('/resend', csrfProtection,   authRateLimiter, validateRequest(resendSchema),   AuthController.resend);
router.post('/forgot', csrfProtection,   authRateLimiter, validateRequest(forgotSchema),   AuthController.forgotPassword);
router.post('/reset', csrfProtection,    authRateLimiter, validateRequest(resetSchema),    AuthController.resetPassword);




const emptySchema = Joi.object({});                   
router.post(
  '/refresh',
  csrfProtection,
  authRateLimiter,                                    
  validateRequest(emptySchema),
  AuthController.refresh,
);


router.get('/google/login',    AuthController.googleLogin);
router.get('/google/callback', AuthController.googleCallback);
router.get('/apple/login',     AuthController.appleLogin);
router.get('/apple/callback',  AuthController.appleCallback);

router.get(
  '/exists',
  authRateLimiter,
  (req, _r, next) => { req.query.email = (req.query.email || '').toString().toLowerCase(); next(); },
  AuthController.emailExists,
);


router.post('/logout', csrfProtection, AuthController.logout);

export default router;
