
import Joi from 'joi';

export const createUrlSchema = Joi.object({
  sourceCurrency: Joi.string().uppercase().length(3).optional(),
  amount:         Joi.number().positive().max(25_000).optional(),   
  country:        Joi.string().length(2).uppercase().optional(),
  wallets: Joi.array().items(
    Joi.object({
      currency: Joi.string().lowercase().alphanum().min(2).max(10).required(),
      address : Joi.string().min(20).max(128).required(),           
    })
  ).min(1)
  .max(1024)
  .required(),
});
