import { Box, HStack, Text } from "@chakra-ui/react";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React from "react";

const LoginMethodBtn = ({
  iconName,
  title,
  desc,
  target,
}: {
  iconName: IconProp;
  title: string;
  desc: string;
  target: string;
}) => {
  return (
    <Link
      href={target}
      style={{
        width: "100%",
      }}
    >
      <Box
        as={"button"}
        w={"100%"}
        height={"100%"}
        py={"xl"}
        px={"l"}
        rounded={"l3"}
        border={"2px solid"}
        borderColor={"grayCliff.solid.800"}
        bg={"transparent"}
        textAlign={"start"}
        _hover={{
          background: "grayCliff.solid.950",
          borderColor: "grayCliff.solid.900",
        }}
      >
        {/* Icon */}
        <HStack
          w={"100%"}
          alignItems={"center"}
          justifyContent={"space-between"}
          gap={"3xs"}
          color={"grayCliff.solid.400"}
        >
          {/* Left */}
          <FontAwesomeIcon icon={iconName} />

          {/* Right */}
          <FontAwesomeIcon icon={faChevronRight} />
        </HStack>

        {/* Title */}
        <Box w={"100%"} mt={"5xs"} mb={"6xs"}>
          <Text color={"grayCliff.solid.100"} fontWeight={"600"}>
            {title}
          </Text>
        </Box>

        {/* Desc */}
        <Box w={"100%"}>
          <Text
            color={"grayCliff.solid.100"}
            opacity={"0.64"}
            fontSize={"step -1"}
          >
            {desc}
          </Text>
        </Box>
      </Box>
    </Link>
  );
};

export default LoginMethodBtn;
