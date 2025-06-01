import CloseIcon from "@/assets/close-button.svg";
import GetInImage from "@/assets/get-in-faster-img.png";

import { Box, Center, HStack, Image, Text, VStack } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import type { Dispatch, SetStateAction } from "react";
import GetInFasterPopupSocialRedirection from "./get-in-faster-popu-social-redirection";
import GetInFasterLinkClipboard from "./get-in-faster-link-clipboard";
import { strategyPopupStyles } from "@/styles/reusable-styles";

const MotionBox = motion.create(Box);

export default function GetInFasterPopup({
  state,
  setState,
}: {
  state: boolean;
  setState: Dispatch<SetStateAction<boolean>>;
}) {
  function selectStrategyBtnClick() {
    setState(false);
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
          px={8}
          {...strategyPopupStyles}
        >
          {/* Header */}
          <HStack
            alignItems="center"
            justifyContent="space-between"
            gap="2"
            mb={4}
          >
            <Text fontSize="step1" color="grayCliff.solid.100">
              Get in faster
            </Text>

            <Image
              src={CloseIcon.src}
              alt="close-btn"
              onClick={selectStrategyBtnClick}
              cursor="pointer"
            />
          </HStack>

          {/* Content */}
          <VStack w={"100%"} gap={"m"}>
            {/* Image */}
            <Center w={"100%"}>
              <Image src={GetInImage.src} alt="get-in-img" />
            </Center>

            {/* List */}
            <Box w={"100%"} maxW={"276px"} mx={"auto"} pb={"s"}>
              <Text
                fontSize={"step1"}
                fontWeight={"900"}
                color={"grayCliff.solid.100"}
                textAlign={"center"}
              >
                Get Instant Access
              </Text>

              <ul
                style={{
                  listStyleType: "disc",
                  paddingLeft: "20px",
                  marginTop: "2px",
                }}
              >
                <Box
                  as="li"
                  color={"grayCliff.solid.400"}
                  _marker={{ color: "#9C9888" }}
                >
                  Follow us on Social Media
                </Box>
                <Box
                  as="li"
                  color={"grayCliff.solid.400"}
                  _marker={{ color: "#9C9888" }}
                >
                  Invite 3 Friends to Enter to lince
                </Box>
              </ul>
            </Box>

            {/* social redirection */}
            <GetInFasterPopupSocialRedirection />

            {/* Copy URL */}
            <GetInFasterLinkClipboard value="https://lince.com/?invite=181804" />
          </VStack>
        </MotionBox>
      )}
    </AnimatePresence>
  );
}
