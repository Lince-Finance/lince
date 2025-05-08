import { FlexProps, StackProps, VStack } from "@chakra-ui/react";
import React, { ReactNode } from "react";

const CustomContainer = ({
  children,
  ...props
}: {
  children: ReactNode;
} & StackProps) => {
  return (
    <VStack
      alignItems={"start"}
      justifyContent={"space-between"}
      bg={"black"}
      minH={"100dvh"}
      px={"2xl"}
      py={5}
      {...props}
    >
      {children}
    </VStack>
  );
};

export default CustomContainer;
