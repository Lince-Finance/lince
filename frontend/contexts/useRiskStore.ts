// contexts/useRiskStore.ts
import { create }   from 'zustand';
import { immer }    from 'zustand/middleware/immer';
import { persist }  from 'zustand/middleware';
import type { StepId } from '@/lib/advisorFlow';

interface RiskState {
  answers   : Partial<Record<StepId, string>>;
  setAnswer : (step: StepId, optionId?: string) => void;
  reset     : () => void;
}

export const useRiskStore = create<RiskState>()(
  persist(
    immer(set => ({
      answers: {},

      setAnswer: (step, optionId) =>
        set(state => {
          if (optionId === undefined) delete state.answers[step];
          else state.answers[step] = optionId;
        }),

      reset: () => set({ answers: {} }),
    })),
    {
      name    : 'advisor-answers',
      version : 1,
    },
  ),
);
