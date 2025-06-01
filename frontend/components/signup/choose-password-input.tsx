import { Box, Input } from "@chakra-ui/react";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Dispatch, SetStateAction } from "react";

const ChoosePasswordInput = ({
  showPassword,
  passwordValue,
  setPasswordValue,
  setShowPassword,
}: {
  showPassword: boolean;
  setShowPassword: Dispatch<SetStateAction<boolean>>;
  passwordValue: string;
  setPasswordValue: Dispatch<SetStateAction<string>>;
}) => {
  return (
    <Box w={"100%"} my={"2xl"}>
      <Box position={"relative"}>
        <Input
          type={showPassword ? "text" : "password"}
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
            icon={showPassword ? faEye : faEyeSlash}
            color={"#9C9888"}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ChoosePasswordInput;
