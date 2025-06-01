import { Box } from "@chakra-ui/react";
import DashboardStrategyContent from "./dashboard-strategy-content";

export default function DashboardHomeContainer() {
  return (
    <Box
      w={"100%"}
      bg={"grayCliff.solid.950"}
      color={"white"}
      p={"xl"}
      overflow={"auto"}
      className="hide-scrollbar"
    >
      {/* Strategy Content */}
      <DashboardStrategyContent />
    </Box>
  );
}
