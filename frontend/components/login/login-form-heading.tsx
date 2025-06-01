import { Box, Text } from "@chakra-ui/react";
import React from "react";

const LoginFormHeading = ({ title, desc }: { title: string; desc: string }) => {
  return (
    <Box my={"l"}>
      {/* Title */}
      <Text fontSize={"step1"} color={"grayCliff.solid.100"} fontWeight={"900"}>
        {title}
      </Text>

      {/* Desc */}
      <Text color={"grayCliff.solid.400"} fontSize={"16px"} mt={"6xs"}>
        {desc}
      </Text>
    </Box>
  );
};

export default LoginFormHeading;
