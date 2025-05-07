"use client";

import LoginFormHeading from "@/components/login/login-form-heading";
import OTPBox from "@/components/signup/otp-box";
import { emailLoginBtnStyles } from "@/styles/reusable-styles";
import { Box, Button, Text, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const ConfirmEmail = () => {
  // Hook
  const router = useRouter();

  // States
  const [value, setValue] = useState<string[]>(["", "", "", "", "", ""]);
  const [counter, setCounter] = useState(30);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  // Checking the otp state array is filled or not (Basically for the conditional rendering of teh buttons)
  const isOtpComplete = value.every((digit) => digit.trim() !== "");

  // to make the timer interactive
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (counter > 0) {
      interval = setInterval(() => {
        setCounter((prev) => prev - 1);
      }, 1000);
    } else {
      setIsButtonDisabled(false);
    }

    return () => clearInterval(interval);
  }, [counter]);

  // Dummy Resend Otp Function
  const handleResend = () => {
    setCounter(30);
    setIsButtonDisabled(true);
  };

  // Submit Function that handle the otp checking
  const handleSubmit = () => {
    router.push("/signup/email");
  };

  return (
    <VStack
      alignItems={"start"}
      justifyContent={"space-between"}
      gap={"10"}
      bg={"black"}
      minH={"100dvh"}
      px={"2xl"}
      pt={5}
      pb={"9xl"}
    >
      {/* Top Part */}
      <Box w={"100%"}>
        <LoginFormHeading
          title="Enter the 6-digit code"
          desc="Verify your email. We've sent the code to userexcluded@gmail.com"
        />
        <OTPBox value={value} setValue={setValue} />
      </Box>

      {/* Bottom Part */}
      <VStack alignItems={"start"} gap={"l"} w={"100%"}>
        {/* Go Back Btn (Password Page) */}
        <Link href={"/signup/password"} style={{ width: "100%" }}>
          <Text
            alignItems={"center"}
            color={"grayCliff.solid.400"}
            fontWeight={"600"}
            textAlign={"center"}
          >
            Go Back
          </Text>
        </Link>

        {/* Conditionally Rendering the Buttons */}
        {!isOtpComplete ? (
          <Button
            {...emailLoginBtnStyles}
            onClick={handleResend}
            disabled={isButtonDisabled}
          >
            {isButtonDisabled ? `Resend Code in ${counter}s` : "Resend Code"}
          </Button>
        ) : (
          <Button {...emailLoginBtnStyles} onClick={handleSubmit}>
            Submit
          </Button>
        )}
      </VStack>
    </VStack>
  );
};

export default ConfirmEmail;
