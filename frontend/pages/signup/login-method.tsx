import DoorIcon from "@/assets/door-icon.svg";
import ContainerTopBox from "@/components/reusable/container-top-box";

import CustomContainer from "@/components/reusable/CustomContainer";
import LoginMethodBtn from "@/components/reusable/login-method-btn";
import { Box, Center, HStack, Text, VStack } from "@chakra-ui/react";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { faKey, faLock } from "@fortawesome/free-solid-svg-icons";

const LoginMethod = () => {
  return (
    <CustomContainer>
      {/* Top part */}
      <Box w={"100%"}>
        {/* Icon with heading desc */}
        <ContainerTopBox
          iconSrc={DoorIcon}
          title="Choose a login method"
          desc="Choose your preferred sign-in method to protect your account. "
        />

        {/* Method Btns */}
        <VStack alignItems={"start"} gap={"m"} mt={"2xl"}>
          {/* Common Password */}
          <LoginMethodBtn
            iconName={faLock}
            title="Common Password"
            desc="Use a simple password to sign in to your Lince Account"
            target="/signup/choose-password"
          />

          {/* Two Factor */}
          <HStack alignItems={"center"} gap={"3xs"} pt={"m"} pl={"m"}>
            <Text color={"grayCliff.solid.100"} fontSize={"step -1"}>
              Two-factor Authentication
            </Text>

            <Center
              w={"max-content"}
              px={"5xs"}
              h={"l"}
              bg={"goldFang.solid.950"}
              rounded={"l1"}
            >
              <Text
                color={"goldFang.solid.50"}
                fontSize={"step -2"}
                lineHeight={"0px"}
              >
                Extra Security
              </Text>
            </Center>
          </HStack>

          {/* Email Verification */}
          <LoginMethodBtn
            iconName={faEnvelope}
            title="Email Verification"
            desc="Extra layer of security with verification code sent to your email address."
            target="/login/email"
          />

          {/* Passkey */}
          <LoginMethodBtn
            iconName={faKey}
            title="Passkey"
            desc="Sign-in using your device's biometrics or PIN for enhanced security."
            target="/login/passkey"
          />
        </VStack>
      </Box>
    </CustomContainer>
  );
};

export default LoginMethod;
