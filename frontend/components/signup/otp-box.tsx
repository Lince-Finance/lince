"use client";

import { PinInput } from "@chakra-ui/react";
import { Dispatch, SetStateAction, useState } from "react";

const OTPBox = ({
  value,
  setValue,
}: {
  value: string[];
  setValue: Dispatch<SetStateAction<string[]>>;
}) => {
  // Styles
  const reusableStyles = {
    w: "100%",
    height: "8xl",
    p: "s",
    color: "grayCliff.solid.100",
    borderWidth: "2px",
    borderRadius: "none",
    borderLeft: "none",
    borderY: "none",
    borderColor: "grayCliff.solid.800",
    _placeholder: {
      color: "grayCliff.solid.400",
      fontSize: "20px",
    },
  };

  const lastOtpBoxInput = {
    w: "100%",
    height: "8xl",
    p: "s",
    color: "grayCliff.solid.100",
    borderWidth: "2px",
    borderRadius: "none",
    borderX: "none",
    borderY: "none",
    borderColor: "grayCliff.solid.800",
    _placeholder: {
      color: "grayCliff.solid.400",
      fontSize: "20px",
    },
  };

  return (
    <PinInput.Root value={value} onValueChange={(e) => setValue(e.value)}>
      <PinInput.HiddenInput />
      <PinInput.Control
        gap={"0px"}
        border={"2px solid"}
        borderColor={"grayCliff.solid.800"}
        rounded={"l2"}
        className="otp-box"
      >
        <PinInput.Input
          index={0}
          {...reusableStyles}
          roundedTopLeft={"l2"}
          roundedBottomLeft={"l2"}
        />
        <PinInput.Input index={1} {...reusableStyles} />
        <PinInput.Input index={2} {...reusableStyles} />
        <PinInput.Input index={3} {...reusableStyles} />
        <PinInput.Input index={4} {...reusableStyles} />
        <PinInput.Input
          index={5}
          {...lastOtpBoxInput}
          roundedTopRight={"l2"}
          roundedBottomRight={"l2"}
        />
      </PinInput.Control>
    </PinInput.Root>
  );
};

export default OTPBox;
