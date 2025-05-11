import { Box, HStack } from "@chakra-ui/react";

const OnboardingDots = ({ activeIdx }: { activeIdx?: number }) => {
  return (
    <HStack alignItems={"center"} gap={"5xs"}>
      {/* Single Dot */}
      {Array.from({ length: 4 }).map((_, idx) => (
        <Box
          key={idx}
          w={activeIdx === idx ? "16px" : "6px"}
          h={"6px"}
          rounded={"9999px"}
          bg={activeIdx === idx ? "grayCliff.solid.500" : "grayCliff.solid.900"}
        ></Box>
      ))}
    </HStack>
  );
};

export default OnboardingDots;
