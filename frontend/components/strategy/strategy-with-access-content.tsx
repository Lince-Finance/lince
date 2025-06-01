"use client";

import SentinelStrategyImage from "@/assets/sentinel-strategy-img.png";

import { Box } from "@chakra-ui/react";
import OnboardingDots from "../onboarding/reusable/onboarding-dots";
import ContainerTopBox from "../reusable/container-top-box";
import StrategyOverviewCard from "./strategy-overview-card";
import StrategyAdditionalContent from "./strategy-addition-content";
import { useRouter } from "next/router";
import {
  selectedSCardApyStyles,
  selectedStrategyCardStyles,
} from "@/styles/reusable-styles";

export default function StrategyWithAccessContent() {
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
    router.push("/user/dashboard");
  }

  return (
    <>
      {/* Top Part */}
      <Box px={"2xs"}>
        <OnboardingDots activeIdx={2} />

        {/* Heading */}
        <Box mt={"l"}>
          <ContainerTopBox
            title="Select Strategy"
            desc="Here's the investment strategy we've tailored specifically for you."
            showIcon={false}
          />
        </Box>

        {/* Strategy Overview Card */}
        <Box>
          <StrategyOverviewCard
            showBlobOverlay
            mainStyles={selectedStrategyCardStyles}
            apyStyles={selectedSCardApyStyles}
            content={selectedCardData}
            onClickFn={selectStrategyBtnClick}
            imgSrc={SentinelStrategyImage}
          />

          {/* Or */}
          <StrategyAdditionalContent />
        </Box>
      </Box>
    </>
  );
}
