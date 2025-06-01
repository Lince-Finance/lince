import QrCode from "@/assets/qr-code-overlay.svg";
import { emailLoginBtnStyles } from "@/styles/reusable-styles";

import { Box, Button, Image, Text, VStack } from "@chakra-ui/react";

const DesktopBanner = ({ onContinue }: { onContinue: () => void }) => (
  <Box
    position="fixed"
    top="0"
    left="0"
    w="100%"
    h="dvh"
    bg="black"
    color="white"
    display="flex"
    alignItems="center"
    justifyContent="center"
    zIndex="overlay"
    p={4}
  >
    <VStack textAlign="center" maxW="350px">
      {/* Image */}
      <Image src={QrCode.src} alt="qr-code" />

      <Text
        fontSize="27px"
        fontWeight="900"
        color={"grayCliff.solid.100"}
        mt={2}
      >
        Scan the QR
      </Text>

      <Text color={"grayCliff.solid.400"} fontSize={"19px"}>
        Lince is better on mobile devices. Scan the QR to Continue on Mobile. We
        will build the Desktop experience soon.
      </Text>

      <Button {...emailLoginBtnStyles} onClick={onContinue} mt={"xl"}>
        Continue on Desktop
      </Button>
    </VStack>
  </Box>
);

export default DesktopBanner;
