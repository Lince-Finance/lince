import { questions } from './riskFlow';
import { StepId, Answers } from '../types/risk';

export const riskScoreFor = (step: StepId, optionId: string): number => {
  const q = questions.find(q => q.id === step)!;
  return q.options.find(o => o.id === optionId)?.risk ?? 0;
};

export const totalRisk = (answers: Partial<Answers>): number => {
  const entries = Object.entries(answers) as [StepId, string][];
  const sum = entries.reduce(
    (acc, [step, opt]) => acc + riskScoreFor(step, opt),
    0,
  );
  return entries.length ? +(sum / entries.length).toFixed(2) : 0;
};

export type RiskProfile = 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE';

export const riskProfile = (score: number): RiskProfile => {
  if (score <= 3) return 'CONSERVATIVE';
  if (score <= 6) return 'MODERATE';
  return 'AGGRESSIVE';
};

export interface Mix { [token: string]: number }

export const investmentMix = (
  risk: number,
  exposure: 'no-vol' | 'low-vol' | 'accept' | undefined,
): Mix => {
  const exp = exposure ?? 'no-vol';

  if (exp === 'no-vol') return { CRT: 1 };
  if (exp === 'low-vol') {
    if (risk <= 3) return { CRT: 0.8, JLP: 0.2 };
    if (risk <= 6) return { CRT: 0.5, JLP: 0.5 };
    if (risk <= 8) return { CRT: 0.3, JLP: 0.7 };
    return { JLP: 1 };
  }
  if (risk <= 3) return { CRT: 0.2, JLP: 0.8 };
  return { JLP: 1 };
};

export const projectedApy = (mix: Mix): number => {
  const APY: Record<string, [number, number]> = {
    CRT: [0.08, 0.12],
    JLP: [0.15, 0.35],
  };
  return +Object.entries(mix)
    .reduce((acc, [t, p]) => acc + p * ((APY[t][0] + APY[t][1]) / 2), 0)
    .toFixed(4);
};
