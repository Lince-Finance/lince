import type { RequestHandler } from 'express';
import * as Joi from 'joi';
import { questions } from '../utils/riskFlow';

const schema = Joi.object({
  step: Joi.string()
           .valid(...questions.map(q => q.id))
           .required(),
  text: Joi.string().trim().min(1).max(4000).required(),
}).required();

export const validateAnswer: RequestHandler = (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      error  : 'INVALID_ANSWER',
      details: error.details,
    });
  }
  next();
};
