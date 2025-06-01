import { Box, Image, Text } from "@chakra-ui/react";
import { StaticImageData } from "next/image";
import React from "react";

const ContainerTopBox = ({
  iconSrc,
  title,
  desc,
  showIcon = true,
}: {
  iconSrc?: StaticImageData;
  title: string;
  desc: string;
  showIcon?: boolean;
}) => {
  return (
    <>
      {showIcon === true ? (
        <Box pb={"xs"}>
          <Image src={iconSrc?.src} alt="stop-icon" />
        </Box>
      ) : null}

      <Box w={"100%"} mb={"2xl"}>
        <Text
          fontWeight={"900"}
          color={"grayCliff.solid.100"}
          fontSize={"step1"}
          my={"6xs"}
        >
          {title}
        </Text>

        <Text color={"grayCliff.solid.400"}>{desc}</Text>
      </Box>
    </>
  );
};

export default ContainerTopBox;
