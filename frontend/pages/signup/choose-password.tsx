"use client";

import ContainerTopBox from "@/components/reusable/container-top-box";
import CustomContainer from "@/components/reusable/CustomContainer";
import ChoosePasswordInput from "@/components/signup/choose-password-input";
import StrengthMeter from "@/components/signup/strength-meter";
import { getPasswordStrength } from "@/helpers/password";
import { emailLoginBtnStyles } from "@/styles/reusable-styles";
import { Box, Button } from "@chakra-ui/react";
import { useState } from "react";

const ChoosePassword = () => {
  // States
  const [passwordValue, setPasswordValue] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Strength Checker
  const strength = getPasswordStrength(passwordValue);
  const strengthText =
    strength === 0
      ? ""
      : strength === 1
      ? "Weak"
      : strength === 2
      ? "Medium"
      : "Strong";

  const strengthColor =
    strength === 1
      ? "redInx.solid.300"
      : strength === 2
      ? "orangeInx.solid.400"
      : strength === 3
      ? "greenInx.solid.300"
      : "transparent";

  return (
    <CustomContainer>
      {/* Top Part */}
      <Box w={"100%"}>
        <ContainerTopBox
          showIcon={false}
          title="Choose a password"
          desc="Before we begin, let's set up a strong password to protect your account."
        />

        {/* Password Input */}
        <ChoosePasswordInput
          passwordValue={passwordValue}
          setPasswordValue={setPasswordValue}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
        />

        {/* Password Strength Meter */}
        <StrengthMeter
          strength={strength}
          strengthColor={strengthColor}
          strengthText={strengthText}
        />
      </Box>

      {/* Bottom Part */}
      <Button {...emailLoginBtnStyles} disabled={strengthText !== "Strong"}>
        Confirm Password
      </Button>
    </CustomContainer>
  );
};

export default ChoosePassword;
