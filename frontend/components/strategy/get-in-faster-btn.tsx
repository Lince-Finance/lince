"use client";

import { Box, Button } from "@chakra-ui/react";
import { useState } from "react";
import GetInFasterPopup from "./get-in-faster-popup";
import { getInFasterBtnStyles } from "@/styles/reusable-styles";
import StrategyOverlay from "./strategy-overlay";

export default function GetInFasterBtn() {
  // State to toggle the popups
  const [showDrawer, setShowDrawer] = useState<boolean>(false);

  return (
    <Box position={"relative"}>
      {/* Btn */}
      <Button
        {...getInFasterBtnStyles}
        mt={3}
        onClick={() => setShowDrawer((prev) => !prev)}
      >
        Get in faster
      </Button>

      {/* Overlay */}
      {showDrawer === true ? (
        <StrategyOverlay setState={setShowDrawer} />
      ) : null}

      {/* Popup */}
      <GetInFasterPopup state={showDrawer} setState={setShowDrawer} />
    </Box>
  );
}
