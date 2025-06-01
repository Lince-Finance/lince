import { Box, Button } from "@chakra-ui/react";
import React, { useState } from "react";
import ContainerTopBox from "../reusable/container-top-box";
import ChoosePasswordInput from "./choose-password-input";
import StrengthMeter from "./strength-meter";
import { getPasswordStrength } from "@/helpers/password";
import { emailLoginBtnStyles } from "@/styles/reusable-styles";

const ChoosePasswordContent = () => {
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
    <>
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
    </>
  );
};

export default ChoosePasswordContent;
