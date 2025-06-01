import type { RequestHandler } from 'express';
import { questions } from '../utils/riskFlow';
import {
  totalRisk,
  investmentMix,
  projectedApy,
  riskProfile,
} from '../utils/riskEngine';
import type { Answers, StepId } from '../types/risk';
import { updateUser }    from '../services/userDbService';
import { interpretAnswer } from '../utils/interpretAnswer';

export const getQuestions: RequestHandler = (_req, res) => {
  res.json({ questions });
};

export const postAnswer: RequestHandler = async (req, res, next) => {
  try {
    console.log('[BE] body →', req.body);
    const { step, text } = req.body as { step: StepId; text: string };
    const ans = await interpretAnswer(step, text);
    console.log('[BE] ans  ←', ans);
    res.json(ans);
  } catch (err) { next(err); }
};

export const postAnswers: RequestHandler = async (req, res, next) => {
  try {
    const raw = (req as any).validatedAnswers as Partial<Answers>;

    const answers: Partial<Answers> = {};
    const unclear: string[] = [];

    for (const [step, val] of Object.entries(raw)) {
      const q = questions.find(q => q.id === step)!;

      if (q.options.some(o => o.id === val)) {
        answers[step as keyof Answers] = val;
        continue;
      }

      const { optionId, needsClarification } =
        await interpretAnswer(step as StepId, val as string);

      answers[step as keyof Answers] = optionId;
      if (needsClarification) unclear.push(step);
    }

    if (unclear.length) {
      return res.json({
        retryRequired : true,
        doubtful      : unclear,
        message       : 'Some answers were unclear — please review them.',
      });
    }

    const score    = totalRisk(answers);
    const exposure = answers.EXPOSURE as ('no-vol' | 'low-vol' | 'accept' | undefined);
    const mix      = investmentMix(score, exposure);
    const apy      = projectedApy(mix);

    const userId: string | undefined = (req as any).user?.sub;
    if (userId) {
      await updateUser(userId, {
        riskScore     : String(score),
        riskProfile   : riskProfile(score),
        onboardingDone: true,
      });
    }

    res.json({ risk: score, mix, projectedApy: apy });
  } catch (err) {
    next(err);
  }
};
