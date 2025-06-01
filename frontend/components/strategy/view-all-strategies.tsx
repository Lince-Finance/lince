import { Box } from "@chakra-ui/react";
import StrategyPopup from "./strategy-popup";
import StrategyOverlay from "./strategy-overlay";
import { useStrategy } from "@/contexts/StrategyContext";

export default function ViewAllStrategies() {
  const { setShowAllStrategyCards, showAllStrategyCards } = useStrategy();

  return (
    <Box position={"relative"}>
      <Box
        as={"button"}
        color={"grayCliff.solid.400"}
        fontSize={"step -1"}
        fontWeight={"600"}
        onClick={() => setShowAllStrategyCards((prev) => !prev)}
      >
        View Default Strategies
      </Box>

      {/* Overlay */}
      {showAllStrategyCards === true ? (
        <StrategyOverlay setState={setShowAllStrategyCards} />
      ) : null}

      {/* Popup */}
      <StrategyPopup
        state={showAllStrategyCards}
        setState={setShowAllStrategyCards}
      />
    </Box>
  );
}
