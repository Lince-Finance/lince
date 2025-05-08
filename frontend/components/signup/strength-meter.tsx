import { Box, HStack, Text } from "@chakra-ui/react";
import React from "react";

const StrengthMeter = ({
  strength,
  strengthColor,
  strengthText,
}: {
  strength: number;
  strengthColor: string;
  strengthText: string;
}) => {
  return (
    <Box w={"100%"}>
      <HStack alignItems={"start"} gap={"s"}>
        {[1, 2, 3].map((i) => (
          <Box
            key={i}
            w={"100%"}
            h={"12px"}
            bg={i <= strength ? strengthColor : "grayCliff.solid.800"}
            rounded={"sm"}
            transition={"background-color 0.3s"}
          />
        ))}
      </HStack>

      {/* Strength Text */}
      {strength > 0 && (
        <HStack
          alignItems={"center"}
          justifyContent={"space-between"}
          gap={"s"}
          mt={"4xs"}
        >
          <Text color={strengthColor} fontSize={"step -1"} fontWeight={"600"}>
            {strengthText}
          </Text>
          <Text color={"grayCliff.solid.400"} fontSize={"step -1"}>
            {strength === 1
              ? "Too weak"
              : strength === 2
              ? "Could be better"
              : "Very secure"}
          </Text>
        </HStack>
      )}
    </Box>
  );
};

export default StrengthMeter;
