"use client";

import { Box, VStack } from "@chakra-ui/react";
import AuthLayout from "@/components/AuthLayout";
import LoginBanner from "@/components/login/login-banner";
import LoginCarousel from "@/components/login/login-carousel";
import LoginBtns from "@/components/login/login-btns";

export default function HomePage() {
  return (
    <AuthLayout>
      <Box
        w="100%"
        maxW={"500px"}
        mx={"auto"}
        minHeight="100dvh"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <VStack
          gap={["2", "4", "6"]}
          w="100%"
          maxW="container.md"
          align="stretch"
          justifyContent={"space-between"}
          flex="1"
        >
          <Box>
            <LoginBanner />
            <LoginCarousel />
          </Box>

          <LoginBtns />
        </VStack>
      </Box>
    </AuthLayout>
  );
}
