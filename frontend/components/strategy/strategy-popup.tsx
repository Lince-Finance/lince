import CloseIcon from "@/assets/close-button.svg";

import { Box, HStack, Image, Text } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import StrategyOverviewCard from "./strategy-overview-card";

import type { Dispatch, SetStateAction } from "react";
import {
  drawerSCardApyStyles,
  drawerStrategyCardStyles,
  strategyPopupStyles,
} from "@/styles/reusable-styles";
import { defaultStrategiesCardsData } from "@/data/placeholder-data";
import { useAdvisorStore } from "@/contexts/useAdvisorStore";
import { csrfFetch } from "@/utils/fetcher";

const MotionBox = motion.create(Box);

export default function StrategyPopup({
  state,
  setState,
}: {
  state: boolean;
  setState: Dispatch<SetStateAction<boolean>>;
}) {
  const setRiskProfile = useAdvisorStore((s) => s.setRiskProfile);

  async function selectStrategyBtnClick(strategy: {
    title: string;
    risk: string;
    desc: string;
    apy: string;
  }) {
    // Map strategy to risk profile
    let score: number;
    let profile: 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE';

    if (strategy.title === 'Sentinel') {
      score = 3;
      profile = 'CONSERVATIVE';
    } else if (strategy.title === 'Balancer') {
      score = 6;
      profile = 'MODERATE';
    } else {
      score = 9;
      profile = 'AGGRESSIVE';
    }

    try {
      // Update risk profile in database
      const response = await csrfFetch('/api/user/risk-profile', {
        method: 'POST',
        body: JSON.stringify({ riskProfile: profile }),
      });

      // Update local state
      setRiskProfile(score, profile);
      setState(false);
    } catch (error) {
      console.error('[selectStrategyBtnClick]', error);
    }
  }

  return (
    <AnimatePresence>
      {state && (
        <MotionBox
          key="strategy-popup"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{
            type: "spring",
            stiffness: 180,
            damping: 18,
          }}
          {...strategyPopupStyles}
        >
          {/* Header */}
          <HStack
            alignItems="center"
            justifyContent="space-between"
            gap="2"
            mb={5}
            px={8}
          >
            <Text fontSize="step1" color="grayCliff.solid.100">
              Default Strategies
            </Text>

            <Image
              src={CloseIcon.src}
              alt="close-btn"
              onClick={() => setState(false)}
              cursor="pointer"
            />
          </HStack>

          {/* Cards */}
          <HStack
            alignItems="center"
            gap="s"
            overflow="auto"
            className="hide-scrollbar"
          >
            {defaultStrategiesCardsData?.map(({ content, imgSrc }, idx) => (
              <StrategyOverviewCard
                key={idx}
                content={content}
                imgSrc={imgSrc}
                showBlobOverlay={false}
                mainStyles={drawerStrategyCardStyles}
                apyStyles={drawerSCardApyStyles}
                imgBoxStyles={{ height: "161px" }}
                onClickFn={() => selectStrategyBtnClick(content)}
                ml={idx === 0 ? "8" : 0}
                mr={idx === defaultStrategiesCardsData.length - 1 ? "8" : 0}
              />
            ))}
          </HStack>
        </MotionBox>
      )}
    </AnimatePresence>
  );
}
