import { RequestHandler } from 'express';
import * as Joi           from 'joi';
import { questions }      from '../utils/riskFlow';

const schema = Joi.object(
  Object.fromEntries(
    questions.map(q => [
      q.id,
      Joi.string().trim().min(1).max(200).required()
    ]),
  ),
)
.required()
.unknown(false);

export const validateAnswers: RequestHandler = (req, res, next) => {
  const { error, value } = schema.validate(
    req.body.answers ?? {},
    { abortEarly: false },
  );

  if (error) {
    return res.status(400).json({
      error  : 'INVALID_ANSWERS',
      details: error.details,
    });
  }

  (req as any).validatedAnswers = value;
  next();
};
