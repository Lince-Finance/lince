import { Box, HStack, Text } from "@chakra-ui/react";
import ViewAllStrategies from "./view-all-strategies";
import Link from "next/link";

export default function StrategyAdditionalContent() {
  return (
    <Box w={"100%"}>
      <Text
        color={"grayCliff.solid.700"}
        fontSize={"step -1"}
        fontWeight={"600"}
        textAlign={"center"}
        mt={4}
        mb={2}
      >
        OR
      </Text>

      {/* Links and drawars */}
      <HStack
        w={"100%"}
        alignItems={"center"}
        justifyContent={"center"}
        gap={"2"}
      >
        {/* Link to the all answer page */}
        <Link href={"/advisor/summary"}>
          <Text
            color={"grayCliff.solid.400"}
            fontSize={"step -1"}
            fontWeight={"600"}
          >
            Modify Answers
          </Text>
        </Link>

        {/* Line */}
        <Box w={"2px"} h={"18px"} bg={"grayCliff.solid.800"}></Box>

        {/* Select Strategy Btn */}
        <ViewAllStrategies />
      </HStack>
    </Box>
  );
}
