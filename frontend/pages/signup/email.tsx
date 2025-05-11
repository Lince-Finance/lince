"use client";

import Icon from "@/assets/lince-icon.svg";

import LoginFormHeading from "@/components/login/login-form-heading";
import CustomContainer from "@/components/reusable/CustomContainer";
import {
  emailInputStyles,
  emailLoginBtnStyles,
} from "@/styles/reusable-styles";
import { Box, Button, Image, Input, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { useState } from "react";

const SignupEmail = () => {
  const [emailValue, setEmailValue] = useState<string>("");

  return (
    <CustomContainer>
      {/* Top Part */}
      <Box w={"100%"}>
        {/* Icon */}
        <Box>
          <Image src={Icon.src} alt="lince-icon" />
        </Box>

        {/* Welcome text */}
        <LoginFormHeading
          title="Sign up or Log in"
          desc="Enter your email to continue"
        />

        {/* Input */}
        <Input
          {...emailInputStyles}
          type="email"
          placeholder="Email"
          value={emailValue}
          onChange={(e) => setEmailValue(e.target.value)}
        />
      </Box>

      {/* Bottom Part */}
      <Link
        href={"/signup/password"}
        style={{
          width: "100%",
        }}
      >
        <Button {...emailLoginBtnStyles} disabled={emailValue === ""}>
          Continue
        </Button>
      </Link>
    </CustomContainer>
  );
};

export default SignupEmail;
