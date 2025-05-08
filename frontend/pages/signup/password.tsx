"use client";

import Icon from "@/assets/lince-icon.svg";

import LoginFormHeading from "@/components/login/login-form-heading";
import CustomContainer from "@/components/reusable/CustomContainer";
import { emailLoginBtnStyles } from "@/styles/reusable-styles";
import { Box, Button, Image, Input, VStack } from "@chakra-ui/react";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useState } from "react";

const SignupPassword = () => {
  // States
  const [passwordValue, setPasswordValue] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

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
          title="Sign up to Lince"
          desc="Enter your password to Sign up"
        />

        {/* Input */}
        <Box position={"relative"}>
          <Input
            type={showPassword === true ? "text" : "password"}
            placeholder="Password"
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
            value={passwordValue}
            onChange={(e) => setPasswordValue(e.target.value)}
          />

          <Box
            position={"absolute"}
            right={"4"}
            top={"50%"}
            transform={"translateY(-50%)"}
            zIndex={"99"}
            onClick={() => setShowPassword((prev) => !prev)}
          >
            <FontAwesomeIcon
              icon={showPassword === true ? faEye : faEyeSlash}
              color={"#9C9888"}
            />
          </Box>
        </Box>
      </Box>

      {/* Bottom Part */}
      <Link
        href={"/signup/confirm-email"}
        style={{
          width: "100%",
        }}
      >
        <Button {...emailLoginBtnStyles} disabled={passwordValue === ""}>
          Sign up
        </Button>
      </Link>
    </CustomContainer>
  );
};

export default SignupPassword;
