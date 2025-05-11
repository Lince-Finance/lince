import { Box, Button, Text } from "@chakra-ui/react";
import React from "react";
import OnboardingDots from "../reusable/onboarding-dots";
import GoalsContainer from "./goals-container";

const GoalsContent = () => {
  return (
    <>
      {/* Top Part */}
      <Box w={"100%"}>
        {/* Dots */}
        <OnboardingDots activeIdx={1} />

        {/* Heading */}
        <Text
          fontWeight={"900"}
          color={"grayCliff.solid.100"}
          fontSize={"step1"}
          mt={"xl"}
        >
          What's your top goal using Lince?
        </Text>
      </Box>

      {/* Bottom */}
      <GoalsContainer />
    </>
  );
};

export default GoalsContent;
