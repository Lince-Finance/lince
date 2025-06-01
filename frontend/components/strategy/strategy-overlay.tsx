"use client";

import { Box, type BoxProps } from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";

export default function StrategyOverlay({
  setState,
  ...props
}: {
  setState: Dispatch<SetStateAction<boolean>>;
} & BoxProps) {
  return (
    <Box
      w={"100%"}
      h={"100%"}
      position={"fixed"}
      inset={0}
      bg={"rgba(9, 9, 11, 0.50)"}
      backdropFilter={"blur(2px)"}
      zIndex={99}
      onClick={() => setState((prev) => !prev)}
      {...props}
    ></Box>
  );
}
