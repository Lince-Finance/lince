import KeyIcon from "@/assets/key-icon.svg";

import LoginFormHeading from "@/components/login/login-form-heading";
import { Box, HStack, Image, Spinner, Text, VStack } from "@chakra-ui/react";

const WithPasskey = () => {
  return (
    <Box bg={"black"} minH={"100dvh"} px={"2xl"} py={5}>
      {/* Welcome text */}
      <LoginFormHeading
        title="Log in with passkey"
        desc="userpasskey@gmail.com"
      />

      {/* Key Icon and Loading States */}
      <VStack
        alignItems={"center"}
        justifyContent={"center"}
        gap={"xs"}
        w={"100%"}
        my={"9xl"}
      >
        <Image src={KeyIcon.src} alt="key-icon" />

        <HStack alignItems={"center"} justifyContent={"center"} gap={"4xs"}>
          <Spinner color={"goldFang.solid.50"} size={"xs"} />

          <Text color={"text.lince.subtle"} fontSize={"step -1"}>
            Log in with passkey
          </Text>
        </HStack>
      </VStack>
    </Box>
  );
};

export default WithPasskey;
