import MiddleImage from "@/assets/onboarding-intro.svg";

import { Box, Button, Image, Text } from "@chakra-ui/react";
import OnboardingDots from "../reusable/onboarding-dots";
import { emailLoginBtnStyles } from "@/styles/reusable-styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";

const IntroContent = () => {
  // Hooks
  const router = useRouter();

  // OnCLick Func
  function handleClick() {
    router.push("/onboarding/questions/goal");
  }

  return (
    <>
      {/* Heading */}
      <Box w={"100%"}>
        <OnboardingDots activeIdx={1} />

        <Box mt={"xl"}>
          <Text
            fontWeight={"900"}
            color={"grayCliff.solid.100"}
            fontSize={"step1"}
          >
            I'm Your Financial Strategy Assistant, Leo
          </Text>

          <Text color={"grayCliff.solid.400"} my={"4xs"}>
            I'll analyze your responses to build your personalized investment
            plan.{" "}
          </Text>

          <Text color={"grayCliff.solid.400"}>
            Select from options or provide{" "}
            <Text as={"span"} fontWeight={"900"}>
              Custom answers
            </Text>{" "}
            for more tailored recommendations.
          </Text>
        </Box>
      </Box>

      {/* Image */}
      <Box w={"100%"}>
        <Image src={MiddleImage.src} alt="middle-img" />
      </Box>

      {/* Button */}
      <Button {...emailLoginBtnStyles} onClick={handleClick}>
        Continue
        <FontAwesomeIcon icon={faArrowRight} />
      </Button>
    </>
  );
};

export default IntroContent;
