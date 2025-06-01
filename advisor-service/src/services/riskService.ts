import type { Answers }  from '../types/risk';
import type { Mix }      from '../utils/riskEngine';
import { totalRisk, investmentMix, projectedApy } from '../utils/riskEngine';

export interface RiskResult {
  score: number;
  mix: Mix;
  projectedApy: number;
}

export const buildRiskResult = (answers: Answers): RiskResult => {
  const score = totalRisk(answers);
  const exposure = answers.EXPOSURE as ('no-vol' | 'low-vol' | 'accept' | undefined);
  const mix      = investmentMix(score, exposure);
  const projectedApyValue = projectedApy(mix);

  return { score, mix, projectedApy: projectedApyValue };
};
