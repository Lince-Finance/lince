import { getInFasterSocialLink } from "@/data/placeholder-data";
import { Center, HStack } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export default function GetInFasterPopupSocialRedirection() {
  return (
    <HStack
      alignItems={"center"}
      w={"100%"}
      border={"1px solid"}
      borderColor={"grayCliff.solid.900"}
      rounded={"l2"}
    >
      {getInFasterSocialLink?.map(({ icon, targetText }, idx) => (
        <Center
          key={targetText}
          as={"button"}
          color={"goldFang.solid.50"}
          w={"100%"}
          h={12}
          borderRight={
            idx === getInFasterSocialLink.length - 1 ? "none" : "1px solid"
          }
          borderColor={"grayCliff.solid.900"}
        >
          <FontAwesomeIcon icon={icon} />
        </Center>
      ))}
    </HStack>
  );
}
