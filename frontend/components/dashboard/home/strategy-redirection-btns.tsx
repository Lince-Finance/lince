import { Box, HStack } from "@chakra-ui/react";
import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export default function StrategyRedirectionBtns() {
  return (
    <HStack
      alignItems={"center"}
      justifyContent={"space-between"}
      gap={"0"}
      my={"m"}
      position={"relative"}
    >
      {/* Withdraw Button */}
      <Link
        href={"/user/dashboard"}
        style={{
          width: "100%",
        }}
      >
        <Box
          as={"button"}
          w={"100%"}
          h={12}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          gap={"4xs"}
          border={"2px solid"}
          borderColor={"grayCliff.solid.900"}
          borderRight={"none"}
          bg={"transparent"}
          fontSize={"step -1"}
          color={"grayCliff.solid.50"}
          fontWeight={"600"}
          rounded="8px 0 0 8px"
        >
          Withdraw
          <Box>
            <FontAwesomeIcon icon={faArrowDown} />
          </Box>
        </Box>
      </Link>

      {/* Deposit Button */}
      <Link
        href={"/user/dashboard"}
        style={{
          width: "100%",
        }}
      >
        <Box
          as={"button"}
          w={"100%"}
          h={12}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          gap={"4xs"}
          border={"2px solid"}
          borderColor={"goldFang.solid.600"}
          borderLeft={"none"}
          color={"goldFang.solid.50"}
          fontSize={"step -1"}
          bg={"goldFang.solid.950"}
          fontWeight={"600"}
          rounded="0 8px 8px 0"
        >
          Deposit
          <Box>
            <FontAwesomeIcon icon={faArrowUp} />
          </Box>
        </Box>
      </Link>

      {/* Line */}
      <Box
        w={"2px"}
        h={"12"}
        bg={"goldFang.solid.600"}
        position={"absolute"}
        top={"0"}
        left={"50%"}
        transform={"translateX(-50%)"}
      ></Box>
    </HStack>
  );
}
