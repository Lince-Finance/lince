"use client";

import StopIcon from "@/assets/dutone-icon.svg";
import ErroIcon from "@/assets/error-icon.svg";
import ContainerTopBox from "@/components/reusable/container-top-box";

import CustomContainer from "@/components/reusable/CustomContainer";
import ExclusiveAccessCode from "@/components/signup/exclusive-access-code";
import { emailLoginBtnStyles } from "@/styles/reusable-styles";
import { Box, Button, Field, Image, Text, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

const ExclusiveAccess = () => {
  // Hook
  const router = useRouter();

  // States
  const [accessCodes, setAccessCodes] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
  ]);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  //   OTP State Checking
  const isOtpComplete = accessCodes.every((digit) => digit.trim() !== "");

  //   OTP Submit Func
  const handleSubmit = () => {
    const enteredCode = accessCodes.join("");

    if (enteredCode !== "12345") {
      setHasError(true);
      setIsLoading(false);
    } else {
      setHasError(false);
      setIsLoading(true);

      //   Pushing to another route if the otp is (123456) (Dummy)
      setTimeout(() => {
        router.push("/signup/login-method");
      }, 4000);
    }
  };

  return (
    <CustomContainer>
      {/* Top Part */}
      <Box w={"100%"}>
        {/* Icon with heading desc */}
        <ContainerTopBox
          iconSrc={StopIcon}
          title="You need Exclusive Access"
          desc="Enter invitation code or request access by completing your investment profile."
        />

        <Field.Root invalid={hasError}>
          <ExclusiveAccessCode
            setValue={setAccessCodes}
            value={accessCodes}
            invalid={hasError}
          />
          {hasError && (
            <Field.ErrorText
              color={"redInx.solid.300"}
              display={"flex"}
              alignItems={"center"}
              gap={"4xs"}
              pl={"xs"}
              mt={"xs"}
            >
              <Image src={ErroIcon.src} alt="error-icon" />
              Invalid Code. Please double-check and try again.
            </Field.ErrorText>
          )}
        </Field.Root>
      </Box>

      {/* Buttons */}
      <VStack alignItems={"start"} gap={"l"} w={"100%"}>
        <Text
          w={"100%"}
          alignItems={"center"}
          color={"grayCliff.solid.400"}
          fontWeight={"600"}
          textAlign={"center"}
        >
          Request Access
        </Text>

        <Button
          {...emailLoginBtnStyles}
          onClick={handleSubmit}
          loading={isLoading}
          loadingText="Verifying Access..."
          disabled={!isOtpComplete || isLoading}
        >
          Enter Lince
        </Button>
      </VStack>
    </CustomContainer>
  );
};

export default ExclusiveAccess;
