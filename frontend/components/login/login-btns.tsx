import { emailLoginBtnStyles, loginBtnStyles } from "@/styles/reusable-styles";
import { Box, Button, Center, Text, VStack } from "@chakra-ui/react";
import { faApple, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

const LoginBtns = () => {
  return (
    <Box w={"100%"} mt={"l"} px={"2xl"} pb={"2xl"}>
      {/* Title */}
      <Text
        color={"grayLince.fg.subtle"}
        fontSize={"step -2"}
        textAlign={"center"}
      >
        Sign up or Log in
      </Text>

      {/* Buttons */}
      <VStack alignItems={"start"} gap={"s"} mt={"s"}>
        {/* Continue with Google Btn */}
        <Button {...loginBtnStyles} disabled>
          <FontAwesomeIcon icon={faGoogle} />
          Continue with Google
          <Center
            w={"max-content"}
            h={4}
            px={1}
            bg={"grayCliff.solid.600"}
            rounded={"4px"}
            position={"absolute"}
            right={2}
            top={2}
            zIndex={99}
          >
            <Text fontSize={"8px"} color={"grayCliff.solid.50"}>
              Coming Soon!
            </Text>
          </Center>
        </Button>

        {/* Continue with Apple Btn */}
        <Button {...loginBtnStyles} disabled>
          <FontAwesomeIcon icon={faApple} size="lg" />
          Continue with Apple
          <Center
            w={"max-content"}
            h={4}
            px={1}
            bg={"grayCliff.solid.600"}
            rounded={"4px"}
            position={"absolute"}
            right={2}
            top={2}
            zIndex={99}
          >
            <Text fontSize={"8px"} color={"grayCliff.solid.50"}>
              Coming Soon!
            </Text>
          </Center>
        </Button>

        {/* Continue with email Btn */}
        <Link
          style={{
            width: "100%",
          }}
          href="/auth/"
        >
          <Button {...emailLoginBtnStyles}>Continue with email</Button>
        </Link>
      </VStack>
    </Box>
  );
};

export default LoginBtns;
