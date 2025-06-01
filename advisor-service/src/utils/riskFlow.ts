import { StepId } from '../types/risk';

export interface Option   { id: string; label: string; risk: number; }
export interface Question {
  id: StepId;
  intro: string;
  options: Option[];
  summaryLabel: string;
  allowCustom: boolean;
}

export const questions: Question[] = [
  {
    id   : 'GOAL',
    intro: "What's your top goal using Lince?",
    options: [
      { id:'protect',      label:'I want to protect my money',                  risk:3 },
      { id:'grow-protect', label:'I want to grow my money while I protect it',  risk:6 },
      { id:'grow-max',     label:'I want to grow my money as much as possible', risk:9 },
    ],
    allowCustom : true,
    summaryLabel: 'Investment Goals Captured',
  },
  {
    id   : 'TIME',
    intro: 'How long you want to hold your investment on Lince?',
    options: [
      { id:'lt-1y', label:'Less than a year',  risk:3 },
      { id:'1-3y',  label:'1-3 years',         risk:5 },
      { id:'3-7y',  label:'3-7 years',         risk:7 },
      { id:'gt-7y', label:'More than 7 years', risk:8 },
    ],
    allowCustom : true,
    summaryLabel: 'Time Investment Established',
  },
  {
    id   : 'EXPERIENCE',
    intro: 'Have you invested on Crypto Before?',
    options: [
      { id:'recent', label:'Yes, I recently invested (less than a year ago)', risk:5 },
      { id:'1-3y',   label:'Yes, I have invested for years (1-3 years ago)',  risk:7 },
      { id:'gt-3y',  label:'Yes, I have experience (>3y)',                    risk:8 },
      { id:'never',  label:'No, I never invested on crypto',                  risk:2 },
    ],
    allowCustom : true,
    summaryLabel: 'Investing Level Integrated',
  },
  {
    id   : 'ALLOCATION',
    intro: 'Which percentage of your patrimony you expect to allocate to Lince?',
    options: [
      { id:'lt-10', label:'Less than 10%', risk:4 },
      { id:'10-25', label:'10-25%',        risk:6 },
      { id:'25-50', label:'25-50%',        risk:7 },
      { id:'gt-50', label:'More than 50%', risk:8 },
    ],
    allowCustom : true,
    summaryLabel: 'Capital Allocation Set',
  },
  {
    id   : 'EXPOSURE',
    intro: 'Would you like to have exposure to Crypto Market Volatility?',
    options: [
      { id:'no-vol',  label:"I don't want volatility", risk:3 },
      { id:'low-vol', label:'I want low volatility',    risk:5 },
      { id:'accept',  label:'I accept volatility',      risk:8 },
    ],
    allowCustom : true,
    summaryLabel: 'Volatility Preferences Saved',
  },
  {
    id   : 'RETURNS',
    intro: 'Which APY you expect to receive on Lince?',
    options: [
      { id:'lt-5',  label:'Less than 5%',  risk:2 },
      { id:'5-8',   label:'5-8%',          risk:5 },
      { id:'8-12',  label:'8-12%',         risk:7 },
      { id:'gt-12', label:'More than 12%', risk:9 },
    ],
    allowCustom : true,
    summaryLabel: 'Expected Targets Established',
  },
];
