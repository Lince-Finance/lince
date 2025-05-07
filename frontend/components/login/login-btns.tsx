import { emailLoginBtnStyles, loginBtnStyles } from "@/styles/reusable-styles";
import { Box, Button, Text, VStack } from "@chakra-ui/react";
import { faApple, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

const LoginBtns = () => {
  return (
    <Box w={"100%"} mt={"l"} px={"2xl"} pb={"7xl"}>
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
        <Button {...loginBtnStyles}>
          <FontAwesomeIcon icon={faGoogle} />
          Continue with Google
        </Button>

        {/* Continue with Apple Btn */}
        <Button {...loginBtnStyles}>
          <FontAwesomeIcon icon={faApple} size="lg" />
          Continue with Apple
        </Button>

        {/* Continue with email Btn */}
        <Link
          style={{
            width: "100%",
          }}
          href="/login/email"
        >
          <Button {...emailLoginBtnStyles}>Continue with email</Button>
        </Link>
      </VStack>
    </Box>
  );
};

export default LoginBtns;
