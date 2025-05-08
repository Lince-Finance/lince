"use client";

import Icon from "@/assets/lince-icon.svg";

import LoginFormHeading from "@/components/login/login-form-heading";
import CustomContainer from "@/components/reusable/CustomContainer";
import { emailLoginBtnStyles } from "@/styles/reusable-styles";
import { Box, Button, Image, Input, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { useState } from "react";

const WithEmail = () => {
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
          type="email"
          placeholder="Email"
          p={"m"}
          rounded={"l2"}
          border={"2px solid"}
          borderColor={"grayCliff.solid.800"}
          w={"100%"}
          h={"9xl"}
          color={"grayCliff.solid.100"}
          _placeholder={{
            color: "grayCliff.solid.400",
          }}
          _focus={{
            borderColor: "grayCliff.solid.500",
            outline: "none",
          }}
          value={emailValue}
          onChange={(e) => setEmailValue(e.target.value)}
        />
      </Box>

      {/* Bottom Part */}
      <Link
        href={"/login/password"}
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

export default WithEmail;
