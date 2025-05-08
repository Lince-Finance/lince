"use client";

import { PinInput } from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";

const ExclusiveAccessCode = ({
  value,
  setValue,
  invalid,
}: {
  value: string[];
  setValue: Dispatch<SetStateAction<string[]>>;
  invalid?: boolean;
}) => {
  // Styles
  const reusableStyles = {
    w: "100%",
    height: "8xl",
    p: "s",
    color: "grayCliff.solid.100",
    borderWidth: "2px",
    borderRadius: "l2",
    borderColor: invalid ? "redInx.solid.800" : "grayCliff.solid.800",
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
    borderRadius: "l2",
    borderColor: invalid ? "redInx.solid.800" : "grayCliff.solid.800",
    _placeholder: {
      color: "grayCliff.solid.400",
      fontSize: "20px",
    },
  };

  return (
    <PinInput.Root value={value} onValueChange={(e) => setValue(e.value)}>
      <PinInput.HiddenInput />
      <PinInput.Control
        gap={"4xs"}
        boxShadow={invalid ? "0 0 0 1px redInx.solid.800" : "none"}
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
        <PinInput.Input
          index={4}
          {...lastOtpBoxInput}
          roundedTopRight={"l2"}
          roundedBottomRight={"l2"}
        />
      </PinInput.Control>
    </PinInput.Root>
  );
};

export default ExclusiveAccessCode;
