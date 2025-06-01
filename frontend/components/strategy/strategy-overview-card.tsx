"use client";

import { emailLoginBtnStyles } from "@/styles/reusable-styles";
import {
  Box,
  Button,
  Image,
  Text,
  type StackProps,
  type SystemStyleObject,
} from "@chakra-ui/react";
import { StaticImageData } from "next/image";
import APYPercentage from "./apy-percentage";

export default function StrategyOverviewCard({
  mainStyles,
  apyStyles,
  imgBoxStyles,
  imgSrc,
  showBlobOverlay = false,
  content,
  onClickFn,
  hideSelectBtn = false,
  btnText,
  ...props
}: {
  mainStyles: SystemStyleObject;
  apyStyles: SystemStyleObject;
  imgBoxStyles?: SystemStyleObject;
  imgSrc?: StaticImageData;
  showBlobOverlay: boolean;
  content: {
    title: string;
    risk: string;
    desc: string;
    apy: string;
  };
  onClickFn: () => void;
  hideSelectBtn?: boolean;
  btnText?: string;
} & StackProps) {
  return (
    <Box {...mainStyles} {...props}>
      {/* Image */}
      <Box position={"relative"} w={"100%"} {...imgBoxStyles}>
        <Image src={imgSrc.src} alt="strategy-img" w={"100%"} h={"100%"} />

        {/* Apy Percent */}
        <APYPercentage percent={content.apy} apyStyles={apyStyles} />
      </Box>

      {/* Content */}
      <Box w={"100%"}>
        {/* name */}
        <Text
          color={"grayCliff.solid.100"}
          fontWeight={"900"}
          fontSize={"step1"}
        >
          {content.title}
        </Text>

        {/* Risk */}
        <Text color={"grayCliff.solid.100"} fontSize={"step -1"} my={1}>
          {content.risk}
        </Text>

        {/* Desc */}
        <Text
          color={"grayCliff.solid.400"}
          fontSize={"step -1"}
          lineClamp={"3"}
        >
          {content.desc}
        </Text>
      </Box>

      {/* Button */}
      {hideSelectBtn === false ? (
        <Button onClick={onClickFn} {...emailLoginBtnStyles}>
          {btnText ? btnText : "Select Strategy"}
        </Button>
      ) : null}

      {/* Blob Overlay */}
      {showBlobOverlay === true ? (
        <Box
          w={"290px"}
          h={"290px"}
          rounded={"9999px"}
          bg={
            "radial-gradient(50% 50% at 50% 50%, rgba(217, 217, 217, 0.50) 0%, rgba(115, 115, 115, 0.00) 100%)"
          }
          blur={"32px"}
          position={"absolute"}
          top={"-24%"}
          right={"-35%"}
          userSelect={"none"}
        ></Box>
      ) : null}
    </Box>
  );
}
