import Joi from 'joi';

export const signUpSchema = Joi.object({
    email:       Joi.string().email().required(),
    password:    Joi.string().min(8).required(),
    displayName: Joi.string().min(3).max(40).required(),
    inviteCode:  Joi.string().min(4).max(20).uppercase().optional(),
  });
  
  export const inviteSchema = Joi.object({
    inviteCode: Joi.string().min(4).max(20).uppercase().required(),
  });

export const signInSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required()
});

export const signInMfaSchema = Joi.object({
    mfaToken: Joi.string().required(),
    totpCode: Joi.string().pattern(/^[0-9]{6}$/).required()
});

export const confirmSchema = Joi.object({
    token: Joi.string().required(),
    code: Joi.string().required()
});

export const resendSchema = Joi.object({
    token: Joi.string().required()
});

export const forgotSchema = Joi.object({
    email: Joi.string().email().required()
});

export const resetSchema = Joi.object({
    email: Joi.string().email().required(),
    code: Joi.string().required(),
    newPassword: Joi.string().min(8).required()
});
