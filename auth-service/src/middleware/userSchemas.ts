import Joi from 'joi';

export const updateProfileSchema = Joi.object({
  displayName: Joi.string().min(3).max(40).required(),
});

export const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().min(8).required(),
  newPassword: Joi.string().min(8).required(),
});

export const mfaVerifySchema = Joi.object({
  userCode: Joi.string().pattern(/^[0-9]{6}$/).required(),
});

export const mfaAssociateSchema = Joi.object({});      
