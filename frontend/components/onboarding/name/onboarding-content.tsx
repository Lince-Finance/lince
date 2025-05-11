"use client";

import { Box, Button, Input } from "@chakra-ui/react";
import OnboardingDots from "../reusable/onboarding-dots";
import ContainerTopBox from "@/components/reusable/container-top-box";
import {
  emailInputStyles,
  emailLoginBtnStyles,
} from "@/styles/reusable-styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { ChangeEvent, useState } from "react";
import { useRouter } from "next/router";

const OnboardingContent = () => {
  // Hook
  const router = useRouter();

  // State
  const [nameValue, setNameValue] = useState<string>("");

  // Btn Click function
  function handleClick() {
    router.push("/onboarding/questions/intro");
  }

  return (
    <>
      <Box w={"100%"}>
        {/* Dots */}
        <OnboardingDots activeIdx={0} />

        {/* Heading */}
        <Box my={"xl"}>
          <ContainerTopBox
            showIcon={false}
            title="First Things First"
            desc="Let's get to know you - what should we call you?"
          />
        </Box>

        {/* Input */}
        <Input
          {...emailInputStyles}
          type="text"
          placeholder="Name"
          value={nameValue}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setNameValue(e.target.value)
          }
        />
      </Box>

      {/* Button */}
      <Button
        {...emailLoginBtnStyles}
        disabled={nameValue === ""}
        onClick={handleClick}
      >
        Continue
        <FontAwesomeIcon icon={faArrowRight} />
      </Button>
    </>
  );
};

export default OnboardingContent;
