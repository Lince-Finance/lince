// context/StrategyContext.tsx

import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type SetStateAction,
  type ReactNode,
} from "react";

// Tipo del contexto
type StrategyContextType = {
  showAllStrategyCards: boolean;
  setShowAllStrategyCards: Dispatch<SetStateAction<boolean>>;
};

// Crear el contexto
const StrategyContext = createContext<StrategyContextType | undefined>(
  undefined
);

// Hook personalizado para usar el contexto
export function useStrategy() {
  const context = useContext(StrategyContext);
  if (!context) {
    throw new Error("useStrategy must be used within a StrategyProvider");
  }
  return context;
}

// Proveedor del contexto
export function StrategyProvider({ children }: { children: ReactNode }) {
  const [showAllStrategyCards, setShowAllStrategyCards] = useState(false);

  return (
    <StrategyContext.Provider
      value={{ showAllStrategyCards, setShowAllStrategyCards }}
    >
      {children}
    </StrategyContext.Provider>
  );
}

export default StrategyContext;
