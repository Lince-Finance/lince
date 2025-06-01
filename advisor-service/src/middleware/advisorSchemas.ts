import * as Joi from 'joi';
export const chatSchema = Joi.object({
  messages: Joi.array().items(
    Joi.object({
      role: Joi.string().valid('user','assistant').required(),
      content: Joi.string().min(1).max(4000).required(),
    })
  ).min(1).required(),
});
