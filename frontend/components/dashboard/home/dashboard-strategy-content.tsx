import SentinelStrategyImage from "@/assets/sentinel-strategy-img.png";
import BalancerStrategyImage from "@/assets/balancer-strategy-img.png";
import PredatorStrategyImage from "@/assets/predator-strategy-img.png";
import Separator from "@/assets/separator.svg";

import { Box, Image, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import StrategyRedirectionBtns from "./strategy-redirection-btns";
import BecomeVIP from "./become-vip";
import { useStrategy } from "@/contexts/StrategyContext";
import { useAdvisorStore } from "@/contexts/useAdvisorStore";
import StrategyOverlay from "@/components/strategy/strategy-overlay";
import StrategyPopup from "@/components/strategy/strategy-popup";
import StrategyOverviewCard from "@/components/strategy/strategy-overview-card";
import {
  selectedSCardApyStyles,
  selectedStrategyCardStyles,
} from "@/styles/reusable-styles";
import { csrfFetch } from "@/utils/fetcher";

export default function DashboardStrategyContent() {
  // State from the provider
  const { showAllStrategyCards, setShowAllStrategyCards } = useStrategy();
  const [riskProfile, setRiskProfile] = useState<'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE' | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch risk profile from API
  useEffect(() => {
    async function fetchRiskProfile() {
      try {
        const response = await csrfFetch('/api/user/risk-profile');
        const { riskProfile: profile } = await response.json();
        setRiskProfile(profile);
      } catch (error) {
        console.error('[fetchRiskProfile]', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRiskProfile();
  }, []);

  // Get strategy based on risk profile
  const selectedCardData = riskProfile ? {
    title: riskProfile === 'CONSERVATIVE' ? 'Sentinel' :
           riskProfile === 'MODERATE' ? 'Balancer' : 'Apex Predator',
    risk: riskProfile === 'CONSERVATIVE' ? 'Low Risk - No Exposure' :
          riskProfile === 'MODERATE' ? 'Mid Risk - Mixed Exposure' : 'High Risk - Full Exposure',
    desc: riskProfile === 'CONSERVATIVE' ? 
          'Watchful protection of your assets with the vigilant eye of a lynx, securing steady growth in safe territory.' :
          riskProfile === 'MODERATE' ?
          'Poised between caution and opportunity, roaming both secure shelters and promising hunting grounds.' :
          'Commanding the highest terrain with dominant positioning, maximizing potential in the richest territories.',
    apy: riskProfile === 'CONSERVATIVE' ? '5' :
         riskProfile === 'MODERATE' ? '8' : '12',
  } : {
    title: "Sentinel",
    risk: "Low Risk - No Exposure",
    desc: "Watchful protection of your assets with the vigilant eye of a lynx, securing steady growth in safe territory.",
    apy: "5",
  };

  // Get strategy image based on risk profile
  const strategyImage = riskProfile ? 
    (riskProfile === 'CONSERVATIVE' ? SentinelStrategyImage :
     riskProfile === 'MODERATE' ? BalancerStrategyImage :
     PredatorStrategyImage) : SentinelStrategyImage;

  // OnClick func
  function selectStrategyBtnClick() {
    setShowAllStrategyCards((prev) => !prev);
  }

  if (isLoading) {
    return (
      <Box w={"100%"}>
        <Text color={"grayCliff.solid.100"} fontSize={"step2"} fontWeight={"600"}>
          Loading strategy...
        </Text>
      </Box>
    );
  }

  return (
    <Box w={"100%"}>
      {/* Heading */}
      <Text color={"grayCliff.solid.100"} fontSize={"step2"} fontWeight={"600"}>
        My Strategy
      </Text>

      {/* Btns */}
      <StrategyRedirectionBtns />

      <StrategyOverviewCard
        showBlobOverlay
        mainStyles={selectedStrategyCardStyles}
        apyStyles={selectedSCardApyStyles}
        content={selectedCardData}
        onClickFn={selectStrategyBtnClick}
        imgSrc={strategyImage}
        btnText="Change Strategy"
      />

      {/* Separator */}
      <Box my={"l"} w={"100%"}>
        <Image src={Separator.src} alt="separator-img" />
      </Box>

      {/* Become VIP */}
      <BecomeVIP />

      {/* Overlay */}
      {showAllStrategyCards === true ? (
        <StrategyOverlay setState={setShowAllStrategyCards} />
      ) : null}

      {/* Popup */}
      <StrategyPopup
        state={showAllStrategyCards}
        setState={setShowAllStrategyCards}
      />
    </Box>
  );
}
