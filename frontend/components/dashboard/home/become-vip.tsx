import VipImage from "@/assets/become-vip.svg";

import { Box, HStack, Image, Text } from "@chakra-ui/react";
import { faClose, faExternalLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function BecomeVIP() {
  return (
    <HStack
      alignItems={"center"}
      justifyContent={"space-between"}
      gap={"4xs"}
      w={"100%"}
      px={"s"}
      py={"m"}
      rounded={"12px"}
      bg={"grayCliff.solid.950"}
      border={"1px solid"}
      borderColor={"grayCliff.solid.800"}
      position={"relative"}
    >
      {/* Left */}
      <Box>
        <Text fontSize={"step -1"} color={"grayCliff.solid.100"}>
          Enjoy personalized support and exclusive investments strategies.
          (+100k deposit)
        </Text>

        <HStack
          alignItems={"center"}
          gap={"5xs"}
          color={"goldFang.solid.50"}
          mt={"14px"}
        >
          <Text fontSize={"step -1"}>Become VIP</Text>

          <Box>
            <FontAwesomeIcon icon={faExternalLink} />
          </Box>
        </HStack>
      </Box>

      {/* Right */}
      <Box w={"100%"}>
        <Image src={VipImage.src} alt="banner-img" />
      </Box>

      {/* Close Icon */}
      <Box position={"absolute"} top={"m"} right={"s"}>
        <FontAwesomeIcon icon={faClose} color="#CABE90" />
      </Box>
    </HStack>
  );
}
