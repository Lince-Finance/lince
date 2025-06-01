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

    console.log('[DEBUG] Raw answers received:', raw);

    for (const [step, val] of Object.entries(raw)) {
      const q = questions.find(q => q.id === step)!;

      if (q.options.some(o => o.id === val)) {
        answers[step as keyof Answers] = val;
        const option = q.options.find(o => o.id === val);
        console.log(`[DEBUG] ${step}: ${val} → risk: ${option?.risk}`);
        continue;
      }

      const { optionId, needsClarification } =
        await interpretAnswer(step as StepId, val as string);

      answers[step as keyof Answers] = optionId;
      const option = q.options.find(o => o.id === optionId);
      console.log(`[DEBUG] ${step}: ${val} → interpreted as ${optionId} → risk: ${option?.risk}`);
      if (needsClarification) unclear.push(step);
    }

    if (unclear.length) {
      return res.json({
        retryRequired : true,
        doubtful      : unclear,
        message       : 'Some answers were unclear — please review them.',
      });
    }

    console.log('[DEBUG] Final processed answers:', answers);
    const score    = totalRisk(answers);
    console.log('[DEBUG] Calculated risk score:', score);
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
