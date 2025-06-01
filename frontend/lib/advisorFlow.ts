export type StepId =
  | 'GOAL'
  | 'TIME'
  | 'EXPERIENCE'
  | 'ALLOCATION'
  | 'EXPOSURE'
  | 'RETURNS';

export interface Option {
  id: string;
  label: string;
}

export interface Question {
  id: StepId;
  intro: string;
  options: Option[];
  allowCustom?: boolean;
  summaryLabel: string;
  ctaLabel?: string;
}

export const questions: Question[] = [
  {
    id: 'GOAL',
    intro: `What's your top goal using Lince?`,
    allowCustom: true,
    options: [
      { id: 'protect',      label: 'I want to protect my money' },
      { id: 'grow-protect', label: 'I want to grow my money while I protect it' },
      { id: 'grow-max',     label: 'I want to grow my money as much as possible' },
    ],
    summaryLabel: 'Investment Goals Captured',
    ctaLabel: 'Next question',
  },
  {
    id: 'TIME',
    intro: 'How long do you want to hold your investment on Lince?',
    allowCustom: true,
    options: [
      { id: 'lt-1y', label: 'Less than a year' },
      { id: '1-3y',  label: '1–3 years' },
      { id: '3-7y',  label: '3–7 years' },
      { id: 'gt-7y', label: 'More than 7 years' },
    ],
    summaryLabel: 'Time Investment Established',
    ctaLabel: 'Next question',
  },
  {
    id: 'EXPERIENCE',
    intro: 'Have you invested in crypto before?',
    allowCustom: true,
    options: [
      { id: 'recent', label: 'Yes, I invested recently (< 1 y)' },
      { id: '1-3y',   label: 'Yes, I have invested for 1–3 y' },
      { id: 'gt-3y',  label: 'Yes, I have invested for > 3 y' },
      { id: 'never',  label: 'No, never invested in crypto' },
    ],
    summaryLabel: 'Investing Level Integrated',
    ctaLabel: 'Next question',
  },
  {
    id: 'ALLOCATION',
    intro: 'What % of your patrimony do you expect to allocate to Lince?',
    allowCustom: true,
    options: [
      { id: 'lt-10', label: 'Less than 10 %' },
      { id: '10-25', label: '10–25 %' },
      { id: '25-50', label: '25–50 %' },
      { id: 'gt-50', label: 'More than 50 %' },
    ],
    summaryLabel: 'Capital Allocation Set',
    ctaLabel: 'Next question',
  },
  {
    id: 'EXPOSURE',
    intro: 'Would you like to have exposure to crypto-market volatility?',
    allowCustom: true,
    options: [
      { id: 'no-vol',  label: "I don't want volatility" },
      { id: 'low-vol', label: 'I want low volatility' },
      { id: 'accept',  label: 'I accept volatility' },
    ],
    summaryLabel: 'Volatility Preferences Saved',
    ctaLabel: 'Next question',
  },
  {
    id: 'RETURNS',
    intro: 'Which APY do you expect to receive on Lince?',
    allowCustom: true,
    options: [
      { id: 'lt-5',  label: 'Less than 5 %' },
      { id: '5-8',   label: '5–8 %' },
      { id: '8-12',  label: '8–12 %' },
      { id: 'gt-12', label: 'More than 12 %' },
    ],
    summaryLabel: 'Expected Targets Established',
    ctaLabel: 'Confirm',
  },
];
