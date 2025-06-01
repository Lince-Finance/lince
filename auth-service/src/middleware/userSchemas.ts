import Joi from 'joi';

export const updateProfileSchema = Joi.object({
  displayName: Joi.string().min(3).max(40).optional(),
  riskProfile: Joi.string().valid('CONSERVATIVE', 'MODERATE', 'AGGRESSIVE').optional(),
  riskScore: Joi.string().pattern(/^\d+(\.\d+)?$/).optional(),
}).min(1);

export const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().min(8).required(),
  newPassword: Joi.string().min(8).required(),
});

export const mfaVerifySchema = Joi.object({
  userCode: Joi.string().pattern(/^[0-9]{6}$/).required(),
});

export const mfaAssociateSchema = Joi.object({});      
