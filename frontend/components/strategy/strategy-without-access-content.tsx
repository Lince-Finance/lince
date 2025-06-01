"use client";

import SentinelStrategyImage from "@/assets/sentinel-strategy-img.png";

import { Box } from "@chakra-ui/react";
import ContainerTopBox from "../reusable/container-top-box";
import StrategyOverviewCard from "./strategy-overview-card";
import StrategyAdditionalContent from "./strategy-addition-content";
import GetInFasterBtn from "./get-in-faster-btn";
import EstimatedWaitingTime from "./estimated-waiting-time";
import {
  selectedSCardApyStyles,
  selectedStrategyCardStyles,
} from "@/styles/reusable-styles";
import { useRouter } from "next/router";

export default function StrategyWithoutAccessContent() {
  // Hook
  const router = useRouter();

  // Data
  const selectedCardData = {
    title: "Sentinel",
    risk: "Low Risk - No Exposure",
    desc: "Watchful protection of your assets with the vigilant eye of a lynx, securing steady growth in safe territory.",
    apy: "5",
  };

  // OnClick func
  function selectStrategyBtnClick() {
    router.push("/user/invest");
  }

  return (
    <>
      {/* Top Part */}
      <Box px={"2xs"}>
        {/* Heading */}
        <Box>
          <ContainerTopBox
            title="Your Strategy is Ready!"
            desc="Here's the investment strategy we've tailored specifically for you."
            showIcon={false}
          />
        </Box>

        {/* Strategy Overview Card */}
        <Box pb={4}>
          <EstimatedWaitingTime />

          <StrategyOverviewCard
            showBlobOverlay
            hideSelectBtn
            mainStyles={selectedStrategyCardStyles}
            apyStyles={selectedSCardApyStyles}
            content={selectedCardData}
            onClickFn={selectStrategyBtnClick}
            imgSrc={SentinelStrategyImage}
          />

          {/* Or */}
          <StrategyAdditionalContent />

          {/* Button */}
          <GetInFasterBtn />
        </Box>
      </Box>
    </>
  );
}
