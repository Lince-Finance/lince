import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AdvisorStore {
  riskProfile: {
    score: number;
    profile: 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE';
  } | null;
  setRiskProfile: (score: number, profile: 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE') => void;
  reset: () => void;
}

export const useAdvisorStore = create<AdvisorStore>()(
  persist(
    (set) => ({
      riskProfile: null,
      setRiskProfile: (score, profile) => set({ riskProfile: { score, profile } }),
      reset: () => set({ riskProfile: null }),
    }),
    {
      name: 'advisor-risk-profile',
      version: 1,
    }
  )
); 